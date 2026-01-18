
# Auditoria Estratégica do Produto (Pré-lançamento)

**Data:** 18/01/2026
**Responsável:** Agente Architect (Antigravity)
**Status:** Diagnóstico Crítico
**Versão Auditada:** 2.0.0

---

# ETAPA 1 — Mapa Real do Sistema

O sistema opera em modelo **Híbrido (SPA + Backend Proxy)**. Embora utilize React no frontend, ele depende de um backend Express para persistência, o que é um ponto forte, porém a comunicação de dados está desprotegida e incompleta em pontos chave.

## Arquitetura
- **Frontend:** React + Vite + Tailwind (via tokens Ocean Breeze) + Zustand (State).
- **Backend:** Express + Drizzle ORM + Postgres (`server/index.ts`).
- **Comunicação:** REST API (`lib/api.ts` -> `/api/*`).

## Mapa de Funcionalidades Ativas

| Rota (UI State) | Componente Principal | Dependência de Dados | Status Geral |
| :--- | :--- | :--- | :--- |
| `login` | `Login.tsx` | Nenhuma (Mock Local) | 🟡 **Mockado** |
| `dashboard` | `Dashboard.tsx` | `useOSStore` (API) | 🟢 **Implementado** |
| `work-orders` | `WorkOrders.tsx` | `useOSStore` (API) | 🟢 **Implementado** |
| `import` | `ImportOS.tsx` | `xlsx` (Local) -> API Batch | 🟢 **Implementado** |
| `agenda` | `AgendaAndChecklist.tsx` | `useOSStore` + Local State | 🟡 **Parcial** (Checklist não salva) |
| `settings` | `Settings.tsx` | Local State (Efêmero) | 🔴 **Visual Apenas** |
| `reports` | `Reports.tsx` | `useOSStore` (Client Filters) | 🟢 **Implementado** |
| `team` | `TeamList.tsx` | `storage.getUsers()` (API) | 🟡 **Leitura OK / Escrita Pendente** |

---

# ETAPA 2 — Auditoria Funcional Completa

### 1. Autenticação & Sessão
- **Deveria:** Autenticar usuário via banco, retornar token, proteger rotas.
- **Faz:** Simula login ao clicar num botão. Não há senha real. Backend não valida sessão.
- **Classificação:** 🔴 **Inexistente / Mockado**
- **Evidência:** `Login.tsx` (L19) apenas setta estado. `server/index.ts` não possui middleware de auth.

### 2. Importação de O.S (Core Feature)
- **Deveria:** Ler Excel, validar dados, persistir no banco.
- **Faz:** Excelente tratamento de Excel no front, detecção de colunas e envio em lote para API.
- **Classificação:** 🟢 **OK (Ponto Forte)**
- **Evidência:** `ImportOS.tsx` + `server/index.ts` (Endpoint `/batch`).

### 3. Agenda & Checklist
- **Deveria:** Mostrar datas de vencimento e permitir marcar tarefas cumpridas.
- **Faz:** Visualização de calendário funciona (baseada em dados reais). O Checklist gera itens dinamicamente, mas o estado "check" (`checkedItems`) mora apenas no React (`useState`).
- **Problema:** Ao recarregar a página, todos os checks somem.
- **Classificação:** 🟡 **Parcial (Lógica OK / Persistência Falha)**
- **Evidência:** `AgendaAndChecklist.tsx` L464 (`useState<Set<string>>`).

### 4. Dashboards & KPIs
- **Deveria:** Calcular métricas de negócio.
- **Faz:** Calcula tudo no frontend via `useMemo`. Risco de performance se banco crescer (>10k itens), mas funcional hoje.
- **Classificação:** 🟢 **OK**

---

# ETAPA 3 — Diagnóstico de Configurações (`Settings.tsx`)

Esta tela é um **"Potemkin Village"** (Fachada bonita, nada atrás).

- **UI:** Impecável, campos, abas, uploads de foto.
- **Lógica:** Inexistente.
- **O que não salva:**
    -   Alteração de perfil (Nome, Email).
    -   Troca de senha.
    -   Preferências de notificação.
    -   Regras de prazo.
- **Veredito:** O botão "Salvar" é puramente visual.
- **Evidência:** `Settings.tsx` L164 (Botão sem `onClick` ou handler de submit).

---

# ETAPA 4 — Diagnóstico de Notificações (`Notifications.tsx`)

Sistema inteligente, mas volátil.

- **Tipo:** Derivadas (Computed). Não são registros no banco, são cálculos em tempo real baseados no estado das O.S.
- **Comportamento:**
    -   Se uma O.S vence hoje, o alerta aparece.
    -   Se eu mudo o status da O.S para "Concluída", o alerta some.
- **Falha:** O status de "Lida/Não Lida" é falso. Não há onde salvar que o usuário "viu" o alerta.
- **Veredito:** Útil como "Live Status", inútil como "Histórico de Alertas".
- **Classificação:** 🟡 **Funcional (Conceito diferente do habitual)**

---

# ETAPA 5 — Riscos de Mexer Agora

1.  **Backend Aberto (Segurança Crítica):**
    -   As rotas `/api/ordens-servico` aceitam DELETE e PATCH sem verificar quem é o usuário. Adicionar funcionalidades novas antes de fechar essa porta é construir castelo na areia.

2.  **Estrutura do Banco (Drizzle):**
    -   A estrutura de tabelas (`shared/schema`) parece definida. Refatorar nomes de campos agora quebrará a importação do Excel (`ImportOS.tsx`) que tem mapeamento sensível a strings.

3.  **Client-Side Heavy:**
    -   Toda a lógica de relatórios e dashboards roda no navegador do cliente. Mexer no `store.ts` para introduzir paginação agora quebraria todos os gráficos que esperam o array inteiro.

---

# ETAPA 6 — Plano de Finalização (Priorizado)

Não inicie refatoração visual antes de resolver a **Lógica Fantasma**.

### Prioridade 1: Fundação Real (Semanas 1-2)
1.  **Implementar Auth Backend:** Middleware JWT no Express + Tabela de Usuários real (substituir mock).
2.  **Conectar Configurações:** Fazer o `Settings.tsx` ler/gravar na tabela de usuários.

### Prioridade 2: Persistência de Fluxo (Semana 3)
1.  **Persistir Checklist:** Criar tabela `checklist_items` ou campo JSONB na OS para salvar o estado dos checkboxes da Agenda.
2.  **Validar Notificações:** Decidir se ficam voláteis (estado atual) ou se ficam persistentes.

### Prioridade 3: Estabilidade & Performance (Semana 4)
1.  **Server-Side filters:** Mover filtros de Relatórios e Dashboard para query SQL (preparar para escala).

---

# ETAPA 7 — Checklist de Pronto para Produção

- [ ] **Segurança:** Rotas de API protegidas (Middlewares ativos).
- [ ] **Segurança:** Senhas dos usuários hashadas (bcrypt/argon2) no banco.
- [ ] **Funcional:** Botão "Salvar" em Configurações realmente salva.
- [ ] **Funcional:** Checklist da Agenda persiste após F5.
- [ ] **Dados:** Banco de produção (Postgres) provisionado e conectado via env vars.
- [ ] **UX:** Tela de Login pede senha real.
- [ ] **UX:** Feedback visual de "Salvando..." e "Salvo" em todas as ações de escrita.
- [ ] **DevOps:** Script de build (`npm run build`) gera os assets estáticos corretamente para servir via Express.
