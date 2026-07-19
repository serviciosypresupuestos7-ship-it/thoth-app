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
    {
        "id": "ai-act",
        "title": "Reglamento (UE) 2024_1689 (AI Act)",
        "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689"
    },
    {
        "id": "rgpd",
        "title": "Reglamento (UE) 2016_679 (RGPD)",
        "url": "https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0679"
    },
    {
        "id": "lopdgdd",
        "title": "Ley Organica 3_2018 (LOPDGDD)",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673&p=20230509&tn=1"
    },
    {
        "id": "estatuto-trabajadores",
        "title": "Estatuto de los Trabajadores",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430"
    },
    {
        "id": "aesia",
        "title": "Estatuto AESIA",
        "url": "https://www.boe.es/buscar/doc.php?id=BOE-A-2023-19911"
    }
]

class ThotCrawlerApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("THOTH - Descargador de Leyes")
        self.geometry("600x450")
        self.resizable(False, False)

        self.title_label = ctk.CTkLabel(self, text="THOTH LEGAL CRAWLER", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.pack(pady=20)

        ctk.CTkLabel(self, text="Este programa descargará las leyes oficiales y las guardará\ncomo archivos de texto (.txt) en la carpeta 'Leyes_Descargadas'.\nLuego podrás subirlas a la web de Thoth.", text_color="gray").pack(pady=10)

        self.start_btn = ctk.CTkButton(self, text="▶ DESCARGAR LEYES", font=ctk.CTkFont(size=16, weight="bold"), height=50, command=self.start_crawler)
        self.start_btn.pack(pady=20)

        self.log_textbox = ctk.CTkTextbox(self, width=550, height=150, state="disabled")
        self.log_textbox.pack(pady=10)

        self.progress_bar = ctk.CTkProgressBar(self, width=550)
        self.progress_bar.set(0)
        self.progress_bar.pack(pady=10)

        self.is_running = False

    def log(self, message):
        self.log_textbox.configure(state="normal")
        self.log_textbox.insert("end", message + "\n")
        self.log_textbox.see("end")
        self.log_textbox.configure(state="disabled")
        self.update_idletasks()

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
            output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Leyes_Descargadas")
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
                self.progress_bar.set((index + 1) / total)

            self.log("\n🎉 TODAS LAS LEYES DESCARGADAS.")
            messagebox.showinfo("Éxito", f"Leyes guardadas en la carpeta:\n{output_dir}\n\nAhora puedes subirlas a la plataforma web de Thoth.")
            
            # Intentar abrir la carpeta en Linux/WSL
            try:
                os.system(f'xdg-open "{output_dir}"')
            except:
                pass

        except Exception as e:
            self.log(f"\n❌ ERROR: {str(e)}")
            messagebox.showerror("Error", str(e))
        finally:
            self.is_running = False
            self.start_btn.configure(state="normal", text="▶ DESCARGAR LEYES")

if __name__ == "__main__":
    app = ThotCrawlerApp()
    app.mainloop()
