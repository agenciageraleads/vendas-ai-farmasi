# Plano de Implementação: Sync Engine Farmasi

## Contexto

O sistema precisa ter todos os produtos da Farmasi disponíveis para os consultores sem que eles precisem cadastrar manualmente. Além disso, as informações (preço, fotos, descrições) devem ser atualizadas automaticamente a partir do site oficial.

## Componentes Técnicos

### 1. Script de Scraping (`scripts/farmasi-sync.ts`)

- **Tecnologia**: Playwright + TypeScript + Prisma.
- **Lógica**:
  - Acessa o site oficial da Farmasi Brasil.
  - Extrai as categorias e percorre cada uma delas.
  - Captura o objeto `window.__NEXT_DATA__` que contém todos os dados estruturados dos produtos em JSON.
  - Faz o `upsert` na tabela `Product` do Prisma, usando o código do produto (SKU) como chave única.
  - Calcula o `costPrice` estimando 30% de desconto sobre o `basePrice`.

### 2. Mecanismo de Pré-cadastro

- Após atualizar os produtos, o script percorre todos os usuários (ROLE = CONSULTANT ou LEADER).
- Cria entradas na tabela `InventoryItem` com `quantity: 0` para produtos novos.
- Isso garante que os produtos apareçam na lista do consultor imediatamente.

### 3. Automação (Engine)

- O script pode ser rodado via `npm run sync:products`.
- Sugestão de agendamento via Cron ou GitHub Actions.

## Seguranças e Resiliência

- Uso de `headless: true` para rodar em servidores.
- Timeout de 60s para páginas lentas.
- Tratamento de erro por categoria para não interromper todo o processo se um link falhar.
