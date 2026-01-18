import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  TrendingUp,
  Upload,
  Database,
  DollarSign,
  Activity,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { useOSStore } from "../lib/store";
import {
  format,
  parseISO,
  isAfter,
  isBefore,
  addDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  isValid,
  getDay,
  differenceInDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Ocean Breeze Design System Colors
const OB = {
  background: "#f0f8ff",
  foreground: "#374151",
  card: "#ffffff",
  cardForeground: "#374151",
  primary: "#22c55e",
  primaryForeground: "#ffffff",
  secondary: "#e0f2fe",
  secondaryForeground: "#4b5563",
  muted: "#f3f4f6",
  mutedForeground: "#6b7280",
  accent: "#d1fae5",
  accentForeground: "#374151",
  border: "#e5e7eb",
  chart1: "#22c55e",
  chart2: "#10b981",
  chart3: "#059669",
  chart4: "#047857",
  chart5: "#065f46",
  destructive: "#ef4444",
};

const STATUS_COLORS: Record<string, string> = {
  "Fornecedor Acionado": "#3b82f6",
  "Em Levantamento": "#8b5cf6",
  "Em Elaboração": "#f59e0b",
  "Em Orçamento": "#06b6d4",
  Concluída: OB.chart1,
  "Com Dificuldade": OB.destructive,
  "Mudança de Contrato": "#6b7280",
};

interface DashboardProps {
  onNavigateToImport?: () => void;
}

export function Dashboard({ onNavigateToImport }: DashboardProps) {
  const ordensServico = useOSStore((state) => state.ordensServico);

  const parseDate = (dateStr: string | null | undefined): Date | null => {
    if (!dateStr) return null;
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const stats = useMemo(() => {
    const hoje = new Date();
    const total = ordensServico.length;
    const concluidas = ordensServico.filter(
      (os) => os.situacao === "Concluída",
    ).length;
    const abertas = ordensServico.filter(
      (os) => os.situacao !== "Concluída",
    ).length;

    const atrasadas = ordensServico.filter((os) => {
      if (os.situacao === "Concluída") return false;
      const vencimento = parseDate(os.vencimento);
      if (!vencimento) return false;
      return isBefore(vencimento, hoje);
    }).length;

    const urgentes = ordensServico.filter((os) => {
      if (os.situacao === "Concluída") return false;
      const vencimento = parseDate(os.vencimento);
      if (!vencimento) return false;
      const em7Dias = addDays(hoje, 7);
      return isAfter(vencimento, hoje) && isBefore(vencimento, em7Dias);
    }).length;

    const taxaConclusao =
      total > 0 ? ((concluidas / total) * 100).toFixed(1) : "0";

    // Novas Métricas Financeiras
    const valorTotalOrcado = ordensServico.reduce(
      (acc, os) => acc + (os.valorOrcado || 0),
      0,
    );
    const valorTotalAprovado = ordensServico.reduce(
      (acc, os) => acc + (os.valorAprovado || 0),
      0,
    );

    // Backlog (> 30 dias abertas)
    const backlog = ordensServico.filter((os) => {
      if (os.situacao === "Concluída") return false;
      const criadoEm = parseDate(os.criadoEm);
      if (!criadoEm) return false;
      const diff = differenceInDays(hoje, criadoEm);
      return diff > 30;
    }).length;

    // SLA Compliance (Estimativa baseada em atrasadas)
    // Se não está atrasada, está no prazo (compliance)
    // Compliance = (Total - Atrasadas) / Total * 100
    // Isso considera fechadas que podem ter atrasado como "no prazo" se não tivermos data de conclusão histórica,
    // mas para o dashboard atual, foca no estado atual.
    // Melhor: Concluídas + Abertas no Prazo
    const noPrazo = total - atrasadas;
    const slaCompliance =
      total > 0 ? ((noPrazo / total) * 100).toFixed(1) : "100";

    return {
      total,
      concluidas,
      abertas,
      atrasadas,
      urgentes,
      taxaConclusao,
      valorTotalOrcado: valorTotalOrcado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      valorTotalAprovado: valorTotalAprovado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      backlog,
      slaCompliance,
    };
  }, [ordensServico]);

  const pieData = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const statusCounts: Record<string, number> = {};
    ordensServico.forEach((os) => {
      statusCounts[os.situacao] = (statusCounts[os.situacao] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#6b7280",
    }));
  }, [ordensServico]);

  const lineData = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const hoje = new Date();
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const mes = subMonths(hoje, i);
      meses.push(mes);
    }

    return meses.map((mes) => {
      const nomeMes = format(mes, "MMM", { locale: ptBR });
      const inicio = startOfMonth(mes);
      const fim = endOfMonth(mes);

      const noMes = ordensServico.filter((os) => {
        const data = parseDate(os.criadoEm); // Usando Data de Criação como base para volume
        if (!data) return false;
        return isAfter(data, inicio) && isBefore(data, fim);
      });

      const concluidasNoMes = ordensServico.filter((os) => {
        // Idealmente usariamos data de conclusão, mas vamos usar atualizadoEm se status=Concluída
        if (os.situacao !== "Concluída") return false;
        const data = parseDate(os.atualizadoEm || os.criadoEm);
        if (!data) return false;
        return isAfter(data, inicio) && isBefore(data, fim);
      }).length;

      return {
        name: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
        Criadas: noMes.length,
        Concluídas: concluidasNoMes,
      };
    });
  }, [ordensServico]);

  const stackedBarData = useMemo(() => {
    // Top 5 contratos
    const contratosMap: Record<
      string,
      { concluidas: number; pendentes: number }
    > = {};

    ordensServico.forEach((os) => {
      const contrato = os.contrato || "Sem Contrato";
      if (!contratosMap[contrato])
        contratosMap[contrato] = { concluidas: 0, pendentes: 0 };

      if (os.situacao === "Concluída") {
        contratosMap[contrato].concluidas++;
      } else {
        contratosMap[contrato].pendentes++;
      }
    });

    return Object.entries(contratosMap)
      .map(([name, data]) => ({
        name,
        Concluídas: data.concluidas,
        Pendentes: data.pendentes,
        Total: data.concluidas + data.pendentes,
      }))
      .sort((a, b) => b.Total - a.Total)
      .slice(0, 5);
  }, [ordensServico]);

  const heatmapData = useMemo(() => {
    // Dias da semana (0-6, Dom-Sab)
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const counts = new Array(7).fill(0);

    ordensServico.forEach((os) => {
      const data = parseDate(os.criadoEm);
      if (data) {
        const diaSemana = getDay(data); // 0 = Domingo
        counts[diaSemana]++;
      }
    });

    // Normalizar para intensidade 1-5
    const max = Math.max(...counts, 1);

    return dias.map((dia, index) => ({
      dia,
      count: counts[index],
      intensity: Math.ceil((counts[index] / max) * 5),
    }));
  }, [ordensServico]);

  const kpiData = useMemo(() => {
    // Performance por Técnico
    const tecnicosMap: Record<string, { total: number; concluidas: number }> =
      {};

    ordensServico.forEach((os) => {
      // Usar tecnico (nome) ou tecnicoId
      const tec = os.tecnico || "Não Atribuído";
      if (tec === "Não Atribuído") return;

      if (!tecnicosMap[tec]) tecnicosMap[tec] = { total: 0, concluidas: 0 };
      tecnicosMap[tec].total++;
      if (os.situacao === "Concluída") tecnicosMap[tec].concluidas++;
    });

    return Object.entries(tecnicosMap)
      .map(([name, data]) => ({
        name,
        total: data.total,
        concluidas: data.concluidas,
        taxa:
          data.total > 0 ? Math.round((data.concluidas / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [ordensServico]);

  const tarefasUrgentes = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const hoje = new Date();
    const em7Dias = addDays(hoje, 7);

    return ordensServico
      .filter((os) => {
        if (os.situacao === "Concluída") return false;
        const vencimento = parseDate(os.vencimento);
        if (!vencimento) return false;
        return isBefore(vencimento, em7Dias);
      })
      .sort((a, b) => {
        const dataA = parseDate(a.vencimento)?.getTime() || 0;
        const dataB = parseDate(b.vencimento)?.getTime() || 0;
        return dataA - dataB;
      })
      .slice(0, 5);
  }, [ordensServico]);

  const formatVencimento = (vencimento: string) => {
    const data = parseDate(vencimento);
    if (!data) return { texto: "Sem data", cor: OB.mutedForeground };

    const hoje = new Date();
    const diffDias = Math.ceil(
      (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDias < 0) {
      return {
        texto: `Atrasada ${Math.abs(diffDias)} dia(s)`,
        cor: OB.destructive,
      };
    } else if (diffDias === 0) {
      return { texto: "Vence hoje", cor: OB.destructive };
    } else if (diffDias === 1) {
      return { texto: "Vence amanhã", cor: "#f59e0b" };
    } else {
      return { texto: `Vence em ${diffDias} dias`, cor: "#f59e0b" };
    }
  };

  const totalPie = pieData.reduce((sum, item) => sum + item.value, 0);

  const contratos = useMemo(() => {
    const set = new Set(ordensServico.map((os) => os.contrato));
    return Array.from(set);
  }, [ordensServico]);

  const cardStyle = {
    background: OB.card,
    border: `1px solid ${OB.border}`,
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };

  const tooltipStyle = {
    backgroundColor: OB.card,
    borderRadius: "12px",
    border: `1px solid ${OB.border}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  // Empty State
  if (ordensServico.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ color: OB.foreground }}
            >
              Dashboard
            </h2>
            <p style={{ color: OB.mutedForeground }}>
              Visão geral das ordens de serviço
            </p>
          </div>
        </div>

        <Card
          style={{
            background: OB.card,
            border: `2px dashed ${OB.border}`,
            borderRadius: "16px",
          }}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div
              className="p-5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${OB.accent}, rgba(34, 197, 94, 0.1))`,
              }}
            >
              <Database className="h-12 w-12" style={{ color: OB.primary }} />
            </div>
            <div className="space-y-2">
              <h3
                className="text-xl font-semibold"
                style={{ color: OB.foreground }}
              >
                Nenhuma O.S importada
              </h3>
              <p style={{ color: OB.mutedForeground }} className="max-w-md">
                O Dashboard exibe dados exclusivamente das ordens de serviço que
                você importar. Importe uma planilha para começar a visualizar
                métricas e gráficos.
              </p>
            </div>
            {onNavigateToImport && (
              <Button
                onClick={onNavigateToImport}
                className="mt-4"
                style={{
                  background: `linear-gradient(135deg, ${OB.primary}, ${OB.chart2})`,
                  color: OB.primaryForeground,
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontWeight: 600,
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Planilha
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50">
          <StatsCard
            title="Total de O.S"
            value="0"
            description="Nenhuma importada"
            icon={<FileText style={{ color: OB.mutedForeground }} />}
          />
          <StatsCard
            title="Taxa de Conclusão"
            value="0%"
            description="0 em andamento"
            icon={<CheckCircle style={{ color: OB.mutedForeground }} />}
          />
          <StatsCard
            title="Ordens Abertas"
            value="0"
            description="0 vencendo em 7 dias"
            icon={<Wrench style={{ color: OB.mutedForeground }} />}
          />
          <StatsCard
            title="Atrasadas"
            value="0"
            description="Nenhuma atrasada"
            icon={<AlertTriangle style={{ color: OB.mutedForeground }} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: OB.foreground }}
          >
            Dashboard
          </h2>
          <p style={{ color: OB.mutedForeground }}>
            {stats.total} O.S importadas • {contratos.length} contrato(s)
          </p>
        </div>
      </div>

      {/* Stats Grid - 6 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Row 1 */}
        <StatsCard
          title="Total de O.S"
          value={stats.total.toString()}
          description={`${stats.concluidas} concluídas`}
          icon={<FileText style={{ color: "#3b82f6" }} />}
          accentColor="#3b82f6"
        />
        <StatsCard
          title="Taxa de Conclusão"
          value={`${stats.taxaConclusao}%`}
          description={`${stats.abertas} em andamento`}
          icon={<CheckCircle style={{ color: OB.chart1 }} />}
          accentColor={OB.chart1}
        />
        <StatsCard
          title="SLA Compliance"
          value={`${stats.slaCompliance}%`}
          description="Dentro do prazo"
          icon={<Activity style={{ color: OB.chart2 }} />}
          accentColor={OB.chart2}
        />

        {/* Row 2 */}
        <StatsCard
          title="O.S Atrasadas"
          value={stats.atrasadas.toString()}
          description={
            stats.atrasadas > 0 ? "Requer atenção" : "Nenhuma atrasada"
          }
          icon={<AlertTriangle style={{ color: OB.destructive }} />}
          highlight={stats.atrasadas > 0}
          accentColor={OB.destructive}
        />
        <StatsCard
          title="Valor Orçado"
          value={stats.valorTotalOrcado}
          description="Total acumulado"
          icon={<DollarSign style={{ color: "#f59e0b" }} />}
          accentColor="#f59e0b"
        />
        <StatsCard
          title="Valor Aprovado"
          value={stats.valorTotalAprovado}
          description="Total aprovado"
          icon={<DollarSign style={{ color: "#059669" }} />}
          accentColor="#059669"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Line Chart - Spans 2 cols */}
        <Card className="lg:col-span-2" style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: OB.foreground }}>
              Tendência de O.S
            </CardTitle>
            <CardDescription style={{ color: OB.mutedForeground }}>
              Volume de criação vs conclusão (6 meses)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={OB.chart2} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={OB.chart2} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorConcluidas"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={OB.chart1} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={OB.chart1} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={OB.border}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: OB.mutedForeground }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: OB.mutedForeground }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="Criadas"
                  stroke={OB.chart2}
                  fillOpacity={1}
                  fill="url(#colorCriadas)"
                />
                <Area
                  type="monotone"
                  dataKey="Concluídas"
                  stroke={OB.chart1}
                  fillOpacity={1}
                  fill="url(#colorConcluidas)"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart - Status */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: OB.foreground }}>Status Atual</CardTitle>
            <CardDescription style={{ color: OB.mutedForeground }}>
              Distribuição por situação
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] relative flex flex-col items-center justify-center">
            <div className="w-full h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[50%] text-center pointer-events-none">
                <span
                  className="text-4xl font-bold block"
                  style={{ color: OB.foreground }}
                >
                  {stats.total}
                </span>
                <span
                  className="text-xs uppercase font-semibold block tracking-wider"
                  style={{ color: OB.mutedForeground }}
                >
                  Total
                </span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="truncate"
                    style={{ color: OB.mutedForeground }}
                  >
                    {entry.name}
                  </span>
                  <span
                    className="ml-auto font-medium"
                    style={{ color: OB.foreground }}
                  >
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar - Contracts */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: OB.foreground }}>
              O.S por Contrato
            </CardTitle>
            <CardDescription style={{ color: OB.mutedForeground }}>
              Top 5 contratos por volume
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedBarData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke={OB.border}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 11, fill: OB.mutedForeground }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar
                  dataKey="Concluídas"
                  stackId="a"
                  fill={OB.chart1}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="Pendentes"
                  stackId="a"
                  fill={OB.secondary}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap & Activity */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle style={{ color: OB.foreground }}>
              Atividade Semanal
            </CardTitle>
            <CardDescription style={{ color: OB.mutedForeground }}>
              Intensidade de criação (Semanas recentes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Heatmap Visual - True Grid Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: OB.mutedForeground }}
                >
                  Últimos 7 dias
                </span>
              </div>
              <div className="flex gap-3 h-[40px]">
                {heatmapData.map((d) => (
                  <div
                    key={d.dia}
                    className="flex-1 flex flex-col gap-1 items-center group relative cursor-help"
                  >
                    <div
                      className="w-full h-full rounded-md transition-all duration-300"
                      style={{
                        backgroundColor: d.count > 0 ? OB.chart1 : OB.muted,
                        opacity: d.count > 0 ? 0.3 + d.intensity * 0.14 : 0.5,
                      }}
                    />
                    {/* Day Label */}
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: OB.mutedForeground }}
                    >
                      {d.dia}
                    </span>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none z-10">
                      {d.count} O.S criadas
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: OB.border }}>
              <div className="flex items-center justify-between mb-4">
                <h4
                  className="text-sm font-semibold"
                  style={{ color: OB.foreground }}
                >
                  Top Performance
                </h4>
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
                  Conclusões
                </span>
              </div>

              <div className="space-y-3">
                {kpiData.map((kpi, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm group hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          background: i === 0 ? OB.chart1 : OB.secondary,
                          color: i === 0 ? "#fff" : OB.secondaryForeground,
                          border:
                            i === 0
                              ? `1px solid ${OB.chart1}`
                              : `1px solid ${OB.border}`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="font-medium leading-none"
                          style={{ color: OB.foreground }}
                        >
                          {kpi.name}
                        </span>
                        <span
                          className="text-[10px] mt-0.5"
                          style={{ color: OB.mutedForeground }}
                        >
                          {kpi.total} O.S atribuídas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className="text-xs font-bold"
                          style={{ color: OB.chart1 }}
                        >
                          {kpi.concluidas}
                        </div>
                        <div
                          className="text-[9px]"
                          style={{ color: OB.mutedForeground }}
                        >
                          concluídas
                        </div>
                      </div>
                      <div className="w-12 h-1.5 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${kpi.taxa}%`,
                            background: OB.chart1,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Tasks */}
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle style={{ color: OB.foreground }}>
            Tarefas Urgentes
          </CardTitle>
          <CardDescription style={{ color: OB.mutedForeground }}>
            O.S vencendo nos próximos 7 dias ou atrasadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tarefasUrgentes.length > 0 ? (
            <div className="space-y-3">
              {tarefasUrgentes.map((os) => {
                const vencInfo = formatVencimento(os.vencimento);
                const isAtrasada = vencInfo.texto.includes("Atrasada");

                return (
                  <div
                    key={os.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={{
                      background: isAtrasada
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04))"
                        : "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.04))",
                      border: `1px solid ${isAtrasada ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-2.5 rounded-lg"
                        style={{
                          background: isAtrasada
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(245, 158, 11, 0.15)",
                          color: isAtrasada ? OB.destructive : "#f59e0b",
                        }}
                      >
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: OB.foreground }}
                        >
                          O.S {os.os} - {os.prefixo || "Sem prefixo"}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: OB.mutedForeground }}
                        >
                          {os.agencia || "Sem agência"} •{" "}
                          {os.contrato || "Sem contrato"}
                        </p>
                        <p
                          className="text-xs font-medium mt-1"
                          style={{ color: vencInfo.cor }}
                        >
                          {vencInfo.texto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full"
                        style={{
                          background:
                            os.situacao === "Com Dificuldade"
                              ? "rgba(239, 68, 68, 0.15)"
                              : os.situacao === "Em Orçamento"
                                ? "rgba(6, 182, 212, 0.15)"
                                : os.situacao === "Em Elaboração"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : "rgba(59, 130, 246, 0.15)",
                          color:
                            os.situacao === "Com Dificuldade"
                              ? OB.destructive
                              : os.situacao === "Em Orçamento"
                                ? "#06b6d4"
                                : os.situacao === "Em Elaboração"
                                  ? "#f59e0b"
                                  : "#3b82f6",
                        }}
                      >
                        {os.situacao}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="text-center py-8"
              style={{ color: OB.mutedForeground }}
            >
              <div
                className="p-4 rounded-full mx-auto w-fit mb-3"
                style={{ background: OB.accent }}
              >
                <CheckCircle size={32} style={{ color: OB.chart1 }} />
              </div>
              <p className="font-medium" style={{ color: OB.foreground }}>
                Nenhuma tarefa urgente
              </p>
              <p className="text-sm">Todas as O.S estão dentro do prazo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  highlight = false,
  accentColor,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
  accentColor?: string;
}) {
  return (
    <Card
      style={{
        background: highlight
          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04))"
          : OB.card,
        border: `1px solid ${highlight ? "rgba(239, 68, 68, 0.2)" : OB.border}`,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      className="hover:shadow-lg hover:-translate-y-0.5"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p
            className="text-sm font-medium"
            style={{ color: OB.mutedForeground }}
          >
            {title}
          </p>
          <div
            className="p-2 rounded-lg"
            style={{
              background: accentColor ? `${accentColor}15` : OB.muted,
            }}
          >
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="text-2xl font-bold"
            style={{ color: highlight ? OB.destructive : OB.foreground }}
          >
            {value}
          </span>
          <p className="text-xs" style={{ color: OB.mutedForeground }}>
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
