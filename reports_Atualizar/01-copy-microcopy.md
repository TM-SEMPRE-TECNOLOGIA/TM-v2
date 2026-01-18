
# Relatório 01 — Audit de Copy & Microcopy

## 1. Mapa do App (Rotas e Telas)

O aplicativo utiliza uma navegação baseada em estado (`activeTab`) dentro de um componente pai `App.tsx`, simulando uma arquitetura SPA, mas sem rotas de URL verdadeiras.

**Estrutura de Navegação:**

| Rota (Tab) | Tela/Componente | Descrição |
| :--- | :--- | :--- |
| `dashboard` | `Dashboard.tsx` | Visão geral de métricas, gráficos e KPIs. |
| `team` | `TeamList.tsx` | Gestão de usuários (apenas Manager). |
| `agenda` | `AgendaAndChecklist.tsx` | Calendário e lista de tarefas. |
| `work-orders` | `WorkOrders.tsx` | Listagem e gerenciamento de O.S. |
| `import` | `ImportOS.tsx` | Upload e normalização de planilhas Excel/CSV. |
| `difficulties` | `DifficultyLog.tsx` | Registro de impedimentos. |
| `reports` | `Reports.tsx` | Geração de relatórios gerenciais. |
| `balanco` | `BalancoPreventivas.tsx` | Controle financeiro/físico de preventivas. |
| `settings` | `Settings.tsx` | Configurações do sistema. |
| `login` | `Login.tsx` | Tela inicial de seleção de perfil (Mock). |

**Fontes de Texto:**
- Strings hardcoded (maioria) diretamente no JSX.
- Constantes em `lib/types.ts` (Roles, Status).
- Utilitários de data (date-fns com locale ptBR).

---

## 2. Glossário e Tom de Voz

### Glossário Atual (Termos Recorrentes)
- **O.S / OS:** Ordem de Serviço. Usado de forma mista (com e sem ponto). Recomendado: **O.S.** para consistência.
- **Elaborador:** Responsável por criar/editar o relatório técnico da O.S.
- **Contract Admin / Admin. Contratos:** Responsável pela gestão financeira e contratual.
- **Agência:** Unidade física alvo do serviço.
- **Preventiva:** Tipo de manutenção regular.

### Tom de Voz Detectado vs. Recomendado
- **Atual:** Funcional, direto, ocasionalmente técnico ("Importar Planilha", "Normalizações aplicadas"). Contém mensagens de "dev" expostas ("* Por enquanto, use os botões...").
- **Problema:** Mistura tratamento formal com informalidade de protótipo.
- **Recomendação:**
    - **Direto e Profissional:** Manter a clareza técnica.
    - **Humano:** Em mensagens de erro ou vazio (Empty States), ser mais guiado.
    - **Padronizado:** Title Case para Títulos, Sentence case para descrições.

---

## 3. Auditoria por Tela

### 3.1 Tela de Login (`Login.tsx`)

| Elemento | Estado | Texto Atual | Problema | Sugestão | Evidência |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Título | Normal | `MAFFENG CMMS` | Sigla "CMMS" pode ser técnica demais para alguns usuários operacionais. | `MAFFENG - Gestão de Ordens` | L51 |
| Input Label | Normal | `Email` | Falta de formatação. | `E-mail` (hífen) | L73 |
| Placeholder | Normal | `seu@email.com` | Genérico. | `ex: joao.silva@maffeng.com` | L79 |
| Disclaimer | Dev | `* Por enquanto, use os botões ao lado para selecionar o perfil` | Texto de desenvolvimento exposto. | **Remover** em prod ou substituir por "Ambiente de Demonstração". | L110 |
| Botão Perfil | Hover | `Gerente de Manutenção` | Inconsistência de cargo vs sistema. | `Gestor de Manutenção` | L143 |

### 3.2 Dashboard (`Dashboard.tsx`)

