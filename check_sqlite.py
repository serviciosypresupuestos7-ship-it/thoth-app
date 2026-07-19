import sqlite3
sqlite_path = 'data-pipeline/corpus_normativa/ai_literacy/corpus_ai_literacy.sqlite'
conn = sqlite3.connect(sqlite_path)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(cur.fetchall())
