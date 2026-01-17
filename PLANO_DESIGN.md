# Plano de Padronização Visual - MAFFENG CMMS

## Resumo Executivo

Este documento detalha o plano de padronização visual do sistema MAFFENG CMMS, unificando todas as páginas sob o mesmo design system identificado nas páginas de **Login** e **Ordens de Serviço**, que se destacaram pela qualidade visual.

---

## 1. Estado Atual do Sistema

### 1.1 Funcionalidades Implementadas

| Módulo | Status | Descrição |
|--------|--------|-----------|
| Login | ✅ Completo | Seleção por perfil com design premium |
| Dashboard | ✅ Completo | Métricas e gráficos (precisa atualização visual) |
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

- **Paulo Silva (Gerente)**: Acesso total ao sistema
- **Elaboradores** (Thiago, Danilo, Felipe, Davi): Gerenciam O.S atribuídas
- **Administradores de Contrato** (Alexandre, João Victor, Laura): Preenchem valores aprovados
- **Técnicos** (9 profissionais): Listados apenas para atribuição, não acessam o sistema

---

## 2. Design System de Referência

### 2.1 Páginas Modelo

As páginas **Login** e **WorkOrders** estabelecem o padrão visual a ser seguido:

#### Login
- Fundo com gradiente escuro: `linear-gradient(135deg, #0f172a → #1e3a5f → #0f172a)`
- Efeitos decorativos radiais com verde esmeralda
- Cards com efeito glassmorphism (blur + transparência)
- Tipografia: DM Sans, pesos bold para títulos

#### WorkOrders (Ocean Breeze)
- Fundo suave: `#f0f8ff` (azul gelo)
- Cards brancos com bordas arredondadas (16px)
- Sombras sutis: `shadow-lg` a `shadow-2xl`
- Espaçamento generoso entre elementos

### 2.2 Paleta de Cores Oficial

```css
/* Design System Ocean Breeze */
--background: #f0f8ff;        /* Fundo principal */
--foreground: #374151;        /* Texto principal */
--card: #ffffff;              /* Fundo de cards */
--card-foreground: #374151;   /* Texto em cards */

/* Cores Primárias */
--primary: #22c55e;           /* Verde principal */
--primary-hover: #16a34a;     /* Verde hover */
--primary-light: #34d399;     /* Verde claro (destaques) */

/* Cores Secundárias */
--secondary: #e0f2fe;         /* Azul claro */
--muted: #f3f4f6;             /* Cinza suave */
--muted-foreground: #6b7280;  /* Texto secundário */
--accent: #d1fae5;            /* Verde pastel */

/* Bordas e Divisores */
--border: #e5e7eb;            /* Bordas padrão */
--ring: #22c55e;              /* Foco/Outline */

/* Status */
--destructive: #ef4444;       /* Erro/Perigo */
--warning: #f59e0b;           /* Alerta */
--success: #22c55e;           /* Sucesso */
--info: #3b82f6;              /* Informação */

/* Gráficos */
--chart-1: #22c55e;
--chart-2: #10b981;
--chart-3: #059669;
--chart-4: #047857;
--chart-5: #065f46;
```

### 2.3 Cores por Status de O.S

| Status | Cor | Hex |
|--------|-----|-----|
| Fornecedor Acionado | Azul | #3b82f6 |
| Em Levantamento | Roxo | #8b5cf6 |
| Em Elaboração | Âmbar | #f59e0b |
| Em Orçamento | Ciano | #06b6d4 |
| Concluída | Verde | #22c55e |
| Com Dificuldade | Vermelho | #ef4444 |
| Mudança de Contrato | Cinza | #6b7280 |

### 2.4 Tipografia

- **Títulos principais**: DM Sans Bold, 24-32px
- **Subtítulos**: Inter Semi-bold, 18-20px
- **Corpo**: Inter Regular, 14-16px
- **Labels**: Inter Medium, 12-14px
- **Dados numéricos**: Tabular nums para alinhamento

### 2.5 Componentes Padrão

#### Cards
```css
border-radius: 16px;
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
border: 1px solid #e5e7eb;
```

#### Botões Primários
```css
background: #22c55e;
color: white;
border-radius: 8px;
padding: 10px 20px;
font-weight: 500;
transition: all 0.2s;

&:hover {
  background: #16a34a;
  transform: translateY(-1px);
}
```

#### Inputs
```css
border: 1px solid #e5e7eb;
border-radius: 8px;
padding: 12px 16px;
background: white;

&:focus {
  border-color: #22c55e;
  ring: 2px solid rgba(34, 197, 94, 0.2);
}
```

