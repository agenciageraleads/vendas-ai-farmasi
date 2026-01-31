# Plano de Implementação: VendaAI SaaS (Versão 2.0)

## Objetivo

Transformar o protótipo de catálogo em um SaaS completo de gestão para consultores, implementando os pilares de Estoque Colaborativo, Financeiro (Asaas) e Liderança Fluida definidos no Escopo Técnico v2.0.

## User Review Required
>
> [!IMPORTANT]
> **Alterações Críticas de Banco de Dados**: A implementação exigirá uma migração significativa no Prisma Schema, adicionando suporte a transações de estoque complexas (empréstimos/trocas) e dados fiscais/legais dos clientes. Faça backup antes de aprovar a execução.

> [!WARNING]
> **Integração Asaas**: Será necessário criar uma conta no Sandbox do Asaas para testes de desenvolvimento.

## Proposed Changes

### 1. Banco de Dados (Prisma Schema)

Atualização robusta do schema para suportar o novo core business.

#### [MODIFY] [schema.prisma](file:///Users/Lucas-Lenovo/Documents/Documentos/Projetos%20PlayGround/VendaAI/prisma/schema.prisma)

- **User**: Adicionar campo `preferences` (JSON) para "Modo Duplo" e `interestSettings` (JSON) para juros.
- **Product**: Adicionar `referencePrice` (Custo Padrão/Tabela) para cálculos de permuta.
- **InventoryItem**: Adicionar `costAmount` (Valor total em estoque) para cálculo de Preço Médio.
- **[NEW] InventoryTransaction**: Tabela de log imutável para entradas, saídas, empréstimos e ajustes. Campos: `type` (SALE, PURCHASE, LOAN_OUT, LOAN_IN, ADJUST), `quantity`, `unitCost`, `partnerId`.
- **[NEW] PartnerConnection**: Tabela para gerenciar "Convites de Parceria" entre consultores.
- **[NEW] LegalTermAcceptance**: Tabela de auditoria para aceites de termos (IP, userAgent, timestamp).
- **Customer**: Expandir `User` (role CUSTOMER) ou criar perfil separado com dados ricos (CPF, Endereço, Referência).

### 2. Estoque e Core Business

#### [MODIFY] [app/actions/inventory.ts](file:///Users/Lucas-Lenovo/Documents/Documentos/Projetos%20PlayGround/VendaAI/app/actions/inventory.ts)

- Implementar lógica de **Preço Médio Ponderado**: Ao dar entrada (XML/Manual), recalcular o custo médio do item.
- Implementar funções de `transferStock(fromUser, toUser, items)` para empréstimos.

#### [NEW] app/actions/nfe.ts

- Criar server action para parsear XML de Nota Fiscal e inserir produtos/estoque automaticamente.

### 3. Financeiro e Jurídico

#### [NEW] app/actions/asaas.ts

- Wrappers para criar clientes e cobranças na API do Asaas.
- Injetar configurações de juros do consultor no payload da cobrança.

#### [NEW] app/actions/legal.ts

- Action para registrar o aceite dos termos pelo cliente final.

### 4. Interface (UX)

#### [NEW] components/ui/DualModeToggle.tsx

- Switch para alternar entre interface "Simples" e "Avançado" (persistido no perfil).

#### [NEW] components/inventory/StockMovementForm.tsx

- Formulário inteligente que aceita leitura de código de barras ou XML.

## Verification Plan

### Testes Automatizados

- **Unitários**: Testar cálculo de preço médio em `inventory.ts`.
  - Ex: Estoque 10un a R$50. Entrada de 10un a R$70. Saída esperada: Custo Médio R$60.
- **Integração**: Testar fluxo de empréstimo entre dois usuários (User A -> User B).
  - Verificar se sai do estoque A e entra no B (marcado como emprestado).

### Verificação Manual

1. **Fluxo de Cadastro de Cliente**: Tentar cadastrar sem CPF válido -> Deve bloquear. Tentar sem aceitar termos -> Deve bloquear.
2. **Entrada de Estoque**: Subir um XML de teste e verificar se os produtos aparecem no estoque com quantidades corretas.
3. **Modo Duplo**: Alternar o switch e verificar se os gráficos somem/aparecem.
