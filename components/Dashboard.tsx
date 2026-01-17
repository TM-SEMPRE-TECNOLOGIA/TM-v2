import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
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
  Legend
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Wrench, FileText, TrendingUp, Upload, Database } from 'lucide-react';
import { Button } from './ui/button';
import { useOSStore } from '../lib/store';
import { format, parseISO, isAfter, isBefore, addDays, startOfMonth, endOfMonth, subMonths, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Ocean Breeze Design System Colors
// Chart Colors for Recharts (needs exact hex)
// Chart Colors for Recharts (needs exact hex)
const CHART_THEME = {
  primary: '#22c55e',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  muted: '#6b7280',
  grid: '#e5e7eb',
  card: '#ffffff',
  border: '#e5e7eb',
  foreground: '#374151',
  // Matches CSS variables
  chart1: '#22c55e',
  chart2: '#10b981',
  chart3: '#059669',
  chart4: '#047857',
  chart5: '#065f46',
};

const STATUS_COLORS: Record<string, string> = {
  'Fornecedor Acionado': CHART_THEME.info,
  'Em Levantamento': '#8b5cf6',
  'Em Elaboração': CHART_THEME.warning,
  'Em Orçamento': '#06b6d4',
  'Concluída': CHART_THEME.success,
  'Com Dificuldade': CHART_THEME.danger,
  'Mudança de Contrato': CHART_THEME.muted,
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
    const concluidas = ordensServico.filter(os => os.situacao === 'Concluída').length;
    const abertas = ordensServico.filter(os => os.situacao !== 'Concluída').length;

    const atrasadas = ordensServico.filter(os => {
      if (os.situacao === 'Concluída') return false;
      const vencimento = parseDate(os.vencimento);
      if (!vencimento) return false;
      return isBefore(vencimento, hoje);
    }).length;

    const urgentes = ordensServico.filter(os => {
      if (os.situacao === 'Concluída') return false;
      const vencimento = parseDate(os.vencimento);
      if (!vencimento) return false;
      const em7Dias = addDays(hoje, 7);
      return isAfter(vencimento, hoje) && isBefore(vencimento, em7Dias);
    }).length;

    const taxaConclusao = total > 0 ? ((concluidas / total) * 100).toFixed(1) : '0';

    return { total, concluidas, abertas, atrasadas, urgentes, taxaConclusao };
  }, [ordensServico]);

  const pieData = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const statusCounts: Record<string, number> = {};
    ordensServico.forEach(os => {
      statusCounts[os.situacao] = (statusCounts[os.situacao] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || '#6b7280'
    }));
  }, [ordensServico]);

  const barData = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const hoje = new Date();
    const meses: { name: string; month: Date }[] = [];

    for (let i = 5; i >= 0; i--) {
      const mes = subMonths(hoje, i);
      meses.push({
        name: format(mes, 'MMM', { locale: ptBR }),
        month: mes
      });
    }

    return meses.map(({ name, month }) => {
      const inicioMes = startOfMonth(month);
      const fimMes = endOfMonth(month);

      const osMes = ordensServico.filter(os => {
        const data = parseDate(os.criadoEm);
        if (!data) return false;
        return isAfter(data, inicioMes) && isBefore(data, fimMes);
      });

      const concluidas = osMes.filter(os => os.situacao === 'Concluída').length;
      const pendentes = osMes.filter(os => os.situacao !== 'Concluída').length;

      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        Concluídas: concluidas,
        Pendentes: pendentes
      };
    });
  }, [ordensServico]);

  const tarefasUrgentes = useMemo(() => {
    if (ordensServico.length === 0) return [];

    const hoje = new Date();
    const em7Dias = addDays(hoje, 7);

    return ordensServico
      .filter(os => {
        if (os.situacao === 'Concluída') return false;
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
    if (!data) return { texto: 'Sem data', cor: CHART_THEME.muted };

    const hoje = new Date();
    const diffDias = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      return { texto: `Atrasada ${Math.abs(diffDias)} dia(s)`, cor: CHART_THEME.danger };
    } else if (diffDias === 0) {
      return { texto: 'Vence hoje', cor: CHART_THEME.danger };
    } else if (diffDias === 1) {
      return { texto: 'Vence amanhã', cor: CHART_THEME.warning };
    } else {
      return { texto: `Vence em ${diffDias} dias`, cor: CHART_THEME.warning };
    }
  };

  const totalPie = pieData.reduce((sum, item) => sum + item.value, 0);

  const contratos = useMemo(() => {
    const set = new Set(ordensServico.map(os => os.contrato));
    return Array.from(set);
  }, [ordensServico]);

  // Empty State
  if (ordensServico.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>Dashboard</h2>
            <p style={{ color: OB.mutedForeground }}>Visão geral das ordens de serviço</p>
          </div>
        </div>

        <Card className="bg-card border-2 border-dashed border-border rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-5 rounded-full bg-accent/50">
              <Database className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Nenhuma O.S importada</h3>
              <p className="max-w-md text-muted-foreground">
                O Dashboard exibe dados exclusivamente das ordens de serviço que você importar.
                Importe uma planilha para começar a visualizar métricas e gráficos.
              </p>
            </div>
            {onNavigateToImport && (
              <Button
                onClick={onNavigateToImport}
                className="mt-4 bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all"
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
            icon={<FileText className="text-muted-foreground" />}
          />
          <StatsCard
            title="Taxa de Conclusão"
            value="0%"
            description="0 em andamento"
            icon={<CheckCircle className="text-muted-foreground" />}
          />
          <StatsCard
            title="Ordens Abertas"
            value="0"
            description="0 vencendo em 7 dias"
            icon={<Wrench className="text-muted-foreground" />}
          />
          <StatsCard
            title="Atrasadas"
            value="0"
            description="Nenhuma atrasada"
            icon={<AlertTriangle className="text-muted-foreground" />}
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            {stats.total} O.S importadas • {contratos.length} contrato(s)
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de O.S"
          value={stats.total.toString()}
          description={`${stats.concluidas} concluídas`}
          icon={<FileText className="text-blue-500" />}
          accentColor="#3b82f6"
        />
        <StatsCard
          title="Taxa de Conclusão"
          value={`${stats.taxaConclusao}%`}
          description={`${stats.abertas} em andamento`}
          icon={<CheckCircle className="text-primary" />}
          accentColor={CHART_THEME.chart1}
        />
        <StatsCard
          title="Ordens Abertas"
          value={stats.abertas.toString()}
          description={`${stats.urgentes} vencendo em 7 dias`}
          icon={<Wrench className="text-amber-500" />}
          accentColor="#f59e0b"
        />
        <StatsCard
          title="Atrasadas"
          value={stats.atrasadas.toString()}
          description={stats.atrasadas > 0 ? "Requer atenção imediata" : "Nenhuma atrasada"}
          icon={<AlertTriangle className="text-destructive" />}
          highlight={stats.atrasadas > 0}
          accentColor={CHART_THEME.danger}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">O.S por Mês</CardTitle>
            <CardDescription className="text-muted-foreground">Concluídas vs Pendentes (Últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_THEME.grid} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: CHART_THEME.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: CHART_THEME.muted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: CHART_THEME.card,
                      borderRadius: '12px',
                      border: `1px solid ${CHART_THEME.border}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="Concluídas" fill={CHART_THEME.chart1} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Pendentes" fill={CHART_THEME.warning} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Dados insuficientes para o gráfico</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Status das O.S</CardTitle>
            <CardDescription className="text-muted-foreground">Distribuição atual por situação</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} O.S`, '']}
                      contentStyle={{
                        backgroundColor: CHART_THEME.card,
                        borderRadius: '12px',
                        border: `1px solid ${CHART_THEME.border}`
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => <span style={{ color: CHART_THEME.muted, fontSize: '12px' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-foreground">{totalPie}</span>
                  <span className="text-xs uppercase font-semibold text-muted-foreground">Total</span>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Clock size={48} className="mx-auto mb-2 opacity-50" />
                <p>Sem dados para exibir</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Urgent Tasks */}
      <Card className="bg-card border border-border rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Tarefas Urgentes</CardTitle>
          <CardDescription className="text-muted-foreground">O.S vencendo nos próximos 7 dias ou atrasadas</CardDescription>
        </CardHeader>
        <CardContent>
          {tarefasUrgentes.length > 0 ? (
            <div className="space-y-3">
              {tarefasUrgentes.map((os) => {
                const vencInfo = formatVencimento(os.vencimento);
                const isAtrasada = vencInfo.texto.includes('Atrasada');

                return (
                  <div
                    key={os.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 border ${isAtrasada
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-amber-500/5 border-amber-500/20'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2.5 rounded-lg ${isAtrasada ? 'bg-destructive/15 text-destructive' : 'bg-amber-500/15 text-amber-500'
                          }`}
                      >
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">O.S {os.os} - {os.prefixo || 'Sem prefixo'}</h4>
                        <p className="text-sm text-muted-foreground">{os.agencia || 'Sem agência'} • {os.contrato || 'Sem contrato'}</p>
                        <p className={`text-xs font-medium mt-1 ${isAtrasada ? 'text-destructive' : 'text-amber-500'}`}>{vencInfo.texto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full ${os.situacao === 'Com Dificuldade' ? 'bg-destructive/15 text-destructive' :
                          os.situacao === 'Em Orçamento' ? 'bg-cyan-500/15 text-cyan-500' :
                            os.situacao === 'Em Elaboração' ? 'bg-amber-500/15 text-amber-500' :
                              'bg-blue-500/15 text-blue-500'
                          }`}
                      >
                        {os.situacao}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="p-4 rounded-full mx-auto w-fit mb-3 bg-accent">
                <CheckCircle size={32} className="text-primary" />
              </div>
              <p className="font-medium text-foreground">Nenhuma tarefa urgente</p>
              <p className="text-sm">Todas as O.S estão dentro do prazo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, description, icon, highlight = false, accentColor }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
  accentColor?: string;
}) {
  return (
    <Card
      className={`
        bg-card border border-border rounded-xl shadow-sm transition-all duration-200 
        hover:shadow-lg hover:-translate-y-0.5
        ${highlight ? 'bg-destructive/5 border-destructive/20' : ''}
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className="p-2 rounded-lg"
            style={{
              background: accentColor ? `${accentColor}15` : '#f3f4f6' // Fallback to muted
            }}
          >
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-2xl font-bold ${highlight ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
