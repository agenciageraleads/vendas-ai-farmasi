# Plano de Deploy - VendaAI SaaS (MVP)

Este documento descreve o processo para publicar o VendaAI em um ambiente de produção acessível para usuários de teste (Beta Testers).

## 🚀 Arquitetura de Produção

Para manter o custo zero/baixo e alta performance, utilizaremos:

1. **Frontend & API**: [Vercel](https://vercel.com) (Hospedagem Next.js nativa).
2. **Banco de Dados**: [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (PostgreSQL Serverless Gerenciado).

---

## 📋 Passo a Passo para Deploy

### 1. Preparação do Banco de Dados (PostgreSQL)

Como o SQLite/Docker local não roda na Vercel (que é serverless), precisamos de um banco na nuvem.

1. Crie uma conta no **Neon.tech**.
2. Crie um novo projeto chamado `venda-ai-prod`.
3. Copie a **Connection String** (DATABASE_URL) fornecida. Ela se parece com:
    `postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Configuração do Projeto na Vercel

1. Faça o push do código atual para o GitHub.
2. No dashboard da Vercel, clique em **"Add New..." -> "Project"**.
3. Importe o repositório `VendaAI`.
4. Nas configurações de **Environment Variables**, adicione:
    * `DATABASE_URL`: (A string que você copiou do Neon/Supabase).
    * `ASAAS_API_KEY`: (Sua chave de Sandbox ou Produção do Asaas).
    * `ASAAS_API_URL`: `https://sandbox.asaas.com/api/v3` (para teste) ou `https://api.asaas.com/v3` (prod).

### 3. Migração do Schema (Banco de Dados)

Antes do site funcionar, o banco na nuvem precisa ter as tabelas criadas. Faremos isso da sua máquina local:

1. No seu terminal, altere temporariamente a URL do banco para a de produção (ou crie um arquivo `.env.production`):

    ```bash
    export DATABASE_URL="postgres://user:pass@..."
    ```

2. Execute a migração para criar as tabelas nuvem:

    ```bash
    npx prisma db push
    ```

3. (Opcional) Popule o banco com dados iniciais (Seed):

    ```bash
    npx prisma db seed
    ```

### 4. Build & Deploy

1. A Vercel fará o deploy automático assim que você configurar o projeto.
2. Acesse a URL gerada (ex: `venda-ai.vercel.app`).

---

## 🧪 Roteiro de Teste para Usuários (Beta)

Ao liberar para os usuários, peça para seguirem este fluxo:

1. **Acesso**: Entrar na URL e fazer Login (se tiver auth) ou usar o fluxo de convidado.
2. **Teste de Estoque**:
    * Cadastrar 2 produtos manualmente.
    * Mover 1 produto da "Casa" para "Mala".
3. **Teste de Rede**:
    * Tentar ver o estoque de outro usuário (se houver dados populados).
4. **Teste de Venda (Crítico)**:
    * Ir em "Nova Venda".
    * Adicionar itens ao carrinho.
    * Preencher CPF e finalizar.
    * **Validar**: Se o link do boleto abriu e se o estoque diminuiu.

## ⚠️ Monitoramento

* Verificar a aba **"Logs"** na Vercel em caso de erro 500.
* Verificar o painel do Asaas Sandbox para confirmar a criação das cobranças.
