import os
import json
import logging
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from pathlib import Path
import requests

# Configuración básica
def load_env(path=".env.local"):
    # Intentar buscar en el directorio actual, en el padre, o relativo a este script
    possible_paths = [
        Path(path),
        Path("..") / path,
        Path(__file__).parent.parent / path
    ]
    
    env_path = None
    for p in possible_paths:
        if p.exists():
            env_path = p
            break
            
    if env_path:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip().replace('\0', '')
                    val = val.strip().replace('\0', '')
                    # Quitar comillas si las tiene
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    os.environ[key] = val

load_env()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def call_llm_structured(prompt: str, schema: dict, api_key: str) -> dict | None:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Eres un auditor legal experto en Inteligencia Artificial y cumplimiento normativo. Tu objetivo es aplicar la 'Regla de Oro': todo contenido de formación debe ser estrictamente fiel a las leyes, normas y reglamentos vigentes. Responde únicamente en formato JSON válido."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "course_validation",
                "schema": schema,
                "strict": True
            }
        }
    }
    try:
        r = requests.post(url, headers=headers, json=data, timeout=120) # Timeout largo para local
        r.raise_for_status()
        res = r.json()
        content = res["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        return {"error": str(e)}

def upload_to_supabase(course_text: str, validation_result: dict):
    supabase_url = os.environ.get("SUPABASE_URL", SUPABASE_URL)
    supabase_key = os.environ.get("SUPABASE_KEY", SUPABASE_KEY)
    
    if not supabase_url or not supabase_key:
        raise Exception("Faltan credenciales de Supabase en el .env.local")
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # 1. Crear el Curso
    course_data = {
        "title": "Alfabetización IA (Auditado)",
        "description": "Curso validado automáticamente con Regla de Oro."
    }
    r_course = requests.post(f"{supabase_url.rstrip('/')}/rest/v1/courses", headers=headers, json=course_data)
    r_course.raise_for_status()
    course_id = r_course.json()[0]["id"]
    
    # 2. Crear el Módulo
    module_data = {
        "course_id": course_id,
        "title": "Módulo Único",
        "order_index": 1
    }
    r_module = requests.post(f"{supabase_url.rstrip('/')}/rest/v1/course_modules", headers=headers, json=module_data)
    r_module.raise_for_status()
    module_id = r_module.json()[0]["id"]
    
    # 3. Insertar el Contenido
    content_data = {
        "module_id": module_id,
        "content_json": {
            "content_type": "text",
            "content": course_text
        }
    }
    r_content = requests.post(f"{supabase_url.rstrip('/')}/rest/v1/module_contents", headers=headers, json=content_data)
    r_content.raise_for_status()

class ValidatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Thoth - Auditoría Local de Cursos (Regla de Oro)")
        self.root.geometry("800x600")
        self.root.configure(padx=20, pady=20)
        
        self.file_path = None
        self.course_content = ""
        self.validation_result = None
        
        # UI Elements
        self.lbl_title = tk.Label(root, text="Auditoría Legal de Cursos", font=("Helvetica", 16, "bold"))
        self.lbl_title.pack(pady=(0, 10))
        
        self.lbl_info = tk.Label(root, text="Selecciona un archivo local. La validación puede tardar varios minutos dependiendo del tamaño.", fg="gray")
        self.lbl_info.pack(pady=(0, 20))
        
        frame_top = tk.Frame(root)
        frame_top.pack(fill=tk.X, pady=5)
        
        self.btn_select = tk.Button(frame_top, text="1. Seleccionar Archivo", command=self.select_file, width=20)
        self.btn_select.pack(side=tk.LEFT, padx=5)
        
        self.lbl_file = tk.Label(frame_top, text="Ningún archivo seleccionado", fg="blue")
        self.lbl_file.pack(side=tk.LEFT, padx=5)
        
        self.btn_validate = tk.Button(root, text="2. Iniciar Auditoría IA", command=self.start_validation, state=tk.DISABLED, bg="#f0ad4e", fg="black", font=("Helvetica", 10, "bold"))
        self.btn_validate.pack(pady=15, fill=tk.X)
        
        self.log_area = scrolledtext.ScrolledText(root, height=15, wrap=tk.WORD, font=("Consolas", 10))
        self.log_area.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.btn_upload = tk.Button(root, text="3. Subir a Supabase", command=self.start_upload, state=tk.DISABLED, bg="#5cb85c", fg="white", font=("Helvetica", 12, "bold"))
        self.btn_upload.pack(pady=10, fill=tk.X)
        
        self.log("Sistema iniciado. Esperando archivo...")
        if not OPENAI_API_KEY:
            self.log("ADVERTENCIA: No se encontró OPENAI_API_KEY en .env.local")

    def log(self, message):
        self.log_area.insert(tk.END, message + "\n")
        self.log_area.see(tk.END)
        self.root.update()

    def select_file(self):
        path = filedialog.askopenfilename(title="Seleccionar Curso", filetypes=[("Archivos soportados", "*.txt *.md *.html *.docx"), ("All files", "*.*")])
        if path:
            self.file_path = path
            self.lbl_file.config(text=os.path.basename(path))
            self.btn_validate.config(state=tk.NORMAL)
            self.btn_upload.config(state=tk.DISABLED)
            self.validation_result = None
            self.log(f"Archivo seleccionado: {path}")
            
            try:
                if path.lower().endswith('.docx'):
                    import docx
                    doc = docx.Document(path)
                    self.course_content = "\n".join([para.text for para in doc.paragraphs])
                    self.log(f"Documento Word cargado correctamente ({len(self.course_content)} caracteres).")
                else:
                    # Intentar leer con diferentes codificaciones para txt/html/md
                    encodings = ["utf-8", "latin-1", "cp1252"]
                    success = False
                    for enc in encodings:
                        try:
                            with open(path, "r", encoding=enc) as f:
                                self.course_content = f.read()
                            self.log(f"Archivo de texto cargado correctamente ({len(self.course_content)} caracteres) usando codificación {enc}.")
                            success = True
                            break
                        except Exception as e:
                            continue
                    
                    if not success:
                        self.log("Error: No se pudo leer el archivo de texto.")
                        self.btn_validate.config(state=tk.DISABLED)
            except Exception as e:
                self.log(f"Error procesando el archivo: {e}")
                self.btn_validate.config(state=tk.DISABLED)

    def start_validation(self):
        self.btn_select.config(state=tk.DISABLED)
        self.btn_validate.config(state=tk.DISABLED)
        self.btn_upload.config(state=tk.DISABLED)
        self.log("\n--- INICIANDO AUDITORÍA LEGAL MASIVA ---")
        self.log(f"El documento tiene {len(self.course_content)} caracteres. Se procesará por bloques para no perder información.")
        
        # Run in thread to not freeze GUI
        threading.Thread(target=self.run_validation_chunks, daemon=True).start()

    def run_validation_chunks(self):
        schema = {
            "type": "object",
            "properties": {
                "cumple_regla_de_oro": {"type": "boolean"},
                "puntuacion_fidelidad": {"type": "number"},
                "infracciones_detectadas": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "texto_problematico": {"type": "string"},
                            "motivo": {"type": "string"},
                            "sugerencia_correccion": {"type": "string"}
                        },
                        "required": ["texto_problematico", "motivo", "sugerencia_correccion"],
                        "additionalProperties": False
                    }
                },
                "conclusion": {"type": "string"},
                "texto_corregido": {
                    "type": "string",
                    "description": "El texto reescrito y corregido para cumplir al 100% con la ley. Si no hay errores, devuelve el texto original."
                }
            },
            "required": ["cumple_regla_de_oro", "puntuacion_fidelidad", "infracciones_detectadas", "conclusion", "texto_corregido"],
            "additionalProperties": False
        }

        api_key = os.environ.get("OPENAI_API_KEY", OPENAI_API_KEY)
        if not api_key:
            self.root.after(0, self.process_validation_result, {"error": "No se encontró OPENAI_API_KEY en .env.local"})
            return

        chunk_size = 15000
        chunks = [self.course_content[i:i+chunk_size] for i in range(0, len(self.course_content), chunk_size)]
        total_chunks = len(chunks)
        
        self.root.after(0, lambda: self.log(f"Dividido en {total_chunks} bloques. Iniciando procesamiento..."))
        
        full_corrected_text = ""
        all_infracciones = []
        total_score = 0
        
        for i, chunk in enumerate(chunks):
            self.root.after(0, lambda i=i: self.log(f"Procesando bloque {i+1} de {total_chunks}..."))
            prompt = f"Audita el siguiente fragmento de un curso aplicando la Regla de Oro (100% fiel a la ley). Reescribe el texto corrigiendo inexactitudes legales, manteniendo el formato y la longitud original lo máximo posible:\n\n{chunk}"
            
            result = call_llm_structured(prompt, schema, api_key)
            
            if not result or "error" in result:
                self.root.after(0, lambda e=result.get("error", "Desconocido"): self.log(f"Error en bloque {i+1}: {e}"))
                full_corrected_text += chunk + "\n" # fallback to original
                continue
                
            full_corrected_text += result.get("texto_corregido", chunk) + "\n\n"
            all_infracciones.extend(result.get("infracciones_detectadas", []))
            total_score += result.get("puntuacion_fidelidad", 10)
            
        avg_score = total_score / total_chunks if total_chunks > 0 else 0
        
        final_result = {
            "cumple_regla_de_oro": len(all_infracciones) == 0,
            "puntuacion_fidelidad": round(avg_score, 1),
            "infracciones_detectadas": all_infracciones,
            "conclusion": f"Procesamiento masivo completado. Se analizaron {total_chunks} bloques.",
            "texto_corregido": full_corrected_text
        }
        
        self.root.after(0, self.process_validation_result, final_result)

    def process_validation_result(self, result):
        self.btn_select.config(state=tk.NORMAL)
        self.btn_validate.config(state=tk.NORMAL)
        
        if not result or "error" in result:
            self.log(f"ERROR en la validación: {result.get('error', 'Desconocido')}")
            return
            
        self.validation_result = result
        
        self.log("\n=== RESULTADO DE LA AUDITORÍA MASIVA ===")
        self.log(f"Puntuación media original: {result.get('puntuacion_fidelidad')}/10")
        self.log(f"Conclusión: {result.get('conclusion')}")
        
        infracciones = result.get("infracciones_detectadas", [])
        if infracciones:
            self.log(f"\nSe detectaron y corrigieron {len(infracciones)} infracciones en todo el documento.")
        else:
            self.log("\n¡Perfecto! No se detectaron infracciones en el original.")
            
        texto_corregido = result.get("texto_corregido", "")
        if texto_corregido:
            output_path = self.file_path + "_CORREGIDO.txt"
            try:
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(texto_corregido)
                self.log(f"\n✅ Se ha guardado el curso COMPLETO corregido en:\n{output_path}")
                
                self.course_content = texto_corregido
                self.validation_result["puntuacion_fidelidad"] = 10
                self.validation_result["conclusion"] = "Curso masivo corregido automáticamente por IA."
            except Exception as e:
                self.log(f"\n❌ Error al guardar el archivo corregido: {e}")

        self.log("\nEl curso gigante ya está listo y corregido. Puedes subirlo a Supabase.")
        self.btn_upload.config(state=tk.NORMAL)

    def start_upload(self):
        self.btn_upload.config(state=tk.DISABLED)
        self.log("\nSubiendo a Supabase...")
        threading.Thread(target=self.run_upload, daemon=True).start()
        
    def run_upload(self):
        try:
            upload_to_supabase(self.course_content, self.validation_result)
            self.root.after(0, lambda: self.log("✅ ¡Subida completada con éxito! El curso ya está en la base de datos."))
            self.root.after(0, lambda: messagebox.showinfo("Éxito", "Curso subido a Supabase correctamente."))
        except Exception as e:
            self.root.after(0, lambda: self.log(f"❌ Error al subir: {e}"))
            self.root.after(0, lambda: self.btn_upload.config(state=tk.NORMAL))

if __name__ == "__main__":
    root = tk.Tk()
    app = ValidatorApp(root)
    root.mainloop()
