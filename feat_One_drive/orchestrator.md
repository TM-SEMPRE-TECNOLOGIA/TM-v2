# Orquestrador da Feature: OneDrive Sync

## Objetivo
Coordenar os agentes especializados para entregar a funcionalidade de sincronização completa, garantindo que o design Ocean Breeze seja respeitado e a performance do sistema mantida.

## Fluxo de Trabalho (Pipeline)
1. **Infra (Graph Integrator):** Define o contrato de autenticação e fornece o buffer do arquivo.
2. **Parsing (Data Marshall):** Recebe o buffer, valida e transforma em objetos JSON padronizados.
3. **Persistência (Sync Architect):** Recebe o JSON e realiza o merge/upsert no banco de dados.
4. **Interface (UX/UI - via repo principal):** Garante que o feedback de sincronização seja visível e amigável.

## Protocolo de Decisão
- Mudanças no schema do banco devem ser aprovadas pelo **Sync Architect**.
- Alterações no fluxo de login Azure devem ser validadas pelo **Graph Integrator**.
- Mudanças críticas no algoritmo de importação são decididas pelo **Data Marshall**.

## Manifesto da Equipe
- "O dado no banco é sagrado: nunca duplicar."
- "O Excel é do usuário: ser resiliente a mudanças de layout."
- "Transparência total: logs claros para falhas de sync."
