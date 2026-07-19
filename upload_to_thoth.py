import os
import requests
import json
import time

# URL de la API de Thoth en Vercel
API_URL = "https://thoth-k8vmuzzrq-ley34.vercel.app/api/documents/ingest"
SECRET_TOKEN = "thoth-ingest-secret-2026"

# Carpeta donde están las leyes descargadas
FOLDER_PATH = r"D:\proyectos antigravity\THOTH_Leyes_Descargadas"

def upload_laws():
    if not os.path.exists(FOLDER_PATH):
        print(f"La carpeta {FOLDER_PATH} no existe.")
        return

    files = [f for f in os.listdir(FOLDER_PATH) if f.endswith(".txt")]
    
    if not files:
        print("No hay archivos .txt en la carpeta.")
        return

    print(f"Iniciando subida de {len(files)} leyes a Thoth (Supabase)...")
    
    for i, filename in enumerate(files):
        file_path = os.path.join(FOLDER_PATH, filename)
        title = filename.replace(".txt", "")
        
        print(f"\n[{i+1}/{len(files)}] Subiendo: {title}...")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
            
            # Limitar a 30000 caracteres para evitar timeouts en Vercel (Serverless Functions tienen límite de 10s-60s)
            # El RAG troceará esto internamente
            limited_text = text[:30000]
            
            payload = {
                "title": title,
                "text": limited_text,
                "document_type": "law"
            }
            
            headers = {
                "Content-Type": "application/json",
                "x-secret-token": SECRET_TOKEN
            }
            
            response = requests.post(API_URL, json=payload, headers=headers)
            
            if response.status_code == 200:
                print(f"Exito! {title} indexado en el RAG de Supabase.")
            else:
                print(f"Error del servidor ({response.status_code}): {response.text}")
                
        except Exception as e:
            print(f"Error al procesar {filename}: {str(e)}")
            
        # Pequeña pausa para no saturar la API
        time.sleep(2)
        
    print("\nPROCESO DE SUBIDA COMPLETADO!")
    print("Todas las leyes estan ahora en Supabase y listas para ser usadas por la IA.")

if __name__ == "__main__":
    upload_laws()
