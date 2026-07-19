import subprocess
result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True)
with open('push_err.txt', 'w') as f:
    f.write(result.stderr)
