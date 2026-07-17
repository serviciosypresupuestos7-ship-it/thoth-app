import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urldefrag

def normalize_url(url: str) -> str:
    clean, _ = urldefrag(url.strip())
    return clean

def clean_text(text: str) -> str:
    text = text.replace("\u00ad", "")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract_html(data: bytes, base_url: str, relevant_terms: list[str], allowed_domains: list[str]) -> tuple[str, str, list[str]]:
    soup = BeautifulSoup(data, "lxml")
    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer", "header", "form"]):
        tag.decompose()

    title = ""
    if soup.title:
        title = clean_text(soup.title.get_text(" ", strip=True))
    h1 = soup.find("h1")
    if h1:
        title = clean_text(h1.get_text(" ", strip=True)) or title

    main = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id=re.compile(r"(content|main|texto|document)", re.I))
        or soup.body
        or soup
    )

    blocks = []
    if main:
        for node in main.find_all(["h1", "h2", "h3", "h4", "p", "li", "th", "td"]):
            txt = clean_text(node.get_text(" ", strip=True))
            if not txt:
                continue
            if node.name in {"h1", "h2", "h3", "h4"}:
                blocks.append(f"\n## {txt}\n")
            else:
                blocks.append(txt)

    links = []
    for a in soup.find_all("a", href=True):
        absolute = normalize_url(urljoin(base_url, a["href"]))
        label = clean_text(a.get_text(" ", strip=True)).lower()
        href_lower = absolute.lower()
        
        domain_allowed = urlparse(absolute).netloc.lower() in allowed_domains
        
        if domain_allowed and (
            href_lower.endswith(".pdf")
            or any(term in f"{label} {href_lower}" for term in relevant_terms)
        ):
            links.append(absolute)

    return title, clean_text("\n".join(blocks)), sorted(set(links))
