import io
import re
from pypdf import PdfReader

def clean_text(text: str) -> str:
    text = text.replace("\u00ad", "")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract_pdf(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    pages = []
    for i, page in enumerate(reader.pages, start=1):
        txt = page.extract_text() or ""
        pages.append(f"\n[PÁGINA {i}]\n{txt}")
    return clean_text("\n".join(pages))
