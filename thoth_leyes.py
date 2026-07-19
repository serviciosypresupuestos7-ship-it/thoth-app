import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import os
import requests
from bs4 import BeautifulSoup

# Configuración de apariencia
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

OFFICIAL_SOURCES = [
    # 1. Normativa vinculante
    {"title": "1_AI_Act_Reglamento_2024_1689", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689"},
    {"title": "1_RGPD_Reglamento_2016_679", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0679"},
    {"title": "1_ePrivacy_Directiva_2002_58", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32002L0058"},
    {"title": "1_Data_Act_Reglamento_2023_2854", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32023R2854"},
    {"title": "1_Data_Governance_Act_2022_868", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32022R0868"},
    {"title": "1_DSA_Servicios_Digitales_2022_2065", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32022R2065"},
    {"title": "1_DMA_Mercados_Digitales_2022_1925", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32022R1925"},
    {"title": "1_NIS2_Ciberseguridad_2022_2555", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32022L2555"},
    {"title": "1_eIDAS_2_Identidad_Digital_2024_1183", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32024R1183"},
    {"title": "1_Responsabilidad_Productos_2024_2853", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32024L2853"},
    {"title": "1_LOPDGDD_Ley_Organica_3_2018", "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673&p=20230509&tn=1"},
    {"title": "1_Estatuto_Trabajadores_RD_2_2015", "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430"},
    {"title": "1_Ley_Riders_12_2021", "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2021-16477"},
    {"title": "1_Estatuto_AESIA_RD_729_2023", "url": "https://www.boe.es/buscar/doc.php?id=BOE-A-2023-19911"},
    {"title": "1_Esquema_Nacional_Seguridad_311_2022", "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191"},
    
    # 2. Directrices oficiales no vinculantes
    {"title": "2_FAQ_Articulo_4_Comision_Europea", "url": "https://digital-strategy.ec.europa.eu/es/policies/ai-act-faq"},
    {"title": "2_Guias_AESIA_Sandbox", "url": "https://digital.gob.es/es/ministerio/proyectos-singulares/sandbox-de-inteligencia-artificial"},
    
    # 4. Marcos voluntarios internacionales
    {"title": "4_NIST_AI_RMF", "url": "https://www.nist.gov/itl/ai-risk-management-framework"},
    {"title": "4_UNESCO_Etica_IA", "url": "https://www.unesco.org/es/artificial-intelligence/recommendation-ethics"},
    {"title": "4_DigComp_3_0", "url": "https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"},
    
    # 5. Historico o seguimiento
    {"title": "5_AI_Liability_Directive_Propuesta", "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:52022PC0496"}
]

class ThothLeyesApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("THOTH - Descargador de Leyes")
        self.geometry("600x450")
        self.resizable(False, False)

        self.title_label = ctk.CTkLabel(self, text="THOTH LEYES", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.pack(pady=20)

        ctk.CTkLabel(self, text="Este programa descargará las leyes oficiales y las guardará\ncomo archivos de texto (.txt) en la carpeta 'Leyes_Descargadas'.\nLuego podrás subirlas a la web de Thoth.", text_color="gray").pack(pady=10)

        self.start_btn = ctk.CTkButton(self, text="▶ DESCARGAR LEYES CONFIGURADAS", font=ctk.CTkFont(size=16, weight="bold"), height=40, command=self.start_crawler)
        self.start_btn.pack(pady=10)

        self.search_btn = ctk.CTkButton(self, text="🔍 RADAR: BUSCAR NUEVAS LEYES DE IA", font=ctk.CTkFont(size=14, weight="bold"), height=40, fg_color="#d97706", hover_color="#b45309", command=self.start_radar)
        self.search_btn.pack(pady=10)

        self.log_textbox = ctk.CTkTextbox(self, width=550, height=150, state="disabled")
        self.log_textbox.pack(pady=10)

        self.progress_bar = ctk.CTkProgressBar(self, width=550)
        self.progress_bar.set(0)
        self.progress_bar.pack(pady=10)

        self.is_running = False

    def log(self, message):
        def update_gui():
            self.log_textbox.configure(state="normal")
            self.log_textbox.insert("end", message + "\n")
            self.log_textbox.see("end")
            self.log_textbox.configure(state="disabled")
            self.update_idletasks()
        self.after(0, update_gui)

    def start_radar(self):
        if self.is_running:
            return
        self.is_running = True
        self.search_btn.configure(state="disabled", text="BUSCANDO...")
        self.log_textbox.configure(state="normal")
        self.log_textbox.delete("1.0", "end")
        self.log_textbox.configure(state="disabled")
        threading.Thread(target=self.run_radar, daemon=True).start()

    def run_radar(self):
        try:
            self.log("📡 Iniciando Radar de Novedades Legales...")
            self.log("Buscando 'Inteligencia Artificial' en el BOE (últimas publicaciones)...")
            
            # Buscar en el BOE
            boe_url = "https://www.boe.es/buscar/boe.php?campo%5B0%5D=DOC&dato%5B0%5D=%22inteligencia+artificial%22&accion=Buscar"
            response = requests.get(boe_url, headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(response.text, "html.parser")
            
            resultados = soup.find_all("li", class_="resultado-busqueda")
            
            if not resultados:
                self.log("✅ No se han encontrado nuevas leyes recientes en el BOE.")
            else:
                self.log(f"\n⚠️ ¡ATENCIÓN! Se han encontrado {len(resultados[:5])} menciones recientes en el BOE:")
                for res in resultados[:5]: # Mostrar solo los 5 más recientes
                    titulo = res.find("h3")
                    if titulo:
                        self.log(f" 📄 {titulo.text.strip()}")
                
                self.log("\n(Revisa el BOE para ver si alguna de estas menciones requiere actualizar Thoth).")
                
        except Exception as e:
            self.log(f"\n❌ ERROR en el Radar: {str(e)}")
        finally:
            self.is_running = False
            self.after(0, lambda: self.search_btn.configure(state="normal", text="🔍 RADAR: BUSCAR NUEVAS LEYES DE IA"))

    def start_crawler(self):
        if self.is_running:
            return
        self.is_running = True
        self.start_btn.configure(state="disabled", text="DESCARGANDO...")
        self.log_textbox.configure(state="normal")
        self.log_textbox.delete("1.0", "end")
        self.log_textbox.configure(state="disabled")
        threading.Thread(target=self.run_crawler, daemon=True).start()

    def run_crawler(self):
        try:
            # Guardar en el disco D para no llenar el C
            output_dir = r"D:\proyectos antigravity\THOTH_Leyes_Descargadas"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)

            total = len(OFFICIAL_SOURCES)
            for index, source in enumerate(OFFICIAL_SOURCES):
                self.log(f"[{index+1}/{total}] Descargando: {source['title']}...")
                
                response = requests.get(source['url'], headers={"User-Agent": "Mozilla/5.0"})
                soup = BeautifulSoup(response.text, "html.parser")
                
                for script in soup(["script", "style", "nav", "header", "footer"]):
                    script.extract()
                
                text = soup.get_text(separator=" ")
                text = " ".join(text.split())
                
                file_path = os.path.join(output_dir, f"{source['title']}.txt")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(text)
                
                self.log(f"✅ Guardado: {source['title']}.txt")
                self.after(0, lambda v=(index + 1) / total: self.progress_bar.set(v))

            self.log("\n🎉 TODAS LAS LEYES DESCARGADAS.")
            self.after(0, lambda: messagebox.showinfo("Éxito", f"Leyes guardadas en la carpeta:\n{output_dir}\n\nAhora puedes subirlas a la plataforma web de Thoth."))
            
            # Abrir la carpeta en Windows
            try:
                os.system(f'explorer.exe "D:\\proyectos antigravity\\THOTH_Leyes_Descargadas"')
            except:
                pass

        except Exception as e:
            self.log(f"\n❌ ERROR: {str(e)}")
            self.after(0, lambda err=str(e): messagebox.showerror("Error", err))
        finally:
            self.is_running = False
            self.after(0, lambda: self.start_btn.configure(state="normal", text="▶ DESCARGAR LEYES CONFIGURADAS"))

if __name__ == "__main__":
    app = ThothLeyesApp()
    app.mainloop()
