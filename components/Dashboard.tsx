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
import { AlertTriangle, CheckCircle, Clock, Wrench, FileText, TrendingUp } from 'lucide-react';
import { useOSStore } from '../lib/store';
import { format, parseISO, isAfter, isBefore, addDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_COLORS: Record<string, string> = {
  'Fornecedor Acionado': '#3b82f6',
  'Em Levantamento': '#8b5cf6',
  'Em Elaboração': '#f59e0b',
  'Em Orçamento': '#06b6d4',
  'Concluída': '#10b981',
  'Com Dificuldade': '#ef4444',
  'Mudança de Contrato': '#6b7280',
};

export function Dashboard() {
  const ordensServico = useOSStore((state) => state.ordensServico);

  const stats = useMemo(() => {
    const hoje = new Date();
    const total = ordensServico.length;
    const concluidas = ordensServico.filter(os => os.situacao === 'Concluída').length;
    const abertas = ordensServico.filter(os => os.situacao !== 'Concluída').length;
    
    const atrasadas = ordensServico.filter(os => {
      if (os.situacao === 'Concluída') return false;
      if (!os.vencimento) return false;
      try {
        const vencimento = parseISO(os.vencimento);
        return isBefore(vencimento, hoje);
      } catch {
        return false;
      }
    }).length;

    const urgentes = ordensServico.filter(os => {
      if (os.situacao === 'Concluída') return false;
      if (!os.vencimento) return false;
      try {
        const vencimento = parseISO(os.vencimento);
        const em7Dias = addDays(hoje, 7);
        return isAfter(vencimento, hoje) && isBefore(vencimento, em7Dias);
      } catch {
        return false;
      }
    }).length;

    const taxaConclusao = total > 0 ? ((concluidas / total) * 100).toFixed(1) : '0';

    return { total, concluidas, abertas, atrasadas, urgentes, taxaConclusao };
  }, [ordensServico]);

  const pieData = useMemo(() => {
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
        if (!os.criadoEm) return false;
        try {
          const data = parseISO(os.criadoEm);
          return isAfter(data, inicioMes) && isBefore(data, fimMes);
        } catch {
          return false;
        }
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
    const hoje = new Date();
    const em7Dias = addDays(hoje, 7);

    return ordensServico
      .filter(os => {
        if (os.situacao === 'Concluída') return false;
        if (!os.vencimento) return false;
        try {
          const vencimento = parseISO(os.vencimento);
          return isBefore(vencimento, em7Dias);
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        const dataA = a.vencimento ? parseISO(a.vencimento).getTime() : 0;
        const dataB = b.vencimento ? parseISO(b.vencimento).getTime() : 0;
        return dataA - dataB;
      })
      .slice(0, 5);
  }, [ordensServico]);

  const formatVencimento = (vencimento: string) => {
    try {
      const data = parseISO(vencimento);
      const hoje = new Date();
      const diffDias = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDias < 0) {
        return { texto: `Atrasada ${Math.abs(diffDias)} dia(s)`, cor: 'text-red-600' };
      } else if (diffDias === 0) {
        return { texto: 'Vence hoje', cor: 'text-red-600' };
      } else if (diffDias === 1) {
        return { texto: 'Vence amanhã', cor: 'text-amber-600' };
      } else {
        return { texto: `Vence em ${diffDias} dias`, cor: 'text-amber-600' };
      }
    } catch {
      return { texto: 'Data inválida', cor: 'text-slate-500' };
    }
  };

  const totalPie = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total de O.S" 
          value={stats.total.toString()} 
          description={`${stats.concluidas} concluídas`}
          icon={<FileText className="text-blue-500" />}
        />
        <StatsCard 
          title="Taxa de Conclusão" 
          value={`${stats.taxaConclusao}%`} 
          description={`${stats.abertas} em andamento`}
          icon={<CheckCircle className="text-emerald-500" />}
        />
        <StatsCard 
          title="Ordens Abertas" 
          value={stats.abertas.toString()} 
          description={`${stats.urgentes} vencendo em 7 dias`}
          icon={<Wrench className="text-amber-500" />}
        />
        <StatsCard 
          title="Atrasadas" 
          value={stats.atrasadas.toString()} 
          description={stats.atrasadas > 0 ? "Requer atenção imediata" : "Nenhuma atrasada"}
          icon={<AlertTriangle className="text-red-500" />}
          highlight={stats.atrasadas > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>O.S por Mês</CardTitle>
            <CardDescription>Concluídas vs Pendentes (Últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {ordensServico.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pendentes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Importe O.S para ver o gráfico</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status das O.S</CardTitle>
            <CardDescription>Distribuição atual por situação</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center relative">
            {ordensServico.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} O.S`, '']} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-800">{totalPie}</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Total</span>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400">
                <Clock size={48} className="mx-auto mb-2 opacity-50" />
                <p>Sem dados para exibir</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Urgentes</CardTitle>
          <CardDescription>O.S vencendo nos próximos 7 dias ou atrasadas</CardDescription>
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
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isAtrasada ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-md ${isAtrasada ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">O.S {os.os} - {os.prefixo}</h4>
                        <p className="text-sm text-slate-500">{os.agencia} • {os.contrato}</p>
                        <p className={`text-xs font-medium mt-1 ${vencInfo.cor}`}>{vencInfo.texto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        os.situacao === 'Com Dificuldade' ? 'bg-red-100 text-red-700' :
                        os.situacao === 'Em Orçamento' ? 'bg-cyan-100 text-cyan-700' :
                        os.situacao === 'Em Elaboração' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {os.situacao}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Nenhuma tarefa urgente</p>
              <p className="text-sm">Todas as O.S estão dentro do prazo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, description, icon, highlight = false }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? 'border-red-200 bg-red-50' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
