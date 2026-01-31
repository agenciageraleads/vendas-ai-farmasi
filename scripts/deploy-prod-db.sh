#!/bin/bash
echo "🚀 Iniciando Setup do Banco de Produção (Neon)..."

# Definir URL de Produção
export DATABASE_URL="postgresql://neondb_owner:npg_0jeASbkQnWi6@ep-cold-leaf-ahr9zlks-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 1. Empurrar Schema
echo "📦 Criando tabelas..."
npx prisma db push --accept-data-loss

# 2. Popular Dados Iniciais
echo "🌱 Populando dados (Seed)..."
npx prisma db seed

echo "✅ Banco de Produção pronto!"
