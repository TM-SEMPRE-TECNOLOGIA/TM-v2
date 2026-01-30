# Design - Pagina de Notificacoes (MVP)

Data: 30 de janeiro de 2026
Base: task/Task_codex - Plano de Implementacao para Pagina Notificacoes.md
Referencia de requisitos: DOCS/notifications/01_planning_spec.md

## Objetivo de UX
- Facilitar a leitura e o entendimento rapido das notificacoes.
- Permitir foco em nao lidas sem esconder acesso a todas.
- Manter consistencia visual e de navegação com o app atual.

## Wireframes de alto nivel (descricao textual)
1) Cabecalho da pagina
   - Titulo: "Notificacoes".
   - Acoes principais: alternancia de filtro (Todas | Nao lidas).
2) Area de status
   - Estado de carregamento: indicador de carregamento com mensagem curta.
   - Estado vazio: mensagem "Sem notificacoes" com opcao de voltar ou atualizar.
3) Lista de notificacoes
   - Item de notificacao com:
     - Data/hora em destaque secundario.
     - Titulo em destaque principal.
     - Mensagem/descricao em corpo menor.
     - Indicador visual de lida/nao lida.
   - Acao por item: "Marcar como lida" (quando aplicavel).
4) Rodape/acoes secundarias
   - Opcao de atualizacao manual da lista (se disponivel no app atual).

## Fluxos de navegacao de alto nivel
- Menu/icone de notificacoes -> Pagina de Notificacoes.
- Filtro "Nao lidas" -> lista atualizada para somente nao lidas.
- Clique em "Marcar como lida" -> item muda para estado lida e contagem de badge reduz.
- Estado vazio -> usuario entende ausencia de notificacoes e pode retornar.

## Regras visuais e de hierarquia
- Diferenciar nao lidas por peso visual (ex.: destaque no titulo) sem adicionar novos elementos tecnicos.
- Manter alinhamento e espacamento consistentes entre itens.
- Evitar poluicao visual: limitar acoes por item a uma principal.

## Criterios de revisao e aprovacao com produto
- O fluxo de acesso pelo menu e o badge de nao lidas estao claros.
- O filtro entre todas e nao lidas e compreensivel em 1 clique.
- Itens de notificacao sao legiveis e escaneaveis rapidamente.
- Estados de carregamento e vazio orientam o usuario sem duvida.
- Acoes principais estao limitadas ao necessario para o MVP.

## Decisoes de design aprovadas
- Pendente aprovacao de produto e stakeholders.

## Pendencias
- Validar com produto o texto exato dos estados (carregamento/vazio).
- Confirmar se ha acao secundaria de atualizar lista no app atual.
- Alinhar consistencia visual com o menu/icone existente.
