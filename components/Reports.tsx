import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { 
  FileDown, 
  FileText, 
  Filter,
  Inbox,
  FileSpreadsheet,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import { useOSStore, getContratos } from '../lib/store';
import { TECNICOS, USERS, OSStatus } from '../lib/types';
import { useToast } from '../hooks/use-toast';
import { format, parseISO } from 'date-fns';

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
  destructive: '#ef4444',
};

export function Reports() {
  const ordensServico = useOSStore((state) => state.ordensServico);
  const contratos = getContratos();
  const { toast } = useToast();

  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterContract, setFilterContract] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTechnician, setFilterTechnician] = useState('all');
  const [filterElaborador, setFilterElaborador] = useState('all');

  const elaboradores = USERS.filter(u => u.role === 'elaborador');

  const filteredData = useMemo(() => {
    return ordensServico.filter(os => {
      const matchContract = filterContract === 'all' || os.contrato === filterContract;
      const matchStatus = filterStatus === 'all' || os.situacao === filterStatus;
      const matchTechnician = filterTechnician === 'all' || os.tecnicoId === filterTechnician || os.tecnico === TECNICOS.find(t => t.id === filterTechnician)?.nome;
      const matchElaborador = filterElaborador === 'all' || os.elaboradorId === filterElaborador || os.elaborador === USERS.find(u => u.id === filterElaborador)?.name;
      
      let matchDate = true;
      if (filterDateStart && os.vencimento) {
        matchDate = matchDate && os.vencimento >= filterDateStart;
      }
      if (filterDateEnd && os.vencimento) {
        matchDate = matchDate && os.vencimento <= filterDateEnd;
      }

      return matchContract && matchStatus && matchTechnician && matchElaborador && matchDate;
    });
  }, [ordensServico, filterContract, filterStatus, filterTechnician, filterElaborador, filterDateStart, filterDateEnd]);

  const totalAprovado = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.valorAprovado || 0), 0);
  }, [filteredData]);

  const totalOrcado = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.valorOrcado || 0), 0);
  }, [filteredData]);

  const handleExportCSV = () => {
    const headers = ["OS", "Agência", "Prefixo", "Contrato", "Vencimento", "Técnico", "Elaborador", "Situação", "Valor Orçado", "Valor Aprovado"];
    const rows = filteredData.map(os => [
      os.os,
      os.agencia,
      os.prefixo,
      os.contrato,
      os.vencimento || '',
      os.tecnico || '',
      os.elaborador || '',
      os.situacao,
      os.valorOrcado ? os.valorOrcado.toFixed(2).replace('.', ',') : '',
      os.valorAprovado ? os.valorAprovado.toFixed(2).replace('.', ',') : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_os_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: `Relatório com ${filteredData.length} registros exportado com sucesso.`
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const statusOptions: OSStatus[] = [
    'Fornecedor Acionado',
    'Em Levantamento',
    'Em Elaboração',
    'Em Orçamento',
    'Concluída',
    'Com Dificuldade',
    'Mudança de Contrato'
  ];

  const getStatusStyle = (situacao: string) => {
    const styles: Record<string, string> = {
      'Concluída': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Com Dificuldade': 'bg-red-50 text-red-700 border-red-200',
      'Em Orçamento': 'bg-purple-50 text-purple-700 border-purple-200',
      'Em Levantamento': 'bg-amber-50 text-amber-700 border-amber-200',
      'Em Elaboração': 'bg-orange-50 text-orange-700 border-orange-200',
      'Fornecedor Acionado': 'bg-blue-50 text-blue-700 border-blue-200',
      'Mudança de Contrato': 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return styles[situacao] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  if (ordensServico.length === 0) {
    return (
      <div className="min-h-screen p-6" style={{ background: OB.background }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Relatórios Gerenciais
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Extraia dados detalhados para análise e prestação de contas.
            </p>
          </div>
          <Card className="border-2 border-dashed" style={{ borderColor: OB.border, background: OB.card }}>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 rounded-full" style={{ background: OB.muted }}>
                <Inbox className="h-12 w-12" style={{ color: OB.mutedForeground }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: OB.foreground }}>
                  Nenhuma O.S Importada
                </h3>
                <p style={{ color: OB.mutedForeground }} className="max-w-sm">
                  Importe ordens de serviço para gerar relatórios.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 print:p-0" style={{ background: OB.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Relatórios Gerenciais
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Extraia dados detalhados para análise e prestação de contas.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportPDF} 
              className="gap-2 border-slate-200 hover:bg-slate-50"
            >
              <FileText size={16} /> Exportar PDF
            </Button>
            <Button 
              onClick={handleExportCSV} 
              className="gap-2 text-white"
              style={{ background: OB.primary }}
            >
              <FileDown size={16} /> Baixar CSV
            </Button>
          </div>
        </div>

        <Card className="print:hidden border-0 shadow-md" style={{ background: OB.card }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter size={18} style={{ color: OB.primary }} />
              <CardTitle className="text-sm font-semibold uppercase" style={{ color: OB.mutedForeground }}>
                Filtros de Pesquisa
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Data Início</Label>
                <Input 
                  type="date" 
                  value={filterDateStart} 
                  onChange={(e) => setFilterDateStart(e.target.value)}
                  className="focus:border-emerald-400 focus:ring-emerald-200"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Data Fim</Label>
                <Input 
                  type="date" 
                  value={filterDateEnd} 
                  onChange={(e) => setFilterDateEnd(e.target.value)}
                  className="focus:border-emerald-400 focus:ring-emerald-200"
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Contrato</Label>
                <Select value={filterContract} onValueChange={setFilterContract}>
                  <SelectTrigger className="focus:border-emerald-400 focus:ring-emerald-200">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Contratos</SelectItem>
                    {contratos.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="focus:border-emerald-400 focus:ring-emerald-200">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Técnico</Label>
                <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                  <SelectTrigger className="focus:border-emerald-400 focus:ring-emerald-200">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Técnicos</SelectItem>
                    {TECNICOS.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={{ color: OB.foreground }}>Elaborador</Label>
                <Select value={filterElaborador} onValueChange={setFilterElaborador}>
                  <SelectTrigger className="focus:border-emerald-400 focus:ring-emerald-200">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Elaboradores</SelectItem>
                    {elaboradores.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.accent }}>
                  <ClipboardList size={24} style={{ color: OB.chart1 }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Registros</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{filteredData.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.muted }}>
                  <FileSpreadsheet size={24} style={{ color: OB.mutedForeground }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Total Orçado</p>
                  <h3 className="text-xl font-bold" style={{ color: OB.foreground }}>{formatCurrency(totalOrcado)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.accent }}>
                  <DollarSign size={24} style={{ color: OB.chart1 }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Total Aprovado</p>
                  <h3 className="text-xl font-bold" style={{ color: OB.primary }}>{formatCurrency(totalAprovado)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="print:shadow-none print:border-none border-0 shadow-md" style={{ background: OB.card }}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText size={20} style={{ color: OB.primary }} />
              <div>
                <CardTitle style={{ color: OB.foreground }}>Resultados</CardTitle>
                <CardDescription>
                  Exibindo {filteredData.length} registros encontrados.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-auto max-h-[500px]" style={{ borderColor: OB.border }}>
              <Table>
                <TableHeader className="sticky top-0" style={{ background: OB.muted }}>
                  <TableRow>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>OS</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Agência</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Contrato</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Vencimento</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Técnico</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Elaborador</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Status</TableHead>
                    <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Orçado</TableHead>
                    <TableHead className="text-right font-semibold" style={{ color: OB.foreground }}>Aprovado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={9} className="h-24 text-center" style={{ color: OB.mutedForeground }}>
                         Nenhum registro encontrado com os filtros selecionados.
                       </TableCell>
                     </TableRow>
                  ) : (
                    filteredData.map((os, index) => (
                      <TableRow 
                        key={os.id}
                        className="hover:bg-slate-50"
                        style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                      >
                        <TableCell className="font-medium" style={{ color: OB.primary }}>{os.os}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium" style={{ color: OB.foreground }}>{os.agencia}</span>
                            {os.prefixo && <span className="text-xs block" style={{ color: OB.mutedForeground }}>{os.prefixo}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" style={{ color: OB.mutedForeground }}>{os.contrato}</TableCell>
                        <TableCell style={{ color: OB.foreground }}>{formatDate(os.vencimento)}</TableCell>
                        <TableCell style={{ color: OB.mutedForeground }}>{os.tecnico || '-'}</TableCell>
                        <TableCell style={{ color: OB.mutedForeground }}>{os.elaborador || '-'}</TableCell>
                        <TableCell>
                           <Badge variant="outline" className={getStatusStyle(os.situacao)}>
                             {os.situacao}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ color: OB.mutedForeground }}>
                          {os.valorOrcado ? formatCurrency(os.valorOrcado) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium" style={{ color: OB.primary }}>
                          {os.valorAprovado ? formatCurrency(os.valorAprovado) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
