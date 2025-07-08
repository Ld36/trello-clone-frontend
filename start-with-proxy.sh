#!/bin/bash

# Script para iniciar o servidor Angular com proxy

echo "🚀 Iniciando servidor Angular com proxy para resolver CORS..."

# Mata processos existentes do ng serve
pkill -f "ng serve" 2>/dev/null

# Aguarda um momento
sleep 2

# Inicia o servidor com proxy
ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200

echo "✅ Servidor iniciado em http://localhost:4200"
echo "📡 Proxy configurado: /api/* → http://localhost:3000/*"
