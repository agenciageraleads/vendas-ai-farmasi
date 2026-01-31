# GUIA CENTRAL DO PRODUTO: VendaAI SaaS

## 1. Visão Geral do Produto

O **VendaAI** é um ecossistema SaaS completo para a Venda Direta, focado em profissionalizar a gestão de consultores. Diferente de catálogos digitais simples, ele resolve dores operacionais profundas: quebra de estoque, inadimplência (fiado) e desorganização financeira.

**Cliente Principal (MVP):** Rede Farmasi (Thiago Brasileiro).
**Modelo de Negócio:** Freemium (Liderança) / SaaS (Assinatura Mensal).

---

## 2. Personas e Regras de Acesso

### A. O Consultor (Vendedor)

Usuário base. Possui:

- Loja virtual personalizada.
- Gestão de estoque próprio.
- CRM de clientes.
- Conta digital (integrada Asaas) para cobranças.

### B. O Líder (Gestor)

Qualquer consultor que cadastra outro consultor abaixo dele.

- **Regra de Visibilidade**: Vê o volume de vendas e status da equipe, mas **NÃO VÊ** os dados sensíveis (nome/telefone) dos clientes finais dos seus consultores.
- **Função**: Monitoria, suporte e disponibilização de estoque compartilhado.

### C. O Consumidor Final

Cliente do consultor.

- Acesso à loja.
- Histórico de pedidos.
- Participação em grupos de Consórcio.
- **Esteira de Cadastro**: Obrigatório preencher CPF, Endereço e Aceite Legal para compras a prazo.

> [!CAUTION]
> **Regra de Ouro da Hierarquia**: O vínculo de um consultor a um líder é único e irreversível após o primeiro login/cadastro. Não é possível "trocar de líder" sem recriar a conta.

---

## 3. Especificação Funcional por Módulo

### 📦 Módulo 1: Estoque Inteligente e Colaborativo

O coração do sistema. Resolve o problema: "Eu vendi, mas não tenho o produto agora".

1. **Multi-localização**
    - O consultor pode criar locais personalizados: "Em casa", "Porta-malas", "Escritório", "Emprestado para Maria".
    - Movimentação entre locais via "drag-and-drop" ou leitura rápida.

2. **Entrada Inteligente de Estoque**
    - **Leitura de XML (NFe)**: O usuário sobe o XML da nota da Farmasi. O sistema lê os produtos, quantidades e **custo unitário**.
    - **Cálculo de Custo (Preço Médio Ponderado)**:
        - *Fórmula*: `((QtdAtual * CustoAtual) + (QtdNova * CustoNovo)) / (QtdTotal)`
        - Isso nivela o lucro real do consultor independentemente de qual lote ele vendeu.

3. **Rede de Colaboração (Empréstimos/Trocas)**
    - **Vitrine Compartilhada**: Consultor pode ver se seu Líder ou Amigo tem o produto X disponível.
    - **Recurso de Empréstimo**:
        - Consultor A solicita 2 perfumes ao Consultor B.
        - B aprova -> Estoque sai de B e entra em A com status "Origem: Empréstimo de B".
    - **Recurso de Troca (Permuta)**:
        - Troca física de produtos equivalentes.
        - **Regra de Valor**: Para trocas, o sistema ignora o "Custo Pago" e usa o **"Preço de Referência" (Tabela Oficial)** para calcular o saldo devedor entre as partes.

### 💰 Módulo 2: Financeiro e Jurídico (Anti-Calote)

Profissionaliza a venda a prazo ("boleto/fiado").

1. **Integração Asaas (Gateway)**
    - Geração automática de Boletos e Pix.
    - Split de pagamentos (futuro).
    - Notificações de cobrança (SMS/Email) automáticas pelo gateway.

2. **Esteira de Crédito do Cliente**
    - Antes da primeira compra a prazo, o cliente passa por um "Onboarding Jurídico".
    - Validação de CPF (Receita/Algoritmo).
    - Validação de Endereço (ViaCEP).
    - **Termo de Aceite Digital**: Checkbox obrigatório "Concordo com Multa e Juros". O sistema grava IP e Timestamp como prova legal.

3. **Configuração de Juros**
    - O Consultor define suas regras: "Cobrar 2% de multa + 1% ao mês".
    - O sistema aplica isso automaticamente na geração do boleto Asaas.

### 🤝 Módulo 3: CRM Proativo

O sistema trabalha pelo consultor.

1. **Ciclo de Vida do Produto**
    - Cada produto tem uma "Duração Estimada" (Ex: Perfume 100ml = 60 dias).
    - O sistema avisa: "O perfume da Cliente Ana deve estar acabando. Ofereça reposição agora."

2. **Datas Especiais**
    - Aniversários (Consultora e Clientes).
    - O sistema sugere presentes baseados no histórico de compras do cliente.

### 🏆 Módulo 4: O Consórcio (Diferencial)

Sistema de compras recorrentes programadas.

1. **Grupos e Cotas**
    - Consultor cria um grupo de 10 pessoas / 10 meses.
    - Todos pagam mensalmente.

2. **Motor de Aprovação (Score Interno)**
    - Cliente "Novo/Sem Histórico": Aprovação sujeita a fiador ou cartão.
    - Cliente "Bom Pagador" (Score > X no app): Pode entrar no consórcio com aprovação automática.

---

## 4. Diretrizes Técnicas

### Arquitetura (Tech Stack)

- **Frontend**: Next.js 15 (App Router), TailwindCSS, Shadcn/UI (Componentes).
- **Backend**: Server Actions (Next.js), Prisma ORM.
- **Banco de Dados**: PostgreSQL.
- **Infraestrutura**: Docker (local), Deploy Vercel/Railway (Produção).

### Padrões de Interface (UX)

- **Modo Duplo**: Configuração global que altera a densidade da informação.
  - *Simples*: Botões grandes, pouca info, foco na tarefa.
  - *Avançado*: Dashboards, tabelas densas, gráficos.
- **PWA (Progressive Web App)**: Foco total em mobile-first e instalação na home screen, evitando taxas da Apple Store inicialmente.

### Auditoria e Segurança

- Logs imutáveis para todas as transações de estoque (quem, quando, o quê, de onde, para onde).
- Logs de aceite jurídico para proteção LGPD.
