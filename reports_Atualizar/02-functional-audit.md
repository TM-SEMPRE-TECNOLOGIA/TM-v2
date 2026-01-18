
# Relatório 02 — Auditoria Funcional

## 1. Mapa do App (Fluxos Críticos)

### Fluxo 1: Autenticação (Simulada)
- **Origem:** `Login.tsx`
- **Ação:** Usuário seleciona um card (Manager) ou item de lista (Elaborador/Admin) e clica.
- **Lógica:** Nenhuma validação de credencial. `App.tsx` recebe o `role` e `userId` e altera o estado local.
- **Destino:** Dashboard (Manager) ou Lista de O.S (Outros).

### Fluxo 2: Importação de Dados
- **Origem:** `Dashboard.tsx` (Empty State) ou Menu "Importar O.S".
- **Ação:** Drag & drop de arquivo Excel/CSV.
- **Processamento:**
  - Leitura binária via `xlsx`.
  - Detecção heurística de colunas (`autoMapColumns`).
  - Preview de dados.
  - Normalização de status (`normalizeStatus`).
- **Persistência:** Chama `useOSStore.importOrdensServico` -> API.

### Fluxo 3: Visualização de Métricas
- **Origem:** `Dashboard.tsx`
- **Lógica:** Cálculo em tempo real no cliente (`useMemo`) sobre o array `ordensServico`.
- **Métricas:** Total, Concluídas, Atrasadas, SLA, Valor Financeiro.
- **Gaps:** Depende integralmente do volume de dados carregado na memória.

---

## 2. Matriz de Funcionalidades

| Tela | Funcionalidade | Critério de Aceite Observado | Status |
| :--- | :--- | :--- | :--- |
| **Login** | Seleção de Perfil | Deve redirecionar para a home do perfil sem pedir senha (dev mode). | ✅ OK |
| **Login** | Inputs de Texto | Devem permitir digitação (Email/Senha). | ✅ OK (mas sem efeito) |
| **Dashboard** | Cálculo de SLA | Deve considerar (Total - Atrasadas) / Total. | ⚠️ Risco (Lógica simplista) |
| **Dashboard** | Filtro de Data | Gráficos devem respeitar janela de 6 meses. | ✅ OK (Implementado no `lineData`) |
| **Import** | Upload Excel | Aceitar .xlsx e .xls. | ✅ OK |
| **Import** | Mapping Auto | Reconhecer colunas "OS", "Agência", "Contrato" por nome. | ✅ OK |
| **Import** | Validação | Impedir importação sem colunas obrigatórias mapeadas. | ✅ OK |

---

## 3. Resultados de Testes

### Casos de Teste Executados (Análise Estática/Lógica)

#### CT01: Login como Gerente
- **Passos:** Acessar `/` -> Clicar card "Paulo Silva".
- **Resultado Esperado:** Acesso total ao menu lateral.
- **Resultado Atual:** ✅ Acesso concedido, menu expandido com todas as opções.

#### CT02: Login como Elaborador
- **Passos:** Acessar `/` -> Expandir "Elaboradores" -> Clicar "Thiago".
- **Resultado Esperado:** Redirecionar para "Minhas O.S", menu restrito.
- **Resultado Atual:** ✅ Redireciona para tab `work-orders`. Menu esconde "Equipe", "Importar".

#### CT03: Importação de Arquivo Inválido
- **Passos:** Tentar upload de `.txt` ou imagem.
- **Resultado Esperado:** Mensagem de erro bloqueante.
- **Resultado Atual:** ✅ Toast "Arquivo inválido" (L176 `ImportOS.tsx`).

#### CT04: Cálculo de Atraso
- **Cenário:** O.S com `vencimento` ontem e status "Em Elaboração".
- **Resultado Esperado:** Contar como "Atrasada" no Dashboard.
- **Resultado Atual:** ✅ Lógica `isBefore(vencimento, hoje)` captura corretamente.

---

## 4. Bugs e Inconsistências

| ID | Severidade | Descrição | Evidência |
| :--- | :--- | :--- | :--- |
| **BUG-01** | S3 (Cosmético) | Inputs de Email/Senha na tela de Login não funcionam. Usuário pode tentar digitar e se frustrar ao ver que nada acontece. | `Login.tsx` L76-108 |
| **BUG-02** | S2 (Funcional) | Lógica de SLA considera "sem data de conclusão" como "no prazo" se não estiver atrasada hoje. Se a data de vencimento for no futuro, conta como compliance positivo 100%, o que pode mascarar problemas futuros. | `Dashboard.tsx` L160 |
| **BUG-03** | S1 (Crítico) | Falta de paginação no backend/store. Se importar 50.000 linhas, o app (frontend) provavelmente travará ao tentar renderizar ou calcular métricas no `useMemo`. | `store.ts` (Array simples) |
| **GAP-01** | S2 | Não há funcionalidade de "Desfazer Importação" caso o usuário suba a planilha errada. | `ImportOS.tsx` |

---

## 5. Recomendações de Testes Automatizados

### Unitários (Jest/Vitest)
1.  **`normalizeStatus`**: Testar todas as variações de string ("concluida", "Finalizada", "fechada") para garantir mapeamento para o Enum correto.
2.  **`autoMapColumns`**: Criar arrays de headers variados (com acento, caixa alta/baixa) e verificar se o índice retornado é o correto.

### E2E (Playwright/Cypress)
1.  **Fluxo de Importação Completo:**
    -   Gerar planilha .xlsx dinâmica.
    -   Realizar drag & drop.
    -   Verificar se o Toast de sucesso aparece.
    -   Ir ao Dashboard e verificar se o contador "Total de O.S" incrementou.
