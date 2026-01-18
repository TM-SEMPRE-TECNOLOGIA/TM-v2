
# Relatório 04 — Backlog de Issues Priorizado

| ID | Área | Tela/Componente | Sev | Impacto | Esforço | Descrição | Evidência | Recomendação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Funcional | `Login.tsx` | S1 | Crítico | M | Autenticação mockada (sem senha). Qualquer usuário acessa qualquer perfil. | L19 `handleUserSelect` | Implementar integração real com backend de auth (JWT/Session). |
| **PERF-01** | Funcional | `Dashboard.tsx` | S1 | Alto | G | Cálculos de KPI feitos no cliente (`useMemo`) com array completo na memória. Risco de travar com >10k registros. | L107 `stats` | Mover agregações para o Backend (MongoDB/SQL aggregation) e paginar resultados. |
| **UX-01** | UX | `Login.tsx` | S2 | Médio | P | Campos de Email/Senha visuais mas inativos. Causa frustração. | L76 | Conectar inputs à lógica de login ou remover se for apenas demo permanente. |
| **UX-02** | UX | `App.tsx` (Menu) | S2 | Médio | P | Usuário `Elaborador` não tem acesso fácil ao menu "Dificuldades", embora precise reportá-las. | L241 | Liberar rota `difficulties` para role `elaborador`. |
| **CPY-01** | Copy | `Dashboard.tsx` | S3 | Baixo | P | Termo "SLA Compliance" em inglês. | L161 | Alterar para "Conformidade SLA" ou "No Prazo". |
| **CPY-02** | Copy | `ImportOS.tsx` | S3 | Baixo | P | Botões "Continuar" e "Importar" no fluxo podem confundir sobre o momento do commit. | L665 | Renomear para "Revisar Dados" e "Confirmar Importação". |
| **CPY-03** | Copy | Geral | S3 | Baixo | M | Inconsistência no termo "O.S" vs "OS" vs "Ordem". | Vários arquivos | Padronizar globalmente para **O.S.** |
| **FUNC-01** | Funcional | `ImportOS.tsx` | S2 | Médio | M | Falta de verificação de duplicidade na importação (sobrescreve ou duplica?). | `store.ts` | Implementar checagem de ID/Número O.S existente no backend antes do insert. |
| **UI-01** | UI | `App.tsx` | S3 | Baixo | M | Uso excessivo de estilos inline (`style={{...}}`) dificulta manutenção e responsividade. | L147 | Refatorar para classes Tailwind CSS (`bg-slate-900`, etc). |
| **UX-03** | UX | `Dashboard.tsx` | S2 | Médio | P | Empty State do Dashboard é "acusatório" ("dados exclusivamente das ordens que VOCÊ importar"). | L423 | Tornar texto mais acolhedor e orientado a onboarding. |

## Legenda
- **S0:** Bloqueante (Sistema inoperante/Perda de dados)
- **S1:** Crítico (Funcionalidade core comprometida/Segurança)
- **S2:** Moderado (Workaround existe/UX ruim)
- **S3:** Cosmético (Texto/Visual)
