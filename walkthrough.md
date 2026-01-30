# Guia de Sincronização de Produtos Farmasi

Este documento explica como funciona a integração com o catálogo da Farmasi e como mantê-lo atualizado.

## Como funciona

O sistema utiliza um "crawler" (rastreador) que visita o site da Farmasi, lê os dados dos produtos e os salva no nosso banco de dados.

### 1. Sincronização Manual

Para atualizar os produtos agora mesmo, rode:

```bash
npm run sync:products
```

### 2. O que é sincronizado?

- **Nome e Código (SKU)**: Identificação única do produto.
- **Preço**: Preço de catálogo e preço estimado de custo (30% off).
- **Imagens**: Link direto das fotos oficiais.
- **Descrições**: Informações detalhadas do produto.

### 3. Pré-cadastro nas Lojas

Toda vez que o script roda, ele garante que se houver um produto novo, ele será adicionado ao estoque de **todos** os consultores com quantidade zero. Assim, o consultor só precisa entrar e mudar a quantidade quando receber o produto físico.

## Automação

Para garantir que os preços e novos lançamentos entrem no sistema sozinhos, recomendamos agendar o comando acima para rodar uma vez por dia.

Exemplo de Cron (todo dia às 3h da manhã):

```bash
0 3 * * * cd /caminho/do/projeto && npm run sync:products
```
