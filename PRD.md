# PRD — MAFFENG CMMS

## Visão Geral
O sistema MAFFENG CMMS centraliza a gestão de Ordens de Serviço (O.S) para manutenção, com foco em importação rápida de planilhas, acompanhamento por status, controle de prazos e visão gerencial por contrato, técnico e elaborador.

## Objetivos
- Reduzir o tempo de criação e atualização de O.S por meio de importação estruturada.
- Aumentar a visibilidade de atrasos, urgências e volume por status.
- Permitir análises financeiras (orçado vs aprovado) por contrato e equipe.

## Perfis de Usuário
- Gerente: visão completa, importação, relatórios e gestão de equipe.
- Elaborador: acompanha e atualiza suas próprias O.S.
- Administrador de Contratos: filtra O.S por contrato e registra valores aprovados.

## Escopo Funcional (MVP)
- Login por perfil (seleção rápida por usuário).
- Dashboard com métricas (total, concluídas, atrasadas, urgentes) e gráficos por status/mês.
- Importação de planilhas `.xlsx/.xls/.csv` com mapeamento de colunas e normalização de status.
- Lista de O.S com busca, filtros por contrato, criação manual e acesso ao detalhe.
- Detalhe da O.S: status, técnico/elaborador, prazos, valores, anexos e registro de dificuldades.
- Agenda mensal baseada em vencimento para controle de prazos.
- Relatórios com filtros e exportação CSV/PDF.
- Balanço preventivas com gráficos e exportações por contrato, técnico e elaborador.

## Requisitos Não Funcionais
- SPA em React + Vite, responsiva para desktop e tablet.
- Feedback visual de ações (toasts, estados vazios e carregamento).
- Dados mantidos em estado local (sem persistência ou backend nesta fase).

## Métricas de Sucesso
- Tempo médio de importação (planilhas até 1.000 linhas) < 30s.
- Redução de O.S vencidas sem ação em 30 dias.
- Uso ativo mensal por perfil (Gerente, Elaborador, Admin Contrato).

## Fora de Escopo (Atual)
- Autenticação real e permissões por backend.
- Persistência em banco, histórico completo e auditoria.
- Integrações com ERP/CMMS externos.
