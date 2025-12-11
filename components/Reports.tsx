import React, { useState } from 'react';
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
  Search, 
  Calendar as CalendarIcon,
  Download
} from 'lucide-react';

// Dados Mockados para o Relatório
const mockReportsData = [
  { id: 'OS-98234', date: '2023-11-01', agency: 'Agência Central', contract: 'Manutenção Predial', technician: 'Danilo Costa', status: 'Concluída', value: 1250.00 },
  { id: 'OS-98235', date: '2023-11-02', agency: 'Agência Zona Sul', contract: 'Elétrica Global', technician: 'João Silva', status: 'Em Andamento', value: 0 },
  { id: 'OS-98236', date: '2023-11-03', agency: 'Agência Norte', contract: 'Manutenção Predial', technician: 'Pedro Santos', status: 'Atrasada', value: 850.50 },
  { id: 'OS-98237', date: '2023-11-05', agency: 'Agência Leste', contract: 'Climatização', technician: 'Danilo Costa', status: 'Concluída', value: 3200.00 },
  { id: 'OS-98238', date: '2023-11-06', agency: 'Agência Central', contract: 'Manutenção Predial', technician: 'João Silva', status: 'Pendente', value: 0 },
  { id: 'OS-98239', date: '2023-11-07', agency: 'Agência Oeste', contract: 'Elétrica Global', technician: 'Marcos Souza', status: 'Concluída', value: 150.00 },
  { id: 'OS-98240', date: '2023-11-08', agency: 'Agência Campinas', contract: 'Manutenção Predial', technician: 'Danilo Costa', status: 'Em Andamento', value: 0 },
  { id: 'OS-98241', date: '2023-11-09', agency: 'Agência Santos', contract: 'Climatização', technician: 'Pedro Santos', status: 'Concluída', value: 4500.00 },
];

export function Reports() {
  // Estados dos Filtros
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterContract, setFilterContract] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTechnician, setFilterTechnician] = useState('all');

  // Lógica de Filtragem
  const filteredData = mockReportsData.filter(item => {
    const matchContract = filterContract === 'all' || item.contract === filterContract;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchTechnician = filterTechnician === 'all' || item.technician === filterTechnician;
    
    let matchDate = true;
    if (filterDateStart) matchDate = matchDate && item.date >= filterDateStart;
    if (filterDateEnd) matchDate = matchDate && item.date <= filterDateEnd;

    return matchContract && matchStatus && matchTechnician && matchDate;
  });

  // Cálculo de Totais
  const totalValue = filteredData.reduce((acc, curr) => acc + curr.value, 0);
  const totalCount = filteredData.length;

  // Função para exportar CSV
  const handleExportCSV = () => {
    const headers = ["ID OS", "Data", "Agência", "Contrato", "Técnico", "Status", "Valor (R$)"];
    const rows = filteredData.map(item => [
      item.id,
      item.date,
      item.agency,
      item.contract,
      item.technician,
      item.status,
      item.value.toFixed(2).replace('.', ',')
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
  };

  // Simulação de PDF
  const handleExportPDF = () => {
    window.print(); // Usa a função nativa de impressão como "Exportar PDF"
  };

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

      {/* Painel de Filtros */}
      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
            <Filter size={16} /> Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período (De - Até)</Label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={filterDateStart} 
                  onChange={(e) => setFilterDateStart(e.target.value)} 
                />
                <Input 
                  type="date" 
                  value={filterDateEnd} 
                  onChange={(e) => setFilterDateEnd(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contrato</Label>
              <Select value={filterContract} onValueChange={setFilterContract}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Contratos</SelectItem>
                  <SelectItem value="Manutenção Predial">Manutenção Predial</SelectItem>
                  <SelectItem value="Elétrica Global">Elétrica Global</SelectItem>
                  <SelectItem value="Climatização">Climatização</SelectItem>
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
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
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
                  <SelectItem value="Danilo Costa">Danilo Costa</SelectItem>
                  <SelectItem value="João Silva">João Silva</SelectItem>
                  <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
                  <SelectItem value="Marcos Souza">Marcos Souza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Exibindo {totalCount} registros encontrados.
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-500">Valor Total Aprovado</span>
            <h3 className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Agência</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor Aprovado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                       Nenhum registro encontrado com os filtros selecionados.
                     </TableCell>
                   </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-emerald-700">{item.id}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{item.agency}</TableCell>
                      <TableCell className="text-xs text-slate-500">{item.contract}</TableCell>
                      <TableCell>{item.technician}</TableCell>
                      <TableCell>
                         <Badge variant="outline" className={`
                           ${item.status === 'Concluída' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                           ${item.status === 'Atrasada' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                           ${item.status === 'Em Andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                           ${item.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                         `}>
                           {item.status}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.value > 0 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)
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
