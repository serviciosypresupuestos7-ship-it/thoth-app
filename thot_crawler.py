import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import time
import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import hashlib
import uuid
import openai

# Configuración de apariencia
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# ==========================================
# CONFIGURACIÓN DE FUENTES OFICIALES
# ==========================================
OFFICIAL_SOURCES = [
    {
        'id': 'ai-act',
        'title': 'Reglamento (UE) 2024/1689 (AI Act)',
        'level': '1. Normativa vinculante',
        'url': 'https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689'
    },
    {
        'id': 'rgpd',
        'title': 'Reglamento (UE) 2016/679 (RGPD)',
        'level': '1. Normativa vinculante',
        'url': 'https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0679'
    },
    {
        'id': 'lopdgdd',
        'title': 'Ley Orgánica 3/2018 (LOPDGDD)',
        'level': '1. Normativa vinculante',
        'url': 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673&p=20230509&tn=1'
    }
]

class ThotCrawlerApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("THOTH - Crawler Legal Oficial")
        self.geometry("700x600")
        self.resizable(False, False)

        # Título
        self.title_label = ctk.CTkLabel(self, text="THOTH LEGAL CRAWLER", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.pack(pady=20)

        # Frame de Credenciales
        self.creds_frame = ctk.CTkFrame(self)
        self.creds_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(self.creds_frame, text="Credenciales de Supabase y OpenAI", font=ctk.CTkFont(weight="bold")).pack(pady=5)

        self.supabase_url_entry = ctk.CTkEntry(self.creds_frame, placeholder_text="NEXT_PUBLIC_SUPABASE_URL", width=600)
        self.supabase_url_entry.pack(pady=5)

        self.supabase_key_entry = ctk.CTkEntry(self.creds_frame, placeholder_text="SUPABASE_SERVICE_ROLE_KEY", width=600, show="*")
        self.supabase_key_entry.pack(pady=5)

        self.openai_key_entry = ctk.CTkEntry(self.creds_frame, placeholder_text="OPENAI_API_KEY", width=600, show="*")
        self.openai_key_entry.pack(pady=5)

        # Botón de Arranque
        self.start_btn = ctk.CTkButton(self, text="▶ INICIAR DESCARGA E INGESTA", font=ctk.CTkFont(size=16, weight="bold"), height=50, command=self.start_crawler)
        self.start_btn.pack(pady=20)

        # Log de Consola
        self.log_textbox = ctk.CTkTextbox(self, width=650, height=200, state="disabled")
        self.log_textbox.pack(pady=10)

        # Progress Bar
        self.progress_bar = ctk.CTkProgressBar(self, width=650)
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

        supabase_url = self.supabase_url_entry.get().strip()
        supabase_key = self.supabase_key_entry.get().strip()
        openai_key = self.openai_key_entry.get().strip()

        if not supabase_url or not supabase_key or not openai_key:
            messagebox.showerror("Error", "Por favor, introduce todas las credenciales.")
            return

        self.is_running = True
        self.start_btn.configure(state="disabled", text="PROCESANDO...")
        self.log_textbox.configure(state="normal")
        self.log_textbox.delete("1.0", "end")
        self.log_textbox.configure(state="disabled")

        threading.Thread(target=self.run_crawler, args=(supabase_url, supabase_key, openai_key), daemon=True).start()

    def chunk_text(self, text, max_chunk_size=2000):
        chunks = []
        current_chunk = ""
        sentences = text.split(". ")
        for sentence in sentences:
            if len(current_chunk) + len(sentence) > max_chunk_size and len(current_chunk) > 0:
                chunks.append(current_chunk.strip())
                current_chunk = ""
            current_chunk += sentence + ". "
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        return chunks

    def run_crawler(self, supabase_url, supabase_key, openai_key):
        try:
            self.log("Conectando a Supabase...")
            supabase: Client = create_client(supabase_url, supabase_key)
            openai.api_key = openai_key

            total_sources = len(OFFICIAL_SOURCES)
            
            for index, source in enumerate(OFFICIAL_SOURCES):
                self.log(f"\n[{index+1}/{total_sources}] Descargando: {source['title']}")
                
                # Descargar HTML
                response = requests.get(source['url'], headers={'User-Agent': 'Mozilla/5.0'})
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Limpiar
                for script in soup(["script", "style", "nav", "header", "footer"]):
                    script.extract()
                
                text = soup.get_text(separator=' ')
                text = ' '.join(text.split())
                
                # Limitar para no saturar la API en la demo
                limited_text = text[:20000]
                
                self.log(f"✅ Texto extraído ({len(limited_text)} caracteres).")
                
                chunks = self.chunk_text(limited_text)
                self.log(f"🔪 Dividido en {len(chunks)} fragmentos.")

                doc_id = str(uuid.uuid4())
                doc_hash = hashlib.sha256(limited_text.encode()).hexdigest()

                self.log("💾 Guardando metadatos en Supabase...")
                supabase.table('legal_documents').insert({
                    'id': doc_id,
                    'tenant_id': '00000000-0000-0000-0000-000000000000',
                    'domain_id': 'global',
                    'title': source['title'],
                    'text': limited_text[:5000],
                    'document_type': 'law',
                    'sha256': doc_hash,
                    'authority': 'Oficial',
                    'retrieved_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                }).execute()

                self.log(f"🧠 Vectorizando {len(chunks)} chunks con OpenAI...")
                
                for i, chunk in enumerate(chunks):
                    chunk_hash = hashlib.sha256(chunk.encode()).hexdigest()
                    
                    # Llamada a OpenAI
                    res = openai.Embedding.create(
                        input=chunk,
                        model="text-embedding-ada-002"
                    )
                    vector = res['data'][0]['embedding']

                    supabase.table('legal_chunks').insert({
                        'document_id': doc_id,
                        'tenant_id': '00000000-0000-0000-0000-000000000000',
                        'domain_id': 'global',
                        'chunk_index': i,
                        'title': f"{source['title']} - Parte {i+1}",
                        'text': chunk,
                        'sha256': chunk_hash,
                        'embedding': vector,
                        'embedding_provider': 'openai',
                        'embedding_model': 'text-embedding-ada-002',
                        'embedding_dimensions': 1536,
                        'embedding_version': '1.0'
                    }).execute()
                    
                    if (i + 1) % 5 == 0:
                        self.log(f"   ... {i+1}/{len(chunks)} chunks subidos.")
                
                self.log(f"✅ {source['title']} completado.")
                self.progress_bar.set((index + 1) / total_sources)

            self.log("\n🎉 PROCESO COMPLETADO CON ÉXITO.")
            messagebox.showinfo("Éxito", "Todas las leyes han sido descargadas, vectorizadas y subidas a Supabase.")

        except Exception as e:
            self.log(f"\n❌ ERROR: {str(e)}")
            messagebox.showerror("Error", f"Ha ocurrido un error:\n{str(e)}")
        finally:
            self.is_running = False
            self.start_btn.configure(state="normal", text="▶ INICIAR DESCARGA E INGESTA")

if __name__ == "__main__":
    app = ThotCrawlerApp()
    app.mainloop()