#### Badges
```css
border-radius: 9999px;
padding: 4px 12px;
font-size: 12px;
font-weight: 500;
border: 1px solid;
```

---

## 3. Páginas a Atualizar

### 3.1 Dashboard
**Prioridade: Alta**

Alterações necessárias:
- [ ] Aplicar fundo `#f0f8ff` no container principal
- [ ] Atualizar cards de métricas com novo estilo (bordas arredondadas, sombras)
- [ ] Adicionar ícones com círculos coloridos de fundo
- [ ] Padronizar cores dos gráficos com paleta oficial
- [ ] Melhorar tipografia dos números grandes
- [ ] Adicionar gradiente sutil no header da página

### 3.2 TeamList (Equipe)
**Prioridade: Alta**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Redesenhar cards de estatísticas no topo
- [ ] Melhorar visual da tabela com hover states
- [ ] Atualizar badges de função com cores mais vibrantes
- [ ] Redesenhar modal de adicionar membro
- [ ] Adicionar avatares com cores por tipo de usuário

### 3.3 AgendaAndChecklist (Agenda)
**Prioridade: Média**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Redesenhar calendário com estilo mais moderno
- [ ] Melhorar indicadores de O.S por dia
- [ ] Adicionar navegação de mês com botões estilizados
- [ ] Atualizar painel lateral de detalhes do dia
- [ ] Aplicar cores de status nos eventos

### 3.4 BalancoPreventivas
**Prioridade: Média**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Redesenhar tabelas de balanço
- [ ] Melhorar cards de totalizadores
- [ ] Estilizar botões de exportação CSV
- [ ] Adicionar separadores visuais entre seções
- [ ] Aplicar cores da paleta nos valores monetários

### 3.5 Reports (Relatórios)
**Prioridade: Média**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Redesenhar painel de filtros
- [ ] Melhorar visual da tabela de resultados
- [ ] Estilizar botão de exportação
- [ ] Adicionar feedback visual nos filtros ativos
- [ ] Melhorar responsividade

### 3.6 DifficultyLog (Log de Dificuldades)
**Prioridade: Baixa**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Redesenhar cards de dificuldade
- [ ] Melhorar campo de busca
- [ ] Adicionar indicadores visuais de severidade
- [ ] Aplicar timeline visual para histórico

### 3.7 Settings (Configurações)
**Prioridade: Baixa**

Alterações necessárias:
- [ ] Aplicar fundo padronizado
- [ ] Organizar seções com cards separados
- [ ] Melhorar toggles e controles
- [ ] Adicionar ícones nas seções
- [ ] Estilizar formulários de preferência

### 3.8 ImportOS
**Prioridade: Baixa**

Alterações necessárias:
- [ ] Revisar área de upload (drag & drop)
- [ ] Melhorar indicadores de progresso
- [ ] Estilizar tabela de mapeamento
- [ ] Atualizar tela de sucesso
- [ ] Aplicar cores de feedback (erro, sucesso)

---

## 4. Cronograma de Implementação

### Fase 1: Páginas de Alto Impacto (2-3 horas)
1. Dashboard - Página mais visualizada
2. TeamList - Gestão de equipe

### Fase 2: Páginas de Fluxo Principal (2-3 horas)
3. AgendaAndChecklist - Calendário
4. BalancoPreventivas - Análise financeira

### Fase 3: Páginas Secundárias (1-2 horas)
5. Reports
6. DifficultyLog
7. Settings
8. ImportOS (revisão)

---

## 5. Componentes Reutilizáveis a Criar

Para facilitar a padronização, serão criados/atualizados:

1. **PageContainer**: Wrapper com fundo e espaçamento padrão
2. **StatCard**: Card de estatística com ícone colorido
3. **SectionHeader**: Cabeçalho de seção com título e ações
4. **DataTable**: Tabela estilizada com sorting e hover
5. **FilterBar**: Barra de filtros padronizada
6. **EmptyState**: Estado vazio com ilustração e ação

---

## 6. Métricas de Sucesso

- [ ] Todas as páginas usando fundo `#f0f8ff`
- [ ] Cards com border-radius de 16px consistente
- [ ] Paleta de cores aplicada uniformemente
- [ ] Tipografia padronizada em todas as páginas
- [ ] Transições e hover states consistentes
- [ ] Responsividade mantida em todas as alterações

---

## 7. Observações Finais

Este plano visa criar uma experiência visual coesa e profissional em todo o sistema MAFFENG CMMS, elevando a qualidade percebida e facilitando a navegação dos usuários.

As páginas de Login e WorkOrders já demonstram o nível de qualidade desejado e servirão como referência constante durante a implementação.

---

*Documento criado em: Janeiro 2026*
*Versão: 1.0*
