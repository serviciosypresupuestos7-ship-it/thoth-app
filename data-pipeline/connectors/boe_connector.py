import xml.etree.ElementTree as ET
import requests
import logging

logger = logging.getLogger(__name__)

def search_boe(keywords: list[str], status: str = "vigente", jurisdiction: str = "estatal") -> list[str]:
    """
    Searches the BOE API for consolidated legislation matching the criteria.
    Returns a list of BOE IDs (e.g., 'BOE-A-2007-13409').
    """
    logger.info(f"Searching BOE for keywords: {keywords}, status: {status}, jurisdiction: {jurisdiction}")
    # In a real implementation, this would call the BOE Open Data API.
    # For now, we return a mock list of IDs based on the keywords to demonstrate the architecture.
    # The actual API endpoint would be something like: https://www.boe.es/datosabiertos/api/legislacion/v1/normativa
    
    mock_results = []
    if "autónomo" in [k.lower() for k in keywords] or "reta" in [k.lower() for k in keywords]:
        mock_results.extend(["BOE-A-2007-13409", "BOE-A-2015-11430"])
    if "facturación" in [k.lower() for k in keywords] or "iva" in [k.lower() for k in keywords]:
        mock_results.extend(["BOE-A-1992-28741", "BOE-A-2003-23186"])
        
    return list(set(mock_results))

def download_boe_consolidated(boe_id: str) -> dict | None:
    """
    Downloads and parses a consolidated legislation document from the BOE XML API.
    Returns a dictionary with metadata and structured text, or None if it fails.
    """
    url = f"https://www.boe.es/buscar/xml.php?id={boe_id}"
    headers = {"User-Agent": "Mozilla/5.0 (compatible; Thoth-Collector/1.0)"}
    
    try:
        logger.info(f"Downloading BOE consolidated XML for {boe_id}...")
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        
        root = ET.fromstring(r.content)
        
        # Extract metadata
        meta_elem = root.find("metadatos")
        if meta_elem is None:
            logger.error(f"No metadata found in BOE XML for {boe_id}")
            return None
            
        title = meta_elem.findtext("titulo") or ""
        rango = meta_elem.findtext("rango") or ""
        fecha_pub = meta_elem.findtext("fecha_publicacion") or ""
        
        # Map document type based on rango
        rango_lower = rango.lower()
        if "ley orgánica" in rango_lower:
            doc_type = "organic_law"
        elif "real decreto legislativo" in rango_lower:
            doc_type = "royal_legislative_decree"
        elif "real decreto" in rango_lower:
            doc_type = "royal_decree"
        elif "ley" in rango_lower:
            doc_type = "law"
        else:
            doc_type = "official_document"
            
        # Extract text and group by articles
        texto_elem = root.find("texto")
        if texto_elem is None:
            logger.error(f"No text found in BOE XML for {boe_id}")
            return None
            
        current_article = "Preámbulo"
        article_paragraphs = []
        articles = {}
        
        for p in texto_elem.findall("p"):
            p_class = p.attrib.get("class", "")
            p_text = "".join(p.itertext()).strip()
            if not p_text:
                continue
            
            # Check if it's an article header
            if p_class == "articulo" or p_text.startswith("Artículo "):
                if article_paragraphs:
                    articles[current_article] = "\n".join(article_paragraphs)
                current_article = p_text
                article_paragraphs = []
            else:
                article_paragraphs.append(p_text)
                
        if article_paragraphs:
            articles[current_article] = "\n".join(article_paragraphs)
            
        # Reconstruct full text with article headers
        full_text_parts = []
        for art, text in articles.items():
            full_text_parts.append(f"## {art}\n{text}")
        full_text = "\n\n".join(full_text_parts)
        
        return {
            "title": title,
            "url": f"https://www.boe.es/buscar/act.php?id={boe_id}",
            "final_url": f"https://www.boe.es/buscar/act.php?id={boe_id}",
            "authority": "BOE",
            "jurisdiction": "España",
            "document_type": doc_type,
            "binding_level": "binding",
            "text": full_text,
            "articles": articles
        }
        
    except Exception as e:
        logger.error(f"Error downloading or parsing BOE ID {boe_id}: {e}")
        return None
