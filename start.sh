#!/bin/bash

cd backend
echo "Iniciando backend Flask..."
export FLASK_APP=app.py  # Cambia si tu archivo principal tiene otro nombre
flask run --host=0.0.0.0 --port=5000 &

cd ../frontend
echo "Iniciando frontend React (Vite)..."
npm install
npm run dev -- --host 0.0.0.0
