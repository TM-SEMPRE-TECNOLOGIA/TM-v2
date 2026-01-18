# Plano de Padronização Visual - MAFFENG CMMS

## Design System TM - Ocean Breeze v2.0

Este documento detalha o plano de padronização visual do sistema MAFFENG CMMS, baseado no Design System Ocean Breeze v2.0 presente na pasta `ocean-breeze-pages/`.

---

## 1. Resumo do Sistema MAFFENG

### 1.1 Funcionalidades Implementadas

| Módulo | Status | Descrição |
|--------|--------|-----------|
| Login | ✅ Completo | Seleção por perfil com design premium |
| Dashboard | ✅ Completo | Métricas e gráficos (REQUER ATUALIZAÇÃO) |
| Ordens de Serviço | ✅ Completo | CRUD completo com design Ocean Breeze |
| Detalhes da O.S | ✅ Completo | Edição completa de campos |
| Importação Excel | ✅ Completo | Mapeamento inteligente de colunas |
| Agenda | ✅ Completo | Calendário mensal interativo |
| Balanço Preventivas | ✅ Completo | Análise financeira por categoria |
| Relatórios | ✅ Completo | Filtros avançados + exportação CSV |
| Equipe | ✅ Completo | Gestão de usuários e técnicos |
| Log de Dificuldades | ✅ Completo | Histórico de problemas |
| Configurações | ✅ Completo | Preferências do sistema |
| **Persistência PostgreSQL** | ✅ Completo | Dados salvos permanentemente |

### 1.2 Perfis de Usuário

| Perfil | Usuários | Acesso |
|--------|----------|--------|
| **Gerente** | Paulo Silva | Acesso total ao sistema |
| **Elaboradores** | Thiago, Danilo, Felipe, Davi | Gerenciam O.S atribuídas |
| **Administradores de Contrato** | Alexandre, João Victor, Laura | Preenchem valores aprovados |
| **Técnicos** | 9 profissionais | Listados para atribuição (não acessam o sistema) |

---

## 2. Design System Ocean Breeze - Referência Completa

### 2.1 Arquivos de Referência

```
ocean-breeze-pages/
├── pages/
│   ├── index.html           # Home / Visão geral
│   ├── tokens.html          # Cores, tipografia, sombras, radius, spacing
│   ├── components.html      # Botões, cards, inputs, alerts, etc.
│   ├── dashboards.html      # Dashboards e gráficos (14 métricas + 8 gráficos)
│   ├── patterns.html        # Padrões de telas (sidebar, chat, blog)
│   ├── ux.html              # UX guidelines
│   ├── accessibility.html   # Acessibilidade (WCAG 2.1)
│   ├── content.html         # Conteúdo & microcopy
│   └── mobile.html          # Mobile Preview (light/dark)
└── assets/
    ├── styles.css           # CSS consolidado com todos os tokens
    └── app.js               # JS: theme toggle + navegação
```

### 2.2 Tokens de Cores - Modo Claro

```css
/* Cores Principais */
--TM-background: #f0f8ff;        /* Fundo principal (azul gelo) */
--TM-foreground: #374151;        /* Texto principal */
--TM-card: #ffffff;              /* Fundo de cards */
--TM-card-foreground: #374151;   /* Texto em cards */

/* Cores Primárias */
--TM-primary: #22c55e;           /* Verde principal */
--TM-primary-foreground: #ffffff; /* Texto sobre primário */

/* Cores Secundárias */
--TM-secondary: #e0f2fe;         /* Azul claro */
--TM-secondary-foreground: #4b5563;
--TM-muted: #f3f4f6;             /* Cinza suave */
--TM-muted-foreground: #6b7280;  /* Texto secundário */
--TM-accent: #d1fae5;            /* Verde pastel */
--TM-accent-foreground: #374151;

/* Bordas e Estados */
--TM-border: #e5e7eb;            /* Bordas padrão */
--TM-input: #e5e7eb;             /* Inputs */
--TM-ring: #22c55e;              /* Foco/Outline */
--TM-destructive: #ef4444;       /* Erro/Perigo */

/* Cores para Gráficos (5 tons de verde) */
--TM-chart-1: #22c55e;           /* Verde vibrante */
--TM-chart-2: #10b981;           /* Verde esmeralda */
--TM-chart-3: #059669;           /* Verde médio */
--TM-chart-4: #047857;           /* Verde escuro */
--TM-chart-5: #065f46;           /* Verde profundo */

/* Sidebar */
--TM-sidebar: #e0f2fe;
--TM-sidebar-foreground: #374151;
--TM-sidebar-primary: #22c55e;
--TM-sidebar-accent: #d1fae5;
--TM-sidebar-border: #e5e7eb;
```

