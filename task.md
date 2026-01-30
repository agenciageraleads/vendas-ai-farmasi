# Tarefa: Implementação do Sync Engine Farmasi

## Objetivo

Criar um sistema que busca produtos do site da Farmasi e os pré-cadastra nas lojas dos consultores.

## Progresso

- [x] Exploração do site Farmasi para identificar estrutura de dados.
- [x] Criação do script de sincronização `scripts/farmasi-sync.ts`.
- [x] Adição do comando `npm run sync:products` ao `package.json`.
- [ ] Instalação de dependências (`playwright`).
- [ ] Execução da primeira sincronização.
- [ ] Configuração do "engine" de atualização automática (instruções).

## Próximos Passos

1. Aguardar a instalação do Playwright.
2. Executar `npx playwright install` para baixar os binários dos navegadores.
3. Rodar `npm run sync:products` para validar o seed inicial e o pre-cadastro.
4. Documentar como agendar a execução automática.
