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
  Inbox
} from 'lucide-react';
import { useOSStore, getContratos } from '../lib/store';
import { TECNICOS, USERS, OSStatus } from '../lib/types';
import { useToast } from '../hooks/use-toast';
import { format, parseISO } from 'date-fns';

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

  const statusOptions: OSStatus[] = [
    'Fornecedor Acionado',
    'Em Levantamento',
    'Em Elaboração',
    'Em Orçamento',
    'Concluída',
    'Com Dificuldade',
    'Mudança de Contrato'
  ];

  if (ordensServico.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Relatórios Gerenciais</h2>
          <p className="text-slate-500">Extraia dados detalhados para análise e prestação de contas.</p>
        </div>
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Inbox className="h-16 w-16 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">Nenhuma O.S Importada</h3>
              <p className="text-slate-500 max-w-sm">
                Importe ordens de serviço para gerar relatórios.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Relatórios Gerenciais</h2>
          <p className="text-slate-500">Extraia dados detalhados para análise e prestação de contas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <FileText size={16} /> Exportar PDF
          </Button>
          <Button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <FileDown size={16} /> Baixar CSV
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
            <Filter size={16} /> Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input 
                type="date" 
                value={filterDateStart} 
                onChange={(e) => setFilterDateStart(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input 
                type="date" 
                value={filterDateEnd} 
                onChange={(e) => setFilterDateEnd(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label>Contrato</Label>
              <Select value={filterContract} onValueChange={setFilterContract}>
                <SelectTrigger>
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
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
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
              <Label>Técnico</Label>
              <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                <SelectTrigger>
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
              <Label>Elaborador</Label>
              <Select value={filterElaborador} onValueChange={setFilterElaborador}>
                <SelectTrigger>
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

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Exibindo {filteredData.length} registros encontrados.
            </CardDescription>
          </div>
          <div className="text-right flex gap-8">
            <div>
              <span className="text-sm text-slate-500">Total Orçado</span>
              <h3 className="text-xl font-bold text-slate-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOrcado)}
              </h3>
            </div>
            <div>
              <span className="text-sm text-slate-500">Total Aprovado</span>
              <h3 className="text-xl font-bold text-emerald-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAprovado)}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>Agência</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Elaborador</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor Orçado</TableHead>
                  <TableHead className="text-right">Valor Aprovado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                       Nenhum registro encontrado com os filtros selecionados.
                     </TableCell>
                   </TableRow>
                ) : (
                  filteredData.map((os) => (
                    <TableRow key={os.id}>
                      <TableCell className="font-medium text-emerald-700">{os.os}</TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{os.agencia}</span>
                          {os.prefixo && <span className="text-xs text-slate-500 block">{os.prefixo}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-[150px] truncate">{os.contrato}</TableCell>
                      <TableCell>{formatDate(os.vencimento)}</TableCell>
                      <TableCell>{os.tecnico || '-'}</TableCell>
                      <TableCell>{os.elaborador || '-'}</TableCell>
                      <TableCell>
                         <Badge variant="outline" className={`
                           ${os.situacao === 'Concluída' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                           ${os.situacao === 'Com Dificuldade' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                           ${os.situacao === 'Em Orçamento' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                           ${os.situacao === 'Em Levantamento' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                           ${os.situacao === 'Fornecedor Acionado' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                         `}>
                           {os.situacao}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {os.valorOrcado 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorOrcado)
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {os.valorAprovado 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorAprovado)
                          : '-'
                        }
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
  );
}