| Elemento | Estado | Texto Atual | Problema | Sugestão | Evidência |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Empty State | Vazio | `Nenhuma O.S importada` | Frio. | `Nenhuma Ordem de Serviço encontrada` | L420 |
| Descrição Empty | Vazio | `O Dashboard exibe dados exclusivamente das ordens de serviço que você importar.` | Redundante e negativo. | `Importe sua primeira planilha para visualizar as métricas e indicadores de desempenho.` | L423 |
| KPI Card | Normal | `SLA Compliance` | Termo em inglês no meio de interface PT-BR. | `Conformidade SLA` ou `Prazo de Atendimento` | L161/L512 |
| Chart Title | Normal | `Tendência de O.S` | Vago. | `Evolução de Ordens de Serviço` | L552 |
| Legenda | Normal | `Top Performance` | Mistura de idiomas. | `Melhor Desempenho` | L798 |

### 3.3 Importação (`ImportOS.tsx`)

| Elemento | Estado | Texto Atual | Problema | Sugestão | Evidência |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Drag & Drop | Inativo | `Arraste sua planilha ou clique para selecionar` | Bom, mas pode ser mais convidativo. | `Arraste seu arquivo Excel/CSV aqui ou clique para buscar` | L563 |
| Botão Upload | Loading | `Carregando...` | Gerúndio padrão, ok, mas pode ser mais específico. | `Analisando arquivo...` | L575 |
| Toast Erro | Erro | `Arquivo vazio` | Culpa o arquivo de forma seca. | `O arquivo selecionado não contém dados legíveis.` | L201 |
| Botão Ação | Sucesso | `Nova Importação` | Ambíguo (apagar tudo ou adicionar mais?). | `Importar outro arquivo` | L798 |

### 3.4 Menu Lateral (`App.tsx`)

| Elemento | Estado | Texto Atual | Problema | Sugestão | Evidência |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Item Menu | Normal | `Balanço` | Pouco descritivo. | `Balanço Financeiro` ou `Balanço Preventivas` | L216 |
| Item Menu | Normal | `Equipe` | Genérico. | `Gestão de Equipe` | L228 |
| Botão Logout | Normal | `Sair` | Ok. | `Desconectar` (opcional, mas Sair é aceitável) | L283 |

---

## 4. Padrões Recomendados

### Mensagens de Erro
*   **Padrão:** "Não foi possível [ação] devido a [motivo]. Tente [solução]."
*   **Exemplo:** "Não foi possível importar o arquivo. O formato deve ser .xlsx ou .csv."

### Empty States
*   **Padrão:** Título Amigável + Explicação Curta + Botão de Ação (Call to Action).
*   **Exemplo:**
    *   Título: "Nenhuma dificuldade registrada"
    *   Texto: "O histórico de dificuldades está limpo. Registre novos impedimentos para manter o controle."
    *   Botão: "Registrar Dificuldade"

### Formatação
*   **Datas:** `dd/MM/yyyy` (ex: 24/01/2026).
*   **Moeda:** `R$ 0,00` (BRL).
*   **Status:** Title Case (ex: "Em Elaboração", não "em elaboração").

---

## 5. Quick Wins (Top 10)

1.  **Padronizar "O.S":** Substituir todas as variações (OS, O.S., Ordem) por **O.S.** nos títulos e labels curtos, e **Ordem de Serviço** em textos longos.
2.  **Traduzir "Compliance":** Alterar "SLA Compliance" para "Cumprimento de Prazo" no Dashboard.
3.  **Remover Texto de Dev:** Apagar o disclaimer "Por enquanto..." na tela de Login.
4.  **Melhorar Empty State do Dashboard:** Tornar o texto mais convidativo à ação de importar.
5.  **Corrigir "Email":** Alterar label para "E-mail".
6.  **Traduzir "Top Performance":** Alterar para "Destaques" ou "Melhor Desempenho".
7.  **Unificar "Admin. Contratos":** Usar "Gestor de Contratos" para soar menos "sistema" e mais "cargo".
8.  **Botão de Ação na Importação:** Mudar "Continuar" para "Revisar Dados" e "Importar" para "Concluir Importação" para maior clareza do fluxo.
9.  **Feedback de Sucesso:** Nos toasts, usar verbos no passado ("Arquivo importado com sucesso") em vez de estados ("Importação concluída!").
10. **Tooltip de Ajuda:** Adicionar tooltips explicando o que cada status (ex: "Fornecedor Acionado") significa na prática.
