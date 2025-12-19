import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2,
  Users,
  FileEdit,
  BarChart3
} from 'lucide-react';
import { useOSStore, getContratos } from '../lib/store';
import { USERS, TECNICOS } from '../lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export function BalancoPreventivas() {
  const ordensServico = useOSStore((state) => state.ordensServico);

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

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'];

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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Balanço das Preventivas</h2>
          <p className="text-slate-500">Análise financeira das ordens de serviço por contrato, técnico e elaborador.</p>
        </div>
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <BarChart3 className="h-16 w-16 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">Nenhuma O.S Importada</h3>
              <p className="text-slate-500 max-w-sm">
                Importe ordens de serviço para visualizar o balanço financeiro das preventivas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Balanço das Preventivas</h2>
        <p className="text-slate-500">Análise financeira das ordens de serviço por contrato, técnico e elaborador.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Aprovado"
          value={formatCurrency(stats.totalAprovado)}
          subtitle={`${stats.osAprovadas} O.S com valor aprovado`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          color="emerald"
        />
        <SummaryCard
          title="Total Orçado"
          value={formatCurrency(stats.totalOrcado)}
          subtitle={`${stats.totalOS} O.S no sistema`}
          icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
          color="blue"
        />
        <SummaryCard
          title="Diferença"
          value={formatCurrency(stats.diferenca)}
          subtitle={stats.diferenca >= 0 ? "Acima do orçado" : "Abaixo do orçado"}
          icon={stats.diferenca >= 0 ? 
            <TrendingUp className="h-5 w-5 text-emerald-600" /> : 
            <TrendingDown className="h-5 w-5 text-red-600" />
          }
          color={stats.diferenca >= 0 ? "emerald" : "red"}
        />
        <SummaryCard
          title="Pendentes Aprovação"
          value={String(stats.osPendentes)}
          subtitle="O.S aguardando valor aprovado"
          icon={<FileEdit className="h-5 w-5 text-amber-600" />}
          color="amber"
        />
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Valores por Contrato</CardTitle>
              <CardDescription>Comparativo entre orçado e aprovado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="orcado" name="Orçado" fill="#94a3b8" />
                  <Bar dataKey="aprovado" name="Aprovado" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribuição por Contrato</CardTitle>
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
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="contrato" className="w-full">
        <TabsList>
          <TabsTrigger value="contrato" className="flex items-center gap-2">
            <Building2 size={16} /> Por Contrato
          </TabsTrigger>
          <TabsTrigger value="tecnico" className="flex items-center gap-2">
            <Users size={16} /> Por Técnico
          </TabsTrigger>
          <TabsTrigger value="elaborador" className="flex items-center gap-2">
            <FileEdit size={16} /> Por Elaborador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contrato">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Balanço por Contrato</CardTitle>
              <CardDescription>Resumo financeiro agrupado por contrato</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead className="text-center">Qtd O.S</TableHead>
                    <TableHead className="text-center">Aprovadas</TableHead>
                    <TableHead className="text-right">Valor Orçado</TableHead>
                    <TableHead className="text-right">Valor Aprovado</TableHead>
                    <TableHead className="text-right">Diferença</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {porContrato.map((item) => (
                    <TableRow key={item.contrato}>
                      <TableCell className="font-medium">{item.contrato}</TableCell>
                      <TableCell className="text-center">{item.quantidade}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {item.aprovadas}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {formatCurrency(item.valorOrcado)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-700">
                        {formatCurrency(item.valorAprovado)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${item.diferenca >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnico">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Balanço por Técnico</CardTitle>
              <CardDescription>Resumo financeiro agrupado por técnico executor</CardDescription>
            </CardHeader>
            <CardContent>
              {porTecnico.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Nenhuma O.S atribuída a técnicos ainda.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Técnico</TableHead>
                      <TableHead className="text-center">Qtd O.S</TableHead>
                      <TableHead className="text-center">Aprovadas</TableHead>
                      <TableHead className="text-right">Valor Orçado</TableHead>
                      <TableHead className="text-right">Valor Aprovado</TableHead>
                      <TableHead className="text-right">Diferença</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {porTecnico.map((item) => (
                      <TableRow key={item.nome}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {item.initials}
                            </div>
                            <span className="font-medium">{item.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantidade}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {item.aprovadas}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-600">
                          {formatCurrency(item.valorOrcado)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-700">
                          {formatCurrency(item.valorAprovado)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${item.diferenca >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elaborador">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Balanço por Elaborador</CardTitle>
              <CardDescription>Resumo financeiro agrupado por elaborador de relatório</CardDescription>
            </CardHeader>
            <CardContent>
              {porElaborador.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Nenhuma O.S atribuída a elaboradores ainda.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Elaborador</TableHead>
                      <TableHead className="text-center">Qtd O.S</TableHead>
                      <TableHead className="text-center">Aprovadas</TableHead>
                      <TableHead className="text-right">Valor Orçado</TableHead>
                      <TableHead className="text-right">Valor Aprovado</TableHead>
                      <TableHead className="text-right">Diferença</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {porElaborador.map((item) => (
                      <TableRow key={item.nome}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {item.initials}
                            </div>
                            <span className="font-medium">{item.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantidade}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {item.aprovadas}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-600">
                          {formatCurrency(item.valorOrcado)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-700">
                          {formatCurrency(item.valorAprovado)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${item.diferenca >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.diferenca >= 0 ? '+' : ''}{formatCurrency(item.diferenca)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  const bgColor = `bg-${color}-50`;
  const borderColor = `border-${color}-100`;

  return (
    <Card className={`${bgColor} border ${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
