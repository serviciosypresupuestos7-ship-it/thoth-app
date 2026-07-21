import requests

supabase_url = 'https://vgrhircrjgbdouihjvqy.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A'

headers = {
    'apikey': supabase_key,
    'Authorization': f'Bearer {supabase_key}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

file_path = r'C:\Users\Usuario\Desktop\curso ia.docx_CORREGIDO.txt'
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    course_text = f.read()

content_data = {
    'module_id': '313eac95-9cb7-4fe0-8161-0d9eb851a872',
    'content_type': 'text',
    'content': course_text[:50000],
    'order_index': 1
}
r_content = requests.post(f'{supabase_url.rstrip("/")}/rest/v1/module_contents', headers=headers, json=content_data)
print(r_content.status_code)
print(r_content.text)
