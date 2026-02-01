# PRODUTO VendaAI: v1 Launch (MVP) & Roadmap

## 1. Visão Estratégica

**Posicionamento:** O VendaAI não é apenas uma loja virtual; é um **Gerente de Negócios** para a consultora de beleza.
**Diferencial Competitivo:** Enquanto o **Stoqui** foca em ser uma "vitrine simples" para iniciantes (e falha em escalar), o **VendaAI** foca na **Inteligência de Venda** (CRM de Recorrência) e **Gestão Profissional** (Liderança e Estoque Real) para consultoras que querem crescer.

**Meta da v1:** Provar valor imediato ($ no bolso) através da recuperação de vendas perdidas (CRM) e organização de estoque (Fim da quebra).

---

## 2. Escopo Funcional: v1 (Launch)

### 🚀 A. Onboarding "Zero Config" (Fator Stoqui)

*Meta: O usuário deve ter sua loja "Link na Bio" pronta em menos de 2 minutos.*

1. **Cadastro Expresso:** Nome, Telefone (WhatsApp) e Definição de URL da Loja.
2. **Carga Inicial Inteligente:**
    - O sistema já nasce populado com o **Catálogo Farmasi Vigente** (fotos oficiais e descrições).
    - Usuário apenas "Tica" o que tem em estoque. Nada de cadastrar foto/preço manualmente produto por produto.

### 📦 B. Estoque Inteligente (Fator Diferencial)

1. **Desmembramento de Kits (Killer Feature):**
    - Consultora compra "Kit Início".
    - Botão **"Desmembrar Kit"**: O sistema dá baixa no Kit e dá entrada automática em 1 Batom, 1 Base, 1 Perfume.
    - *Impacto:* Resolve a bagunça de estoque de quem compra kits promocionais.
2. **Multi-Localização Simplificada:**
    - Locais padrão: "Minha Casa", "Bolsa/Pronta Entrega".
    - Movimentação rápida (arrastar) entre locais.
3. **Controle de Validade:**
    - Campo de validade no cadastro de lote.
    - Alerta visual: "3 produtos vencendo este mês. Faça promoção!".

### 🤝 C. CRM de Ciclo de Vida (A "Máquina de Dinheiro")

1. **O "Recall" de Produto:**
    - Cada produto tem um atributo oculto: `dias_duracao_media` (ex: Base = 45 dias).
    - **Painel de Oportunidades:** Lista diária de clientes para contatar.
    - *Mensagem Pronta:* "Oi Maria! Sua base deve estar no finalzinho. Posso separar outra com 5% de desconta para garantir?"
2. **Perfil de Beleza:**
    - Tags rápidas no cliente: "Pele Oleosa", "Ama Perfume Doce", "Atrasa Pagamento".

### 🛒 D. Loja & Checkout (Experiência do Cliente)

1. **Catálogo Visual (Pinterest-like):**
    - Busca ultra-rápida.
    - Filtros por "Necessidade" (ex: "Para acne", "Para presente").
2. **Checkout Híbrido:**
    - **Modo Vitrine:** Cliente monta carrinho -> Envia pedido no WhatsApp da Consultora (típico Stoqui).
    - **Modo Venda Direta:** Cliente paga via Link/Pix (Integração Futura Asaas na v1 ou manual).

### 🏆 E. Liderança e Gamificação (Fator Retenção)

1. **Visão da Líder (Downlines):**
    - Líder vê volume de estoque parado na mão da sua equipe.
    - Líder vê ranking de vendas da equipe.
2. **Troca de Estoque (Marketplace Interno):**
    - Líder pode ver: "Consultora A tem excesso de X, Consultora B precisa de X". Sugerir troca.

---

## 3. Personas e Regras de Negócio

### A. O Consultor

- Foco: Vender rápido, não esquecer de cobrar, girar estoque.
- Dores: Compra kit e não sabe precificar unitário; esquece de oferecer reposição.

### B. O Líder

- Foco: Reter a equipe e aumentar o volume de compras.
- Dores: Não sabe se a consultora "desistiu" ou se está só com estoque cheio.
- *Poder:* Único que visualiza dados agregados da sua rede.

---

## 4. Diretrizes Técnicas e UX

### Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), TailwindCSS, Shadcn/UI.
- **Backend:** Server Actions + Prisma ORM + PostgreSQL.
- **Mobile First:** A interface desktop é secundária. Tudo deve ser operável com o polegar.

### UX: "Simples vs Profissional"

Para não assustar a consultora iniciante:

1. **Modo Simples (Default):**
    - Botões grandes: "Vender", "Estoque", "Clientes".
    - Dashboards escondidos.
2. **Modo Profissional (Toggle):**
    - Libera relatórios de DRE, Curva ABC, Gestão de Lotes complexa.

---

## 5. Roadmap de Evolução (Pós-v1)

### v2 - O Banco da Consultora

- Conta Digital Integrada.
- Split de Pagamento (Consultora recebe sua parte, Líder recebe comissão, Farmasi recebe custo).
- Emissão de NF-e simplificada.

### v3 - O Ecossistema

- Consórcio Digital (Clube de Compras).
- Integração IA com WhatsApp (bot que agenda reposição sozinho).
