
# Relatório 03 — Personas e Jornadas

## 1. Personas Definidas

Com base na estrutura de dados (`lib/types.ts`) e permissões do sistema (`App.tsx`), identificamos 3 personas principais.

### Persona 1: Paulo Silva (O Gestor Estratégico)
- **Role:** Manager
- **Quem é:** Gerente de Manutenção focado em KPIs e gestão de time.
- **Contexto:** Usa desktop, acessa diariamente pela manhã e final do dia.
- **Objetivos:**
  - Garantir que nenhuma O.S. estoure o prazo (SLA).
  - Monitorar a produtividade da equipe (Quem fez mais?).
  - Reportar resultados financeiros à diretoria.
- **Dores (Pain Points):**
  - Dependência de planilhas externas para alimentar o sistema.
  - Falta de visão acumulada histórica (se os dados não forem importados regularmente).

### Persona 2: Thiago (O Elaborador Operacional)
- **Role:** Elaborador
- **Quem é:** Técnico ou assistente administrativo responsável pela documentação técnica.
- **Contexto:** Trabalho focado, muitas vezes repetitivo. Precisa de agilidade.
- **Objetivos:**
  - Limpar sua fila de trabalho ("Minhas O.S").
  - Saber exatamente qual a próxima visita agendada.
  - Registrar dificuldades que impedem o serviço.
- **Dores (Pain Points):**
  - Ter que filtrar manualmente suas O.S. se a lista for muito grande (embora o sistema já filtre por padrão, a visualização pode poluir).

### Persona 3: Alexandre (O Guardião dos Contratos)
- **Role:** Contract Admin
- **Quem é:** Analista financeiro ou gestor de contratos.
- **Contexto:** Focado em números, cifrões e conformidade contratual.
- **Objetivos:**
  - Validar se o valor orçado bate com o aprovado.
  - Acompanhar o "Balanço das Preventivas".
  - Garantir que todas as agências do contrato foram atendidas.
- **Dores (Pain Points):**
  - Dados inconsistentes vindos da operação (status desatualizado).

---

## 2. Jornadas Detalhadas

### Jornada do Gestor (Paulo)
1.  **Acesso:** Loga no sistema como Manager.
2.  **Triagem (Dashboard):**
    -   Olha imediatamente para os Cards Vermelhos (Atrasadas / Com Dificuldade).
    -   Se houver atrasos, clica para ver a lista filtrada.
3.  **Ação de Gestão:** Cobra o elaborador responsável ou realoca a tarefa.
4.  **Alimentação:** Acessa "Importar O.S", sobe a planilha atualizada da semana recebida dos fornecedores/campo.
5.  **Análise:** Verifica o gráfico de "Tendência" para ver se a equipe está entregando mais do que recebe.

### Jornada do Elaborador (Thiago)
1.  **Acesso:** Loga e cai direto na tela "Work Orders" (Minhas O.S).
2.  **Planejamento:** Verifica a aba/filtro "Agenda" para ver visitas de hoje.
3.  **Execução:**
    -   Abre uma O.S específica.
    -   Atualiza status para "Em Elaboração".
    -   Preenche detalhes técnicos (mockado).
4.  **Bloqueio:** Se encontra problema, acessa "Registro de Dificuldades" (via Manager ou relata ao Manager, já que no menu atual `Role=elaborador` não vê o menu "Dificuldades" diretamente na sidebar à primeira vista, mas vê na lista de O.S).
    - *Correção:* No código, `DifficultyLog` é restrito a Manager na sidebar. Thiago depende do Paulo para ver dificuldades globais, mas deveria poder registrar a sua.

---

## 3. Interações e Handoffs

### Fluxo: Importação -> Atribuição -> Execução -> Aprovação

1.  **Handoff 1 (Externo -> Paulo):** Paulo recebe planilha e importa. As O.S nascem "Fornecedor Acionado".
2.  **Interação (Sistema):** O sistema identifica `elaborador: Thiago` na planilha e automaticamente vincula o registro ao usuário Thiago.
3.  **Handoff 2 (Paulo -> Thiago):** Thiago vê a O.S na sua lista "Minhas O.S".
4.  **Ação:** Thiago trabalha na O.S e muda status para "Concluída".
5.  **Handoff 3 (Thiago -> Alexandre):** A O.S agora concluída aparece no "Balanço" do Alexandre para validação de faturamento/medição.

---

## 4. Oportunidades Identificadas

-   **Para o Elaborador:** Permitir acesso direto ao "Registro de Dificuldades" no menu, pois é ele quem encontra o problema na ponta. Atual: Só Manager vê na Sidebar.
-   **Para o Gestor:** Criar um alerta de "O.S sem movimentação há X dias" (Estagnação), além do vencimento.
-   **Para o Admin Contratos:** Visualização de "Valor Medido vs Valor Empenhado" no Balanço.
