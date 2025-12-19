import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Search, Plus, Filter, AlertCircle, CheckCircle2, Clock, ArrowRight, Building2, Calendar, FileSpreadsheet, Inbox, X } from 'lucide-react';
import { WorkOrderDetails } from './WorkOrderDetails';
import { UserRole, OrdemServico, USERS, TECNICOS, OSStatus } from '../lib/types';
import { useOSStore, getContratos } from '../lib/store';
import { useToast } from '../hooks/use-toast';

interface WorkOrdersProps {
  userRole?: UserRole;
  currentUser?: typeof USERS[0];
  onNavigateToImport?: () => void;
}

interface NovaOSForm {
  os: string;
  prefixo: string;
  agencia: string;
  contrato: string;
  vencimento: string;
  tecnicoId: string;
  elaboradorId: string;
}

const initialFormState: NovaOSForm = {
  os: '',
  prefixo: '',
  agencia: '',
  contrato: '',
  vencimento: '',
  tecnicoId: '',
  elaboradorId: ''
};

export function WorkOrders({ userRole = 'manager', currentUser, onNavigateToImport }: WorkOrdersProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContrato, setSelectedContrato] = useState<string>('all');
  const [showNovaOS, setShowNovaOS] = useState(false);
  const [novaOSForm, setNovaOSForm] = useState<NovaOSForm>(initialFormState);
  
  const ordensServico = useOSStore((state) => state.ordensServico);
  const addOrdensServico = useOSStore((state) => state.addOrdensServico);
  const contratos = getContratos();
  const { toast } = useToast();

  const elaboradores = USERS.filter(u => u.role === 'elaborador');

  const handleNovaOS = () => {
    if (!novaOSForm.os || !novaOSForm.agencia || !novaOSForm.contrato) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha ao menos O.S, Agência e Contrato.",
        variant: "destructive"
      });
      return;
    }

    const tecnico = TECNICOS.find(t => t.id === novaOSForm.tecnicoId);
    const elaborador = USERS.find(u => u.id === novaOSForm.elaboradorId);

    const novaOS: OrdemServico = {
      id: Date.now().toString(),
      os: novaOSForm.os,
      prefixo: novaOSForm.prefixo,
      agencia: novaOSForm.agencia,
      contrato: novaOSForm.contrato,
      vencimento: novaOSForm.vencimento,
      situacao: 'Fornecedor Acionado',
      elaborador: elaborador?.name || null,
      elaboradorId: novaOSForm.elaboradorId || null,
      tecnico: tecnico?.nome || null,
      tecnicoId: novaOSForm.tecnicoId || null,
      agendamento: null,
      dataLevantamento: null,
      valorLevantamento: null,
      valorOrcado: null,
      valorAprovado: null,
      dataAprovacao: null,
      aprovadoPor: null,
      anexos: [],
      dificuldades: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    addOrdensServico([novaOS]);
    setNovaOSForm(initialFormState);
    setShowNovaOS(false);
    toast({
      title: "O.S criada",
      description: `A ordem de serviço ${novaOS.os} foi criada com sucesso.`
    });
  };

  const getStats = () => {
    const total = ordensServico.length;
    const emLevantamento = ordensServico.filter(os => os.situacao === 'Em Levantamento').length;
    const emOrcamento = ordensServico.filter(os => os.situacao === 'Em Orçamento').length;
    const concluidas = ordensServico.filter(os => os.situacao === 'Concluída').length;
    const fornecedorAcionado = ordensServico.filter(os => os.situacao === 'Fornecedor Acionado').length;
    
    return { total, emLevantamento, emOrcamento, concluidas, fornecedorAcionado };
  };

  const stats = getStats();

  const getFilteredOrders = () => {
    let filtered = ordensServico;

    if (userRole === 'elaborador' && currentUser) {
      filtered = filtered.filter(os => 
        os.elaboradorId === currentUser.id || os.elaborador === currentUser.name
      );
    }

    if (userRole === 'contract_admin') {
      if (selectedContrato && selectedContrato !== 'all') {
        filtered = filtered.filter(os => os.contrato === selectedContrato);
      }
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(os =>
        os.os.toLowerCase().includes(lowerSearch) ||
        os.agencia.toLowerCase().includes(lowerSearch) ||
        os.contrato.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  };

  const displayedOrders = getFilteredOrders();

  const getTitle = () => {
    switch (userRole) {
      case 'manager': return 'Todas as O.S';
      case 'elaborador': return 'Minhas O.S';
      case 'contract_admin': return 'O.S por Contrato';
      default: return 'Ordens de Serviço';
    }
  };

  const getSubtitle = () => {
    switch (userRole) {
      case 'manager': return 'Gestão completa das Ordens de Serviço por Contrato e Agência.';
      case 'elaborador': return 'Lista de OS onde você atua como Elaborador responsável.';
      case 'contract_admin': return 'Filtre por contrato para preencher valores aprovados.';
      default: return '';
    }
  };

  if (ordensServico.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{getTitle()}</h2>
            <p className="text-slate-500">{getSubtitle()}</p>
          </div>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-slate-100 rounded-full">
              <Inbox className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-slate-700">Nenhuma O.S cadastrada</h3>
              <p className="text-sm text-slate-500 max-w-md">
                {userRole === 'manager' 
                  ? 'Importe uma planilha de O.S para começar a gestão.'
                  : 'Aguarde a importação de O.S pelo gerente.'
                }
              </p>
            </div>
            {userRole === 'manager' && onNavigateToImport && (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 mt-4"
                onClick={onNavigateToImport}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Ir para Importação
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{getTitle()}</h2>
          <p className="text-slate-500">{getSubtitle()}</p>
        </div>
        {userRole === 'manager' && (
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowNovaOS(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova OS
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          title="Fornecedor Acionado" 
          value={stats.fornecedorAcionado} 
          color="bg-blue-50" 
          icon={<Clock className="text-blue-500" />} 
        />
        <StatusCard 
          title="Em Levantamento" 
          value={stats.emLevantamento} 
          color="bg-amber-50" 
          icon={<CheckCircle2 className="text-amber-500" />} 
        />
        <StatusCard 
          title="Em Orçamento" 
          value={stats.emOrcamento} 
          color="bg-purple-50" 
          icon={<Clock className="text-purple-500" />} 
        />
        <StatusCard 
          title="Concluídas" 
          value={stats.concluidas} 
          color="bg-emerald-50" 
          icon={<CheckCircle2 className="text-emerald-500" />} 
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-lg font-medium">
              Ordens de Serviço ({displayedOrders.length})
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {userRole === 'contract_admin' && contratos.length > 0 && (
                <Select value={selectedContrato} onValueChange={setSelectedContrato}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filtrar por contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os contratos</SelectItem>
                    {contratos.map(contrato => (
                      <SelectItem key={contrato} value={contrato}>{contrato}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar OS, Agência..."
                  className="pl-9 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Em Aberto</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <OrdersTable 
                data={displayedOrders} 
                onSelect={setSelectedOrderId} 
                userRole={userRole}
              />
            </TabsContent>
            <TabsContent value="active">
              <OrdersTable 
                data={displayedOrders.filter(o => o.situacao !== 'Concluída')} 
                onSelect={setSelectedOrderId}
                userRole={userRole}
              />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersTable 
                data={displayedOrders.filter(o => o.situacao === 'Concluída')} 
                onSelect={setSelectedOrderId}
                userRole={userRole}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedOrderId && (
        <WorkOrderDetails 
          orderId={selectedOrderId} 
          userRole={userRole}
          currentUser={currentUser}
          onClose={() => setSelectedOrderId(null)} 
        />
      )}

      {showNovaOS && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Nova Ordem de Serviço</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNovaOS(false)}>
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número da O.S *</Label>
                  <Input 
                    placeholder="Ex: 12345"
                    value={novaOSForm.os}
                    onChange={(e) => setNovaOSForm(prev => ({ ...prev, os: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prefixo</Label>
                  <Input 
                    placeholder="Ex: 9794"
                    value={novaOSForm.prefixo}
                    onChange={(e) => setNovaOSForm(prev => ({ ...prev, prefixo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Agência *</Label>
                <Input 
                  placeholder="Nome da agência ou local"
                  value={novaOSForm.agencia}
                  onChange={(e) => setNovaOSForm(prev => ({ ...prev, agencia: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Contrato *</Label>
                <Input 
                  placeholder="Nome do contrato"
                  value={novaOSForm.contrato}
                  onChange={(e) => setNovaOSForm(prev => ({ ...prev, contrato: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input 
                  type="date"
                  value={novaOSForm.vencimento}
                  onChange={(e) => setNovaOSForm(prev => ({ ...prev, vencimento: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Técnico</Label>
                  <Select 
                    value={novaOSForm.tecnicoId || '__none__'} 
                    onValueChange={(v) => setNovaOSForm(prev => ({ ...prev, tecnicoId: v === '__none__' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Não definido</SelectItem>
                      {TECNICOS.map(tec => (
                        <SelectItem key={tec.id} value={tec.id}>{tec.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Elaborador</Label>
                  <Select 
                    value={novaOSForm.elaboradorId || '__none__'} 
                    onValueChange={(v) => setNovaOSForm(prev => ({ ...prev, elaboradorId: v === '__none__' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Não definido</SelectItem>
                      {elaboradores.map(elab => (
                        <SelectItem key={elab.id} value={elab.id}>{elab.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNovaOS(false)}>
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNovaOS}>
                  <Plus className="mr-2 h-4 w-4" /> Criar O.S
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function OrdersTable({ data, onSelect, userRole }: { data: OrdemServico[], onSelect: (id: string) => void, userRole?: UserRole }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">OS</TableHead>
          <TableHead>Agência / Prefixo</TableHead>
          <TableHead>Contrato</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Responsáveis</TableHead>
          <TableHead>Situação</TableHead>
          {userRole === 'contract_admin' && <TableHead>Valor</TableHead>}
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow 
            key={order.id} 
            className="cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => onSelect(order.id)}
          >
            <TableCell className="font-medium text-emerald-700">{order.os}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{order.agencia}</span>
                {order.prefixo && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 size={10} /> {order.prefixo}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-slate-600">{order.contrato}</TableCell>
            <TableCell>
              {order.vencimento ? (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-400" />
                  {order.vencimento}
                </div>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-xs">
                <span><span className="text-slate-500">Téc:</span> {order.tecnico || '-'}</span>
                <span><span className="text-slate-500">Elab:</span> {order.elaborador || '-'}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={order.situacao} />
            </TableCell>
            {userRole === 'contract_admin' && (
              <TableCell>
                {order.valorAprovado ? (
                  <span className="font-medium text-emerald-600">
                    R$ {order.valorAprovado.toLocaleString('pt-BR')}
                  </span>
                ) : order.valorOrcado ? (
                  <span className="text-slate-500">
                    R$ {order.valorOrcado.toLocaleString('pt-BR')}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
            )}
            <TableCell className="text-right">
               <Button variant="ghost" size="icon">
                 <ArrowRight size={16} className="text-slate-400" />
               </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function StatusBadge({ status }: { status: string }) {
   const styles: Record<string, string> = {
    'Fornecedor Acionado': "bg-blue-100 text-blue-700 border-blue-200",
    'Em Levantamento': "bg-amber-100 text-amber-700 border-amber-200",
    'Em Elaboração': "bg-orange-100 text-orange-700 border-orange-200",
    'Em Orçamento': "bg-purple-100 text-purple-700 border-purple-200",
    'Concluída': "bg-emerald-100 text-emerald-700 border-emerald-200",
    'Com Dificuldade': "bg-red-100 text-red-700 border-red-200",
    'Mudança de Contrato': "bg-pink-100 text-pink-700 border-pink-200"
  };
  
  const style = styles[status] || "bg-slate-100 text-slate-700";

  return (
    <Badge variant="outline" className={`${style} whitespace-nowrap`}>
      {status}
    </Badge>
  );
}

function StatusCard({ title, value, color, icon }: any) {
  return (
    <div className={`p-4 rounded-lg border ${color} border-opacity-50 flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {icon}
      </div>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  )
}
