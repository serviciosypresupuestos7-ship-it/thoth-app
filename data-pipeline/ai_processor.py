import os
import json
import logging
import sys
import argparse
from pathlib import Path
import requests

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("ai_processor")

def load_env(path=".env"):
    """Loads environment variables from a .env file without external dependencies."""
    env_path = Path(path)
    if env_path.exists():
        logger.info(f"Loading environment from {env_path.resolve()}...")
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip()

def supabase_request(method: str, endpoint: str, supabase_url: str, supabase_key: str, data: list | dict = None, params: dict = None) -> requests.Response | None:
    """Sends a request to the Supabase REST API."""
    url = f"{supabase_url.rstrip('/')}/rest/v1/{endpoint}"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    try:
        if method.upper() == "GET":
            r = requests.get(url, headers=headers, params=params, timeout=30)
        elif method.upper() == "POST":
            headers["Prefer"] = "resolution=merge-duplicates"
            r = requests.post(url, headers=headers, json=data, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
            
        r.raise_for_status()
        return r
    except Exception as e:
        response_body = ""
        if 'r' in locals() and hasattr(r, 'text'):
            response_body = r.text
        logger.error(f"Supabase request to {endpoint} failed: {e}. Response: {response_body}")
        return None

def call_llm_structured(prompt: str, schema: dict, api_key: str) -> dict | None:
    """Calls OpenAI API with structured output (JSON Schema)."""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Eres un experto legal y de formación empresarial. Responde únicamente en formato JSON válido que cumpla con el esquema proporcionado."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "structured_output",
                "schema": schema,
                "strict": True
            }
        }
    }
    try:
        r = requests.post(url, headers=headers, json=data, timeout=30)
        r.raise_for_status()
        res = r.json()
        content = res["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        logger.error(f"Error calling LLM: {e}")
        return None

def get_mock_interpretation(chunk_text: str) -> dict:
    """Generates a mock classification for testing/offline mode."""
    return {
        "category": "Supervisión Humana" if "supervisión" in chunk_text.lower() else "Protección de Datos",
        "legal_status": "obligatorio" if "deberá" in chunk_text.lower() or "obligado" in chunk_text.lower() else "recomendado",
        "applies_to": ["proveedor", "responsable del despliegue"],
        "risk_level": "alto" if "riesgo" in chunk_text.lower() else "medio",
        "confidence": 0.95
    }

def get_mock_exercise(chunk_text: str, title: str, section: str) -> dict:
    """Generates a mock exercise for testing/offline mode."""
    return {
        "legal_requirement": f"Cumplir con lo establecido en {title} - {section}",
        "plain_language": "El trabajador debe entender y aplicar las directrices oficiales en su trabajo diario.",
        "department": "Administración",
        "job_role": "Administrativo",
        "task": "Revisar documentos generados por sistemas automatizados",
        "risk": "Aceptar información errónea o no verificada",
        "required_skill": "Pensamiento crítico y verificación de fuentes",
        "exercise_type": "simulation",
        "difficulty": "basic",
        "evidence": "El trabajador documenta la verificación del contenido"
    }

def main() -> int:
    parser = argparse.ArgumentParser(description="AI Processor for legal chunks classification and exercise generation")
    parser.add_argument("--domain", required=True, help="Domain name (e.g., ai_literacy, autonomos)")
    parser.add_argument("--env-file", default=".env", help="Path to the .env file")
    parser.add_argument("--mock", action="store_true", help="Use mock AI processing instead of calling OpenAI API")
    args = parser.parse_args()

    load_env(args.env_file)

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if not supabase_url or not supabase_key:
        logger.error("SUPABASE_URL and SUPABASE_KEY must be set in the environment or .env file.")
        return 1

    domain = args.domain

    # 1. Fetch chunks from Supabase for this domain
    logger.info(f"Fetching chunks for domain '{domain}' from Supabase...")
    # We select chunks for this domain. To avoid processing already processed chunks,
    # we can fetch interpretations first to see what chunk_ids are already processed.
    
    # Fetch existing interpretations
    r_interp = supabase_request("GET", "legal_interpretations", supabase_url, supabase_key, params={"domain_id": f"eq.{domain}", "select": "chunk_id"})
    if r_interp is None:
        logger.error("Failed to fetch existing interpretations.")
        return 1
    processed_chunk_ids = {item["chunk_id"] for item in r_interp.json()}
    logger.info(f"Found {len(processed_chunk_ids)} already processed chunks.")

    # Fetch all chunks
    r_chunks = supabase_request("GET", "legal_chunks", supabase_url, supabase_key, params={"domain_id": f"eq.{domain}", "select": "id,title,section,text,url,authority,jurisdiction,document_type,binding_level,topics"})
    if r_chunks is None:
        logger.error("Failed to fetch chunks from Supabase.")
        return 1
    all_chunks = r_chunks.json()
    logger.info(f"Found {len(all_chunks)} total chunks in Supabase.")

    # Filter unprocessed chunks
    unprocessed_chunks = [c for c in all_chunks if c["id"] not in processed_chunk_ids]
    logger.info(f"Found {len(unprocessed_chunks)} unprocessed chunks.")

    if not unprocessed_chunks:
        logger.info("No new chunks to process.")
        return 0

    # Define JSON schemas for structured output
    interpretation_schema = {
        "type": "object",
        "properties": {
            "category": {"type": "string", "description": "Categoría o tema principal del fragmento (ej. supervisión humana, transparencia, facturación, RETA)"},
            "legal_status": {"type": "string", "enum": ["obligatorio", "recomendado", "informativo"], "description": "Nivel de obligatoriedad jurídica"},
            "applies_to": {
                "type": "array",
                "items": {"type": "string"},
                "description": "A quién aplica (ej. proveedor, responsable, autónomo, pyme)"
            },
            "risk_level": {"type": "string", "enum": ["alto", "medio", "bajo"], "description": "Nivel de riesgo asociado al incumplimiento"},
            "confidence": {"type": "number", "description": "Nivel de confianza en la clasificación (0.0 a 1.0)"}
        },
        "required": ["category", "legal_status", "applies_to", "risk_level", "confidence"],
        "additionalProperties": False
    }

    exercise_schema = {
        "type": "object",
        "properties": {
            "legal_requirement": {"type": "string", "description": "El requisito legal resumido de forma clara"},
            "plain_language": {"type": "string", "description": "Explicación en lenguaje sencillo para un empleado"},
            "department": {"type": "string", "description": "Departamento de la empresa al que aplica (ej. Administración, Ventas, RRHH)"},
            "job_role": {"type": "string", "description": "Rol laboral específico (ej. Administrativo, Comercial, Gestor)"},
            "task": {"type": "string", "description": "Tarea laboral cotidiana donde se aplica el requisito"},
            "risk": {"type": "string", "description": "Riesgo práctico si el empleado no cumple el requisito"},
            "required_skill": {"type": "string", "description": "Habilidad o competencia requerida para evitar el riesgo"},
            "exercise_type": {"type": "string", "enum": ["simulation", "quiz", "roleplay"], "description": "Tipo de ejercicio propuesto"},
            "difficulty": {"type": "string", "enum": ["basic", "intermediate", "advanced"], "description": "Dificultad del ejercicio"},
            "evidence": {"type": "string", "description": "Evidencia de aprendizaje (cómo demuestra el empleado que ha aprendido)"}
        },
        "required": ["legal_requirement", "plain_language", "department", "job_role", "task", "risk", "required_skill", "exercise_type", "difficulty", "evidence"],
        "additionalProperties": False
    }

    for idx, chunk in enumerate(unprocessed_chunks):
        chunk_id = chunk["id"]
        chunk_text = chunk["text"]
        title = chunk["title"] or "Documento"
        section = chunk["section"] or "Sección"
        
        logger.info(f"[{idx+1}/{len(unprocessed_chunks)}] Processing chunk {chunk_id}...")

        # 1. Generate Classification/Interpretation
        interp = None
        if args.mock or not openai_key:
            if not args.mock:
                logger.warning("OPENAI_API_KEY not found. Using mock classification.")
            interp = get_mock_interpretation(chunk_text)
        else:
            prompt = f"Analiza el siguiente fragmento de texto oficial y clasifícalo jurídicamente:\n\nDocumento: {title}\nSección: {section}\nTexto:\n{chunk_text}"
            interp = call_llm_structured(prompt, interpretation_schema, openai_key)
            if not interp:
                logger.warning(f"Failed to classify chunk {chunk_id}. Using mock classification.")
                interp = get_mock_interpretation(chunk_text)

        # 2. Generate Training Exercise
        exercise = None
        if args.mock or not openai_key:
            exercise = get_mock_exercise(chunk_text, title, section)
        else:
            prompt = f"A partir del siguiente fragmento legal y su clasificación, genera una propuesta de ejercicio práctico de entrenamiento para empleados:\n\nDocumento: {title}\nSección: {section}\nTexto:\n{chunk_text}\n\nClasificación:\n{json.dumps(interp, ensure_ascii=False)}\n\nGenera un escenario práctico realista."
            exercise = call_llm_structured(prompt, exercise_schema, openai_key)
            if not exercise:
                logger.warning(f"Failed to generate exercise for chunk {chunk_id}. Using mock exercise.")
                exercise = get_mock_exercise(chunk_text, title, section)

        # 3. Upload to Supabase
        interp_data = {
            "chunk_id": chunk_id,
            "domain_id": domain,
            "category": interp["category"],
            "legal_status": interp["legal_status"],
            "applies_to": interp["applies_to"],
            "risk_level": interp["risk_level"],
            "confidence": interp["confidence"]
        }
        
        exercise_data = {
            "chunk_id": chunk_id,
            "domain_id": domain,
            "legal_requirement": exercise["legal_requirement"],
            "plain_language": exercise["plain_language"],
            "department": exercise["department"],
            "job_role": exercise["job_role"],
            "task": exercise["task"],
            "risk": exercise["risk"],
            "required_skill": exercise["required_skill"],
            "exercise_type": exercise["exercise_type"],
            "difficulty": exercise["difficulty"],
            "evidence": exercise["evidence"],
            "review_status": "pending"
        }

        logger.info(f"Uploading interpretation and exercise for chunk {chunk_id} to Supabase...")
        if supabase_request("POST", "legal_interpretations", [interp_data], supabase_url, supabase_key):
            supabase_request("POST", "training_exercises", [exercise_data], supabase_url, supabase_key)
        else:
            logger.error(f"Failed to upload interpretation for chunk {chunk_id}")

    logger.info("AI processing completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