### 2.3 Tokens de Cores - Modo Escuro

```css
--TM-background: #0f172a;        /* Azul escuro profundo */
--TM-foreground: #d1d5db;
--TM-card: #1e293b;              /* Card escuro */
--TM-primary: #34d399;           /* Verde claro */
--TM-secondary: #2d3748;
--TM-muted: #19212e;
--TM-accent: #374151;
--TM-border: #4b5563;
--TM-sidebar: #1e293b;
```

### 2.4 Tipografia

```css
--TM-font-sans: "DM Sans", sans-serif;   /* Principal */
--TM-font-serif: "Lora", serif;          /* Títulos elegantes */
--TM-font-mono: "IBM Plex Mono", monospace; /* Código/Dados */
```

**Escala tipográfica:**
- Heading 1: 32px
- Heading 2: 28px
- Heading 3: 24px
- Heading 4: 20px
- Heading 5: 18px
- Body: 16px (padrão)
- Small: 14px
- Caption: 12px

### 2.5 Raios de Borda

```css
--TM-radius-sm: calc(0.5rem - 4px);  /* 4px */
--TM-radius-md: calc(0.5rem - 2px);  /* 6px */
--TM-radius-lg: 0.5rem;              /* 8px */
--TM-radius-xl: calc(0.5rem + 4px);  /* 12px */
```

### 2.6 Sombras

```css
--TM-shadow-2xs: 0px 4px 8px -1px rgba(0,0,0,0.05);
--TM-shadow-xs: 0px 4px 8px -1px rgba(0,0,0,0.05);
--TM-shadow-sm: 0px 4px 8px -1px rgba(0,0,0,0.10), 0px 1px 2px -2px rgba(0,0,0,0.10);
--TM-shadow-md: 0px 4px 8px -1px rgba(0,0,0,0.10), 0px 2px 4px -2px rgba(0,0,0,0.10);
--TM-shadow-lg: 0px 4px 8px -1px rgba(0,0,0,0.10), 0px 4px 6px -2px rgba(0,0,0,0.10);
--TM-shadow-xl: 0px 4px 8px -1px rgba(0,0,0,0.10), 0px 8px 10px -2px rgba(0,0,0,0.10);
--TM-shadow-2xl: 0px 4px 8px -1px rgba(0,0,0,0.25);
```

---

## 3. Catálogo de Gráficos Disponíveis

O Design System Ocean Breeze oferece **8 variações de gráficos** no arquivo `dashboards.html`:

### 3.1 Line Chart (Gráfico de Linha)
**Uso**: Tendências de crescimento ao longo do tempo
```
📈 Tendência de Crescimento (Line Chart)
```
- Linha suave com cor `--TM-chart-1`
- Ideal para: evolução de O.S concluídas por mês

### 3.2 Area Chart (Gráfico de Área)
**Uso**: Crescimento acumulativo com preenchimento
```
📈 Crescimento de Usuários (Area Chart)
```
- Gradiente de verde com transparência
- Ideal para: volume acumulado de trabalho

### 3.3 Bar Chart (Gráfico de Barras)
**Uso**: Comparação de volumes entre períodos
```
📊 Volume por Semana (Bar Chart)
```
- Barras verticais com alturas proporcionais
- Ideal para: O.S por semana, por técnico

