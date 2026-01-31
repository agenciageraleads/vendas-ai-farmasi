# Roadmap VendaAI - Sistema de Gestão para Venda Direta

## Objetivo

Desenvolver uma plataforma SaaS completa para consultores de venda direta, centralizando estoque, financeiro, CRM e liderança. O foco inicial (MVP) é a **Rede Farmasi**, mas pronto para multimarcas.

## Fases do Projeto

### Fase 1: Fundação e Estoque Inteligente (MVP Crítico)

- [x] **Configuração do Projeto e Base de Dados**
  - [x] Setup Next.js + Prisma + Postgres.
  - [x] Script de Sync de Produtos Farmasi.
  - [x] Atualizar Schema Prisma (Todos os Modelos).
- [x] **Gestão de Estoque Avançada**
  - [x] Multi-localização + Preço Médio.
  - [x] Entradas, Transferências e Auditoria.

### Fase 2: Rede de Colaboração (Diferencial)

- [x] **Módulo de Liderança Fluida**
  - [x] "Vitrine Compartilhada": Ver estoque da rede.
  - [x] **Fluxo de Empréstimo**: Solicitar -> Aprovar -> Logar Transação.
  - [x] Painel de Aprovações (Central de Notificações).

### Fase 3: Venda e Financeiro (Checkout)

- [x] **Gestão de Vendas (PDV)**
  - [x] Action de Venda (Baixa estoque, Pedido, Pagamento).
  - [x] PDV com Carrinho e Cadastro de Cliente.
  - [x] Compliance (Aceite de Termos LGPD).
  - [x] Integração Financeira (Mock funcional para Asaas).

### Fase 4: O "Consórcio" e CRM

- [ ] **Motor de Consórcio e Score Interno**.

## Status do MVP

Estamos a **100% Funcional** (MVP de Código). 🚀

- ✅ **Estoque**: Gestão completa (individual).
- ✅ **Rede**: Colaboração real (emprestar produtos entre consultores).
- ✅ **Vendas**: Checkout com segurança jurídica e mock financeiro.

Próximo passo técnico: **Deploy** em Produção e troca de chaves da API de Pagamento.
