# Modelagem de Dados - Notificacoes (Modelo Conceitual)

Data: 30 de janeiro de 2026
Base: task/Task_codex - Plano de Implementacao para Pagina Notificacoes.md
Referencia de contexto: DOCS/notifications/01_planning_spec.md e DOCS/notifications/02_design_spec.md

## Entidade conceitual principal
Notificacao

## Campos (conceituais) e definicoes
- id: identificador unico da notificacao.
- data: data/hora de ocorrencia ou envio.
- titulo: resumo curto da notificacao.
- mensagem: detalhe textual completo da notificacao.
- statusLeitura: indica se a notificacao foi lida ou nao lida.

## Regras conceituais
- Toda notificacao deve ter id, data, titulo e mensagem definidos.
- statusLeitura deve assumir um dos valores: lida ou nao lida.
- A alteracao de statusLeitura de nao lida para lida deve refletir na contagem de nao lidas.

## Necessidades de armazenamento (alto nivel, nao tecnico)
- Persistir notificacoes para recuperacao posterior pelo usuario.
- Permitir consulta por statusLeitura para filtro (todas vs nao lidas).
- Manter historico suficiente para apresentacao na lista.

## Observacoes e pendencias
- Confirmar se ha necessidade de expurgo/tempo maximo de retenção (pendente com produto).
- Confirmar se notificacoes precisam de agrupamento por categoria ou origem (pendente).