### 3.4 Stacked Bar Chart (Barras Empilhadas)
**Uso**: Distribuição por categoria
```
📊 Distribuição por Prioridade (Stacked Bar)
```
- Múltiplas cores em sequência horizontal
- Ideal para: O.S por status, por contrato

### 3.5 Donut Chart (Gráfico de Rosca)
**Uso**: Proporções de um todo
```
🍩 Mix de Canais (Donut)
```
- Círculo vazado com segmentos coloridos
- Ideal para: distribuição de status de O.S

### 3.6 Gauge (Medidor)
**Uso**: Indicador de progresso ou SLA
```
🎯 SLA Atual (Gauge)
```
- Semicírculo com valor percentual
- Ideal para: taxa de conclusão, SLA

### 3.7 Heatmap (Mapa de Calor)
**Uso**: Atividade por período (dia/hora)
```
🔥 Atividade por Dia da Semana (Heatmap)
```
- Grid de células com intensidades de cor
- Ideal para: atividade por dia da semana

### 3.8 Tabela de KPIs com Badges
**Uso**: Comparativo detalhado com status
```
📋 Tabela de Performance por Canal
```
- Tabela estilizada com badges coloridos
- Ideal para: performance por contrato/técnico

---

## 4. Plano de Atualização do Dashboard

### 4.1 Estado Atual do Dashboard

O Dashboard atual possui:
- 4 cards de métricas simples (Total, Concluídas, Abertas, Atrasadas)
- 1 gráfico de pizza (distribuição por status)
- 1 gráfico de barras (por contrato)

### 4.2 Proposta de Novo Dashboard

**Seção 1: Executive Overview (KPIs Principais)**

| Métrica | Tipo de Card | Ícone |
|---------|--------------|-------|
| Total de O.S | Stat Card com sparkline | 📋 |
| Taxa de Conclusão | Stat Card com gauge mini | ✅ |
| O.S Atrasadas | Stat Card com delta negativo | ⚠️ |
| O.S Urgentes (7 dias) | Stat Card com delta | 🕐 |
| Valor Total Orçado | Stat Card monetário | 💰 |
| Valor Total Aprovado | Stat Card monetário | 💵 |

**Seção 2: Visualizações Principais**

| Gráfico | Tipo | Dados |
|---------|------|-------|
| Tendência Mensal | Line Chart | O.S concluídas por mês |
| Distribuição por Status | Donut Chart | Todas as O.S por situação |
| SLA de Conclusão | Gauge | % dentro do prazo |
| Volume por Semana | Bar Chart | O.S abertas por semana |

**Seção 3: Análises Operacionais**

| Gráfico | Tipo | Dados |
|---------|------|-------|
| O.S por Contrato | Stacked Bar | Contratos com status empilhado |
| Performance por Técnico | Bar Chart horizontal | O.S por técnico |
| Atividade Semanal | Heatmap | O.S por dia da semana |
| Ranking de Elaboradores | Tabela de KPIs | Top elaboradores com badges |

### 4.3 Novos Gráficos a Implementar

**Total de gráficos propostos: 8** (atualmente tem 2)

1. **Line Chart** - Tendência de conclusão mensal
2. **Donut Chart** - Substituir pizza atual por design Ocean Breeze
3. **Gauge** - Taxa de SLA (% no prazo)
4. **Bar Chart Vertical** - Volume semanal
5. **Stacked Bar** - O.S por contrato com status
6. **Bar Chart Horizontal** - Performance por técnico
7. **Heatmap** - Atividade por dia da semana
8. **Tabela de KPIs** - Ranking com badges

### 4.4 Novas Métricas a Adicionar

| Métrica | Descrição | Delta |
|---------|-----------|-------|
| Tempo Médio de Conclusão | Dias entre abertura e conclusão | ↓ bom |
| SLA Compliance | % concluídas no prazo | ↑ bom |
| Backlog | O.S com mais de 30 dias abertas | ↓ bom |
| Taxa de Dificuldades | % de O.S com dificuldade registrada | ↓ bom |
| Throughput Diário | Média de O.S concluídas por dia | ↑ bom |
| Valor Médio por O.S | Média de valorOrcado | - |

