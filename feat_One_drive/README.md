# Planejamento: Feature OneDrive/Excel Sync

Este repositório contém as definições dos agentes e o roteiro técnico para a implementação da funcionalidade de sincronização com OneDrive e Excel no MAFFENG CMMS.

## Equipe da Feature (`feat_One_drive`)

A equipe foi montada para garantir a integridade da integração e a precisão do processamento de dados.

- **[Integrador Graph API](agent_graph_integrator.md):** Especialista em Microsoft Graph, OAuth2 e permissões Azure.
- **[Arquiteto de Sincronização](agent_sync_architect.md):** Focado em idempotência, gestão de tokens e jobs de backend.
- **[Data Marshall (Excel)](agent_data_marshall.md):** Responsável por garantir que o parsing do Excel via `xlsx` seja preciso e trate variações de schema.
- **[Orquestrador da Feature](orchestrator.md):** Garante a comunicação entre os agentes e o cumprimento dos marcos do projeto.

## Estrutura do Diretório
- `AZURE_AD_GUIDE.md`: Guia passo-a-passo para infraestrutura.
- `README.md`: Este planejamento central.
- `orchestrator.md`: Protocolo de trabalho dos agentes.
- `agent_*.md`: Definições específicas de competências.

## Próximos Passos
1. Setup do Azure AD conforme o guia.
2. Implementação do MSAL no frontend.
3. Migração do parser XLSX para o serviço de backend.
