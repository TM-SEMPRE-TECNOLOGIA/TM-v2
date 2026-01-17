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

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  cardForeground: '#374151',
  primary: '#22c55e',
  primaryForeground: '#ffffff',
  secondary: '#e0f2fe',
  secondaryForeground: '#4b5563',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  accentForeground: '#374151',
  border: '#e5e7eb',
  ring: '#22c55e',
  chart1: '#22c55e',
  chart2: '#10b981',
  chart3: '#059669',
  destructive: '#ef4444'
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

  const statusCards = [
    {
      title: 'Fornecedor Acionado',
      value: stats.fornecedorAcionado,
      accent: '#3b82f6',
      accentBg: 'rgba(59, 130, 246, 0.12)',
      icon: <Clock className="h-5 w-5" style={{ color: '#3b82f6' }} />
    },
    {
      title: 'Em Levantamento',
      value: stats.emLevantamento,
      accent: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      icon: <CheckCircle2 className="h-5 w-5" style={{ color: '#f59e0b' }} />
    },
    {
      title: 'Em OrÇõamento',
      value: stats.emOrcamento,
      accent: '#8b5cf6',
      accentBg: 'rgba(139, 92, 246, 0.12)',
      icon: <Clock className="h-5 w-5" style={{ color: '#8b5cf6' }} />
    },
    {
      title: 'ConcluÇðdas',
      value: stats.concluidas,
      accent: OB.chart1,
      accentBg: 'rgba(34, 197, 94, 0.12)',
      icon: <CheckCircle2 className="h-5 w-5" style={{ color: OB.chart1 }} />
    }
  ];

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
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>{getTitle()}</h2>
            <p style={{ color: OB.mutedForeground }}>{getSubtitle()}</p>
          </div>
        </div>

        <Card style={{
          background: OB.card,
          border: `2px dashed ${OB.border}`,
          borderRadius: '16px'
        }}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 rounded-full" style={{
              background: `linear-gradient(135deg, ${OB.secondary}, ${OB.accent})`
            }}>
              <Inbox className="h-10 w-10" style={{ color: OB.secondaryForeground }} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg" style={{ color: OB.foreground }}>Nenhuma O.S cadastrada</h3>
              <p className="text-sm max-w-md" style={{ color: OB.mutedForeground }}>
                {userRole === 'manager' 
                  ? 'Importe uma planilha de O.S para começar a gestão.'
                  : 'Aguarde a importação de O.S pelo gerente.'
                }
              </p>
            </div>
            {userRole === 'manager' && onNavigateToImport && (
              <Button 
                className="mt-4"
                style={{
                  background: `linear-gradient(135deg, ${OB.primary}, ${OB.chart2})`,
                  color: OB.primaryForeground,
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: 600
                }}
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
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>{getTitle()}</h2>
          <p style={{ color: OB.mutedForeground }}>{getSubtitle()}</p>
        </div>
        {userRole === 'manager' && (
          <Button
            onClick={() => setShowNovaOS(true)}
            style={{
              background: `linear-gradient(135deg, ${OB.primary}, ${OB.chart2})`,
              color: OB.primaryForeground,
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 600
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova OS
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusCards.map((card) => (
          <StatusCard
            key={card.title}
            title={card.title}
            value={card.value}
            accent={card.accent}
            accentBg={card.accentBg}
            icon={card.icon}
          />
        ))}
      </div>

      <Card style={{
        background: OB.card,
        border: `1px solid ${OB.border}`,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-lg font-medium" style={{ color: OB.foreground }}>
              Ordens de Serviço ({displayedOrders.length})
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {userRole === 'contract_admin' && contratos.length > 0 && (
                <Select value={selectedContrato} onValueChange={setSelectedContrato}>
                  <SelectTrigger className="w-[250px]" style={{ background: OB.background }}>
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
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: OB.mutedForeground }} />
                <Input
                  placeholder="Buscar OS, Agência..."
                  className="pl-9 w-[250px]"
                  style={{ background: OB.background, borderColor: OB.border }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList
              className="mb-4"
              style={{
                background: OB.secondary,
                borderRadius: '999px',
                padding: '4px',
                border: `1px solid ${OB.border}`
              }}
            >
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card
            className="w-full max-w-lg animate-in zoom-in-95 duration-200"
            style={{
              background: OB.card,
              border: `1px solid ${OB.border}`,
              borderRadius: '16px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg" style={{ color: OB.foreground }}>Nova Ordem de Serviço</CardTitle>
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
                <Button
                  onClick={handleNovaOS}
                  style={{
                    background: `linear-gradient(135deg, ${OB.primary}, ${OB.chart2})`,
                    color: OB.primaryForeground,
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontWeight: 600
                  }}
                >
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
      <div className="text-center py-10" style={{ color: OB.mutedForeground }}>
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]" style={{ color: OB.mutedForeground }}>OS</TableHead>
          <TableHead style={{ color: OB.mutedForeground }}>Agência / Prefixo</TableHead>
          <TableHead style={{ color: OB.mutedForeground }}>Contrato</TableHead>
          <TableHead style={{ color: OB.mutedForeground }}>Vencimento</TableHead>
          <TableHead style={{ color: OB.mutedForeground }}>Responsáveis</TableHead>
          <TableHead style={{ color: OB.mutedForeground }}>Situação</TableHead>
          {userRole === 'contract_admin' && <TableHead style={{ color: OB.mutedForeground }}>Valor</TableHead>}
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow 
            key={order.id} 
            className="cursor-pointer hover:bg-emerald-50/50 transition-colors"
            onClick={() => onSelect(order.id)}
          >
            <TableCell className="font-medium" style={{ color: OB.chart2 }}>{order.os}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium" style={{ color: OB.foreground }}>{order.agencia}</span>
                {order.prefixo && (
                  <span className="text-xs flex items-center gap-1" style={{ color: OB.mutedForeground }}>
                    <Building2 size={10} /> {order.prefixo}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm" style={{ color: OB.secondaryForeground }}>{order.contrato}</TableCell>
            <TableCell>
              {order.vencimento ? (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} style={{ color: OB.mutedForeground }} />
                  {order.vencimento}
                </div>
              ) : (
                <span style={{ color: OB.mutedForeground }}>-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-xs">
                <span><span style={{ color: OB.mutedForeground }}>Téc:</span> {order.tecnico || '-'}</span>
                <span><span style={{ color: OB.mutedForeground }}>Elab:</span> {order.elaborador || '-'}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={order.situacao} />
            </TableCell>
            {userRole === 'contract_admin' && (
              <TableCell>
                {order.valorAprovado ? (
                  <span className="font-medium" style={{ color: OB.chart2 }}>
                    R$ {order.valorAprovado.toLocaleString('pt-BR')}
                  </span>
                ) : order.valorOrcado ? (
                  <span style={{ color: OB.mutedForeground }}>
                    R$ {order.valorOrcado.toLocaleString('pt-BR')}
                  </span>
                ) : (
                  <span style={{ color: OB.mutedForeground }}>-</span>
                )}
              </TableCell>
            )}
            <TableCell className="text-right">
               <Button variant="ghost" size="icon">
                 <ArrowRight size={16} style={{ color: OB.mutedForeground }} />
               </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { background: string; color: string; border: string }> = {
    'Fornecedor Acionado': { background: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8', border: 'rgba(59, 130, 246, 0.3)' },
    'Em Levantamento': { background: 'rgba(245, 158, 11, 0.12)', color: '#b45309', border: 'rgba(245, 158, 11, 0.3)' },
    'Em Elabora��ǜo': { background: 'rgba(249, 115, 22, 0.12)', color: '#c2410c', border: 'rgba(249, 115, 22, 0.3)' },
    'Em Or��amento': { background: 'rgba(139, 92, 246, 0.12)', color: '#6d28d9', border: 'rgba(139, 92, 246, 0.3)' },
    'Conclu��da': { background: 'rgba(34, 197, 94, 0.12)', color: OB.chart2, border: 'rgba(34, 197, 94, 0.3)' },
    'Com Dificuldade': { background: 'rgba(239, 68, 68, 0.12)', color: OB.destructive, border: 'rgba(239, 68, 68, 0.3)' },
    'Mudan��a de Contrato': { background: 'rgba(148, 163, 184, 0.2)', color: OB.mutedForeground, border: 'rgba(148, 163, 184, 0.35)' }
  };

  const style = styles[status] || { background: OB.muted, color: OB.mutedForeground, border: OB.border };

  return (
    <Badge
      variant="outline"
      className="whitespace-nowrap"
      style={{ background: style.background, color: style.color, borderColor: style.border }}
    >
      {status}
    </Badge>
  );
}

function StatusCard({ title, value, accent, accentBg, icon }: { title: string; value: number; accent: string; accentBg: string; icon: React.ReactNode }) {
  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${accentBg}, ${OB.card})`,
        border: `1px solid ${OB.border}`,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
      className="hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium" style={{ color: OB.mutedForeground }}>{title}</span>
          <div className="p-2 rounded-lg" style={{ background: accentBg, color: accent }}>
            {icon}
          </div>
        </div>
        <span className="text-2xl font-bold" style={{ color: OB.foreground }}>{value}</span>
      </CardContent>
    </Card>
  )
}
