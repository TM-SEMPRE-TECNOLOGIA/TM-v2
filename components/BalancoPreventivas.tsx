import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2,
  Users,
  FileEdit,
  BarChart3,
  FileDown,
  Wallet
} from 'lucide-react';
import { useOSStore, getContratos } from '../lib/store';
import { USERS, TECNICOS } from '../lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '../hooks/use-toast';

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  primaryLight: '#34d399',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  chart1: '#22c55e',
  chart2: '#10b981',
  chart3: '#059669',
  destructive: '#ef4444',
};

export function BalancoPreventivas() {
  const ordensServico = useOSStore((state) => state.ordensServico);
  const { toast } = useToast();

  const handleExportCSV = (data: any[], filename: string, headers: string[]) => {
    const rows = data.map(item => headers.map(h => {
      const value = item[h.toLowerCase().replace(/ /g, '')];
      if (typeof value === 'number') return value.toFixed(2).replace('.', ',');
      return value || '';
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: `O arquivo ${filename}.csv foi baixado com sucesso.`
    });
  };

  const exportBalancoContrato = () => {
    const headers = ['Contrato', 'Quantidade', 'Aprovadas', 'ValorOrcado', 'ValorAprovado', 'Diferenca'];
    const data = porContrato.map(c => ({
      contrato: c.contrato,
      quantidade: c.quantidade,
      aprovadas: c.aprovadas,
      valororcado: c.valorOrcado,
      valoraprovado: c.valorAprovado,
      diferenca: c.diferenca
    }));
    handleExportCSV(data, 'balanco_contrato', headers);
  };

  const exportBalancoTecnico = () => {
    const headers = ['Tecnico', 'Quantidade', 'Aprovadas', 'ValorOrcado', 'ValorAprovado', 'Diferenca'];
    const data = porTecnico.map(t => ({
      tecnico: t.nome,
      quantidade: t.quantidade,
      aprovadas: t.aprovadas,
      valororcado: t.valorOrcado,
      valoraprovado: t.valorAprovado,
      diferenca: t.diferenca
    }));
    handleExportCSV(data, 'balanco_tecnico', headers);
  };

  const exportBalancoElaborador = () => {
    const headers = ['Elaborador', 'Quantidade', 'Aprovadas', 'ValorOrcado', 'ValorAprovado', 'Diferenca'];
    const data = porElaborador.map(e => ({
      elaborador: e.nome,
      quantidade: e.quantidade,
      aprovadas: e.aprovadas,
      valororcado: e.valorOrcado,
      valoraprovado: e.valorAprovado,
      diferenca: e.diferenca
    }));
    handleExportCSV(data, 'balanco_elaborador', headers);
  };

  const stats = useMemo(() => {
    const osComValor = ordensServico.filter(os => os.valorAprovado !== null);
    const totalAprovado = osComValor.reduce((sum, os) => sum + (os.valorAprovado || 0), 0);
    const totalOrcado = ordensServico.reduce((sum, os) => sum + (os.valorOrcado || 0), 0);
    const diferenca = totalAprovado - totalOrcado;
    const osAprovadas = osComValor.length;
    const osPendentes = ordensServico.filter(os => os.valorAprovado === null && os.valorOrcado !== null).length;

    return {
      totalAprovado,
      totalOrcado,
      diferenca,
      osAprovadas,
      osPendentes,
      totalOS: ordensServico.length
    };
  }, [ordensServico]);

  const porContrato = useMemo(() => {
    const contratos = getContratos();
    return contratos.map(contrato => {
      const osDoContrato = ordensServico.filter(os => os.contrato === contrato);
      const valorAprovado = osDoContrato.reduce((sum, os) => sum + (os.valorAprovado || 0), 0);
      const valorOrcado = osDoContrato.reduce((sum, os) => sum + (os.valorOrcado || 0), 0);
      const diferenca = valorAprovado - valorOrcado;
      const quantidade = osDoContrato.length;
      const aprovadas = osDoContrato.filter(os => os.valorAprovado !== null).length;

      return {
        contrato,
        valorAprovado,
        valorOrcado,
        diferenca,
        quantidade,
        aprovadas
      };
    }).sort((a, b) => b.valorAprovado - a.valorAprovado);
  }, [ordensServico]);

  const porTecnico = useMemo(() => {
    return TECNICOS.map(tecnico => {
      const osDoTecnico = ordensServico.filter(os => 
        os.tecnicoId === tecnico.id || os.tecnico === tecnico.nome
      );
      const valorAprovado = osDoTecnico.reduce((sum, os) => sum + (os.valorAprovado || 0), 0);
      const valorOrcado = osDoTecnico.reduce((sum, os) => sum + (os.valorOrcado || 0), 0);
      const diferenca = valorAprovado - valorOrcado;
      const quantidade = osDoTecnico.length;
      const aprovadas = osDoTecnico.filter(os => os.valorAprovado !== null).length;

      return {
        nome: tecnico.nome,
        initials: tecnico.initials,
        valorAprovado,
        valorOrcado,
        diferenca,
        quantidade,
        aprovadas
      };
    }).filter(t => t.quantidade > 0).sort((a, b) => b.valorAprovado - a.valorAprovado);
  }, [ordensServico]);

  const porElaborador = useMemo(() => {
    const elaboradores = USERS.filter(u => u.role === 'elaborador');
    return elaboradores.map(elab => {
      const osDoElaborador = ordensServico.filter(os => 
        os.elaboradorId === elab.id || os.elaborador === elab.name
      );
      const valorAprovado = osDoElaborador.reduce((sum, os) => sum + (os.valorAprovado || 0), 0);
      const valorOrcado = osDoElaborador.reduce((sum, os) => sum + (os.valorOrcado || 0), 0);
      const diferenca = valorAprovado - valorOrcado;
      const quantidade = osDoElaborador.length;
      const aprovadas = osDoElaborador.filter(os => os.valorAprovado !== null).length;

      return {
        nome: elab.name,
        initials: elab.initials,
        valorAprovado,
        valorOrcado,
        diferenca,
        quantidade,
        aprovadas
      };
    }).filter(e => e.quantidade > 0).sort((a, b) => b.valorAprovado - a.valorAprovado);
  }, [ordensServico]);

  const chartData = porContrato.slice(0, 6).map(c => ({
    name: c.contrato.length > 15 ? c.contrato.substring(0, 15) + '...' : c.contrato,
    aprovado: c.valorAprovado,
    orcado: c.valorOrcado
  }));

  const COLORS = [OB.chart1, OB.chart2, OB.chart3, '#3b82f6', '#8b5cf6', '#f59e0b'];

  const pieData = porContrato.slice(0, 6).map((c, i) => ({
    name: c.contrato.length > 12 ? c.contrato.substring(0, 12) + '...' : c.contrato,
    value: c.valorAprovado,
    fill: COLORS[i % COLORS.length]
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (ordensServico.length === 0) {
    return (
      <div className="min-h-screen p-6" style={{ background: OB.background }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Balanço das Preventivas
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Análise financeira das ordens de serviço por contrato, técnico e elaborador.
            </p>
          </div>
          <Card className="border-2 border-dashed" style={{ borderColor: OB.border, background: OB.card }}>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 rounded-full" style={{ background: OB.muted }}>
                <BarChart3 className="h-12 w-12" style={{ color: OB.mutedForeground }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: OB.foreground }}>
                  Nenhuma O.S Importada
                </h3>
                <p style={{ color: OB.mutedForeground }} className="max-w-sm">
                  Importe ordens de serviço para visualizar o balanço financeiro das preventivas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Balanço das Preventivas
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Análise financeira das ordens de serviço por contrato, técnico e elaborador.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportBalancoContrato} 
              className="gap-2 border-emerald-200 hover:bg-emerald-50"
            >
              <FileDown size={16} style={{ color: OB.primary }} /> Contratos
            </Button>
            <Button 
              variant="outline" 
              onClick={exportBalancoTecnico} 
              className="gap-2 border-emerald-200 hover:bg-emerald-50"
            >
              <FileDown size={16} style={{ color: OB.primary }} /> Técnicos
            </Button>
            <Button 
              variant="outline" 
              onClick={exportBalancoElaborador} 
              className="gap-2 border-emerald-200 hover:bg-emerald-50"
            >
              <FileDown size={16} style={{ color: OB.primary }} /> Elaboradores
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.accent }}>
                  <DollarSign size={24} style={{ color: OB.chart1 }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Total Aprovado</p>
                  <h3 className="text-xl font-bold" style={{ color: OB.primary }}>
                    {formatCurrency(stats.totalAprovado)}
                  </h3>
                  <p className="text-xs" style={{ color: OB.mutedForeground }}>
                    {stats.osAprovadas} O.S aprovadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.secondary }}>
                  <Wallet size={24} className="text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Total Orçado</p>
                  <h3 className="text-xl font-bold" style={{ color: OB.foreground }}>
                    {formatCurrency(stats.totalOrcado)}
                  </h3>
                  <p className="text-xs" style={{ color: OB.mutedForeground }}>
                    {stats.totalOS} O.S no sistema
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl" 
                  style={{ background: stats.diferenca >= 0 ? OB.accent : '#fef2f2' }}
                >
                  {stats.diferenca >= 0 ? (
                    <TrendingUp size={24} style={{ color: OB.chart1 }} />
                  ) : (
                    <TrendingDown size={24} style={{ color: OB.destructive }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Diferença</p>
                  <h3 
                    className="text-xl font-bold" 
                    style={{ color: stats.diferenca >= 0 ? OB.primary : OB.destructive }}
                  >
                    {stats.diferenca >= 0 ? '+' : ''}{formatCurrency(stats.diferenca)}
                  </h3>
                  <p className="text-xs" style={{ color: OB.mutedForeground }}>
                    {stats.diferenca >= 0 ? "Acima do orçado" : "Abaixo do orçado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <FileEdit size={24} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Pendentes</p>
                  <h3 className="text-xl font-bold text-amber-600">{stats.osPendentes}</h3>
                  <p className="text-xs" style={{ color: OB.mutedForeground }}>
                    Aguardando aprovação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 size={20} style={{ color: OB.primary }} />
                  <CardTitle style={{ color: OB.foreground }}>Valores por Contrato</CardTitle>
                </div>
                <CardDescription>Comparativo entre orçado e aprovado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={OB.border} />
                    <XAxis dataKey="name" fontSize={11} tick={{ fill: OB.mutedForeground }} />
                    <YAxis fontSize={11} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} tick={{ fill: OB.mutedForeground }} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)} 
                      contentStyle={{ borderRadius: '8px', border: `1px solid ${OB.border}` }}
                    />
                    <Legend />
                    <Bar dataKey="orcado" name="Orçado" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="aprovado" name="Aprovado" fill={OB.chart1} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} style={{ color: OB.primary }} />
                  <CardTitle style={{ color: OB.foreground }}>Distribuição por Contrato</CardTitle>
                </div>
                <CardDescription>Valores aprovados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)} 
                      contentStyle={{ borderRadius: '8px', border: `1px solid ${OB.border}` }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="contrato" className="w-full">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="contrato" className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Building2 size={16} /> Por Contrato
            </TabsTrigger>
            <TabsTrigger value="tecnico" className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Users size={16} /> Por Técnico
            </TabsTrigger>
            <TabsTrigger value="elaborador" className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <FileEdit size={16} /> Por Elaborador
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contrato">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <CardTitle style={{ color: OB.foreground }}>Balanço por Contrato</CardTitle>
                <CardDescription>Resumo financeiro agrupado por contrato</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: OB.border }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ background: OB.muted }}>
                        <TableHead className="font-semibold" style={{ color: OB.foreground }}>Contrato</TableHead>
                        <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Qtd O.S</TableHead>
                        <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Aprovadas</TableHead>
                        <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Orçado</TableHead>
                        <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Aprovado</TableHead>
                        <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Diferença</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {porContrato.map((item, index) => (
                        <TableRow 
                          key={item.contrato}
                          className="hover:bg-slate-50"
                          style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                        >
                          <TableCell className="font-medium" style={{ color: OB.foreground }}>{item.contrato}</TableCell>
                          <TableCell className="text-center" style={{ color: OB.mutedForeground }}>{item.quantidade}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="text-white" style={{ background: OB.primary }}>
                              {item.aprovadas}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ color: OB.mutedForeground }}>
                            {formatCurrency(item.valorOrcado)}
                          </TableCell>
                          <TableCell className="text-right font-medium" style={{ color: OB.primary }}>
                            {formatCurrency(item.valorAprovado)}
                          </TableCell>
                          <TableCell 
                            className="text-right font-medium"
                            style={{ color: item.diferenca >= 0 ? OB.primary : OB.destructive }}
                          >
                            {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tecnico">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <CardTitle style={{ color: OB.foreground }}>Balanço por Técnico</CardTitle>
                <CardDescription>Resumo financeiro agrupado por técnico executor</CardDescription>
              </CardHeader>
              <CardContent>
                {porTecnico.length === 0 ? (
                  <div className="text-center py-10 rounded-lg" style={{ background: OB.muted, color: OB.mutedForeground }}>
                    Nenhuma O.S atribuída a técnicos ainda.
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: OB.border }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ background: OB.muted }}>
                          <TableHead className="font-semibold" style={{ color: OB.foreground }}>Técnico</TableHead>
                          <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Qtd O.S</TableHead>
                          <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Aprovadas</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Orçado</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Aprovado</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Diferença</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {porTecnico.map((item, index) => (
                          <TableRow 
                            key={item.nome}
                            className="hover:bg-slate-50"
                            style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs"
                                  style={{ background: OB.muted, color: OB.foreground }}
                                >
                                  {item.initials}
                                </div>
                                <span className="font-medium" style={{ color: OB.foreground }}>{item.nome}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center" style={{ color: OB.mutedForeground }}>{item.quantidade}</TableCell>
                            <TableCell className="text-center">
                              <Badge className="text-white" style={{ background: OB.primary }}>
                                {item.aprovadas}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ color: OB.mutedForeground }}>
                              {formatCurrency(item.valorOrcado)}
                            </TableCell>
                            <TableCell className="text-right font-medium" style={{ color: OB.primary }}>
                              {formatCurrency(item.valorAprovado)}
                            </TableCell>
                            <TableCell 
                              className="text-right font-medium"
                              style={{ color: item.diferenca >= 0 ? OB.primary : OB.destructive }}
                            >
                              {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elaborador">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <CardTitle style={{ color: OB.foreground }}>Balanço por Elaborador</CardTitle>
                <CardDescription>Resumo financeiro agrupado por elaborador de relatório</CardDescription>
              </CardHeader>
              <CardContent>
                {porElaborador.length === 0 ? (
                  <div className="text-center py-10 rounded-lg" style={{ background: OB.muted, color: OB.mutedForeground }}>
                    Nenhuma O.S atribuída a elaboradores ainda.
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: OB.border }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ background: OB.muted }}>
                          <TableHead className="font-semibold" style={{ color: OB.foreground }}>Elaborador</TableHead>
                          <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Qtd O.S</TableHead>
                          <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>Aprovadas</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Orçado</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Valor Aprovado</TableHead>
                          <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Diferença</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {porElaborador.map((item, index) => (
                          <TableRow 
                            key={item.nome}
                            className="hover:bg-slate-50"
                            style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs"
                                  style={{ background: OB.secondary, color: '#0284c7' }}
                                >
                                  {item.initials}
                                </div>
                                <span className="font-medium" style={{ color: OB.foreground }}>{item.nome}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center" style={{ color: OB.mutedForeground }}>{item.quantidade}</TableCell>
                            <TableCell className="text-center">
                              <Badge className="text-white" style={{ background: OB.primary }}>
                                {item.aprovadas}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ color: OB.mutedForeground }}>
                              {formatCurrency(item.valorOrcado)}
                            </TableCell>
                            <TableCell className="text-right font-medium" style={{ color: OB.primary }}>
                              {formatCurrency(item.valorAprovado)}
                            </TableCell>
                            <TableCell 
                              className="text-right font-medium"
                              style={{ color: item.diferenca >= 0 ? OB.primary : OB.destructive }}
                            >
                              {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