---

## 5. Plano de Padronização por Página

### 5.1 Dashboard (PRIORIDADE MÁXIMA)

**Alterações visuais:**
- [ ] Aplicar fundo `--TM-background` (#f0f8ff)
- [ ] Redesenhar cards de métricas com estilo `stat-card`
- [ ] Adicionar sparklines nos cards principais
- [ ] Implementar deltas (↑ ↓) com cores semânticas
- [ ] Redesenhar gráfico de pizza como Donut Chart
- [ ] Atualizar gráfico de barras com cores `--TM-chart-*`

**Novos gráficos:**
- [ ] Adicionar Line Chart (tendência mensal)
- [ ] Adicionar Gauge (SLA compliance)
- [ ] Adicionar Heatmap (atividade semanal)
- [ ] Adicionar Stacked Bar (status por contrato)
- [ ] Adicionar Tabela de KPIs (ranking de técnicos)

**Novas métricas:**
- [ ] Tempo médio de conclusão
- [ ] SLA compliance (%)
- [ ] Backlog (O.S atrasadas >30 dias)
- [ ] Throughput diário
- [ ] Valores financeiros totais

### 5.2 TeamList (Equipe)

- [ ] Aplicar fundo padronizado
- [ ] Redesenhar cards de estatísticas com ícones circulares
- [ ] Estilizar tabela com hover states do Ocean Breeze
- [ ] Atualizar badges de função com cores vibrantes
- [ ] Adicionar barras de progresso por pessoa
- [ ] Modal de adicionar membro no novo design

### 5.3 AgendaAndChecklist (Agenda)

- [ ] Aplicar fundo padronizado
- [ ] Redesenhar calendário com células estilizadas
- [ ] Adicionar indicadores de O.S por dia (badges)
- [ ] Estilizar navegação de mês
- [ ] Painel lateral com detalhes do dia selecionado
- [ ] Cores de status nos eventos

### 5.4 BalancoPreventivas

- [ ] Aplicar fundo padronizado
- [ ] Redesenhar tabelas de balanço com estilo Ocean Breeze
- [ ] Cards de totalizadores com ícones
- [ ] Botões de exportação estilizados
- [ ] Gráfico de barras para comparativo financeiro
- [ ] Cores semânticas para valores (verde = positivo)

### 5.5 Reports (Relatórios)

- [ ] Aplicar fundo padronizado
- [ ] Redesenhar painel de filtros com cards
- [ ] Tabela de resultados com estilo Ocean Breeze
- [ ] Botão de exportação CSV estilizado
- [ ] Badges de filtros ativos
- [ ] Paginação com novo design

### 5.6 DifficultyLog

- [ ] Aplicar fundo padronizado
- [ ] Redesenhar cards de dificuldade
- [ ] Campo de busca estilizado
- [ ] Indicadores de severidade com badges
- [ ] Timeline visual para histórico
- [ ] Cores por tipo de dificuldade

### 5.7 Settings (Configurações)

- [ ] Aplicar fundo padronizado
- [ ] Organizar seções com cards separados
- [ ] Toggles e controles com novo design
- [ ] Ícones nas seções
- [ ] Formulários de preferência estilizados

### 5.8 ImportOS

- [ ] Revisar área de upload (drag & drop)
- [ ] Indicadores de progresso animados
- [ ] Tabela de mapeamento estilizada
- [ ] Tela de sucesso com animação
- [ ] Cores de feedback (erro, sucesso, warning)

---

## 6. Componentes Reutilizáveis

### 6.1 Componentes a Criar

| Componente | Descrição | Referência |
|------------|-----------|------------|
| `PageContainer` | Wrapper com fundo e padding padrão | styles.css `.container` |
| `StatCard` | Card de métrica com ícone e delta | dashboards.html `.stat-card` |
| `ChartCard` | Container para gráficos | dashboards.html `.chart-card` |
| `DataTable` | Tabela estilizada com hover | patterns.html tabela |
| `FilterBar` | Barra de filtros com tabs | dashboards.html `.tabs` |
| `Badge` | Badge/pill colorido | components.html `.pill` |
| `Alert` | Alertas de feedback | components.html `.alert` |

### 6.2 Estilos CSS a Importar

```css
/* Importar do Ocean Breeze */
.stat-card { ... }
.stat-label { ... }
.stat-value { ... }
.stat-delta { ... }
.stat-delta.positive { ... }
.stat-delta.negative { ... }
.mini-sparkline { ... }
.chart-card { ... }
.donut { ... }
.gauge { ... }
.heatmap { ... }
.heatmap-cell { ... }
```

---

## 7. Cores por Status de O.S

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| Fornecedor Acionado | Azul | #3b82f6 | Badge, gráficos |
| Em Levantamento | Roxo | #8b5cf6 | Badge, gráficos |
| Em Elaboração | Âmbar | #f59e0b | Badge, gráficos |
| Em Orçamento | Ciano | #06b6d4 | Badge, gráficos |
| Concluída | Verde | #22c55e | Badge, gráficos |
| Com Dificuldade | Vermelho | #ef4444 | Badge, gráficos |
| Mudança de Contrato | Cinza | #6b7280 | Badge, gráficos |

---

## 8. Cronograma de Implementação

### Fase 1: Dashboard Completo (4-6 horas)
**Prioridade: Máxima**

1. Refatorar layout com grid responsivo
2. Implementar 6 novos stat-cards com métricas
3. Substituir gráfico de pizza por Donut Chart
4. Adicionar Line Chart de tendência
5. Adicionar Gauge de SLA
6. Implementar Heatmap de atividade
7. Adicionar Stacked Bar por contrato
8. Criar Tabela de KPIs de performance

### Fase 2: Páginas de Alto Impacto (2-3 horas)
1. TeamList - Gestão de equipe
2. AgendaAndChecklist - Calendário

### Fase 3: Páginas Secundárias (2-3 horas)
3. BalancoPreventivas
4. Reports
5. DifficultyLog
6. Settings
7. ImportOS (revisão)

---

## 9. Métricas de Sucesso

### Visual
- [ ] Todas as páginas usando fundo `#f0f8ff`
- [ ] Cards com border-radius consistente (8-12px)
- [ ] Paleta de cores aplicada uniformemente
- [ ] Tipografia DM Sans em todo o sistema
- [ ] Transições e hover states funcionando
- [ ] Responsividade em todas as páginas

### Dashboard
- [ ] 6+ métricas com stat-cards modernos
- [ ] 8 tipos de gráficos implementados
- [ ] Deltas (↑ ↓) em todas as métricas aplicáveis
- [ ] Tabs para filtros de período (7d/30d/90d)
- [ ] Cores de gráficos seguindo `--TM-chart-*`

### Funcionalidade
- [ ] Dados reais do banco em todos os gráficos
- [ ] Filtros funcionando corretamente
- [ ] Exportação CSV mantida
- [ ] Performance aceitável (< 2s de carregamento)

---

## 10. Referências Visuais

Para consultar exemplos visuais, abra os arquivos HTML no navegador:

1. **Design System completo**: `ocean-breeze-pages/pages/index.html`
2. **Tokens (cores, tipografia)**: `ocean-breeze-pages/pages/tokens.html`
3. **Componentes (botões, cards)**: `ocean-breeze-pages/pages/components.html`
4. **Dashboards (gráficos)**: `ocean-breeze-pages/pages/dashboards.html`
5. **Padrões de tela**: `ocean-breeze-pages/pages/patterns.html`
6. **Mobile preview**: `ocean-breeze-pages/pages/mobile.html`

---

*Documento criado em: Janeiro 2026*
*Versão: 2.0*
*Baseado em: Design System TM - Ocean Breeze v2.0*
