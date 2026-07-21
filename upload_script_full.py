import os
import json
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

print(f'Uploading full course... Length: {len(course_text)} characters')
course_data = {
    'title': 'Alfabetización IA (Auditado Completo)',
    'description': 'Curso completo de 400 páginas validado automáticamente con Regla de Oro.'
}
r_course = requests.post(f'{supabase_url.rstrip("/")}/rest/v1/courses', headers=headers, json=course_data)
r_course.raise_for_status()
course_id = r_course.json()[0]['id']
print(f'Created course: {course_id}')

module_data = {
    'course_id': course_id,
    'title': 'Módulo Único (Completo)',
    'order_index': 1
}
r_module = requests.post(f'{supabase_url.rstrip("/")}/rest/v1/course_modules', headers=headers, json=module_data)
r_module.raise_for_status()
module_id = r_module.json()[0]['id']
print(f'Created module: {module_id}')

content_data = {
    'module_id': module_id,
    'content_json': {
        'content_type': 'text',
        'content': course_text
    }
}
r_content = requests.post(f'{supabase_url.rstrip("/")}/rest/v1/module_contents', headers=headers, json=content_data)
r_content.raise_for_status()
print('Successfully uploaded full content!')
