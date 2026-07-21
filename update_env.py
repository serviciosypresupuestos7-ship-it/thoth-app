import os
import re

env_file = '.env.local'
with open(env_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

supabase_url = 'https://vgrhircrjgbdouihjvqy.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A'
anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxOTk2NjgsImV4cCI6MjA5OTc3NTY2OH0.Td_bUUmyQN5RooK0Am_axSimje39iUJu5rRNO4VGpxg'

if 'SUPABASE_URL=' in content:
    content = re.sub(r'SUPABASE_URL=.*', f'SUPABASE_URL={supabase_url}', content)
else:
    content += f'\nSUPABASE_URL={supabase_url}'

if 'SUPABASE_KEY=' in content:
    content = re.sub(r'SUPABASE_KEY=.*', f'SUPABASE_KEY={supabase_key}', content)
else:
    content += f'\nSUPABASE_KEY={supabase_key}'

if 'NEXT_PUBLIC_SUPABASE_URL=' in content:
    content = re.sub(r'NEXT_PUBLIC_SUPABASE_URL=.*', f'NEXT_PUBLIC_SUPABASE_URL={supabase_url}', content)
else:
    content += f'\nNEXT_PUBLIC_SUPABASE_URL={supabase_url}'

if 'NEXT_PUBLIC_SUPABASE_ANON_KEY=' in content:
    content = re.sub(r'NEXT_PUBLIC_SUPABASE_ANON_KEY=.*', f'NEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}', content)
else:
    content += f'\nNEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}'

with open(env_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated .env.local')
