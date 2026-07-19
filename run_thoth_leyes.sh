#!/bin/bash
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install customtkinter requests beautifulsoup4
python3 thoth_leyes.py
