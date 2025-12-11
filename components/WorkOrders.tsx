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
import { Search, Plus, Filter, AlertCircle, CheckCircle2, Clock, ArrowRight, Building2, Calendar } from 'lucide-react';
import { WorkOrderDetails } from './WorkOrderDetails';

// Mock Data atualizado com os novos campos
const mockOrders = [
  {
    id: 'OS-98234',
    prefix: '9794',
    agency: 'Agência Central - SP',
    contract: 'Manutenção Predial 2023/24',
    status: 'Fornecedor Acionado',
    dueDate: '2023-11-15',
    technician: 'Danilo Costa',
    elaborator: 'Danilo Costa',
  },
  {
    id: 'OS-98235',
    prefix: '1020',
    agency: 'Agência Zona Sul',
    contract: 'Climatização - Contrato A',
    status: 'Levantamento OK',
    dueDate: '2023-11-10',
    technician: 'João Silva',
    elaborator: 'Paulo Silva',
  },
  {
    id: 'OS-98236',
    prefix: '3040',
    agency: 'Agência Interior - Campinas',
    contract: 'Manutenção Predial 2023/24',
    status: 'Concluída',
    dueDate: '2023-10-30',
    technician: 'Danilo Costa',
    elaborator: 'Danilo Costa',
  },
   {
    id: 'OS-98237',
    prefix: '9794',
    agency: 'Agência Central - SP',
    contract: 'Elétrica - Emergencial',
    status: 'Enviada para Orçamento',
    dueDate: '2023-11-20',
    technician: 'Pedro Santos',
    elaborator: 'Danilo Costa',
  }
];

interface WorkOrdersProps {
  userRole?: 'manager' | 'technician';
}

export function WorkOrders({ userRole = 'manager' }: WorkOrdersProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros de Role
  // Paulo (Manager): Vê tudo
  // Danilo (Technician): Vê onde ele é Técnico OU Elaborador
  const displayedOrders = mockOrders.filter(order => {
    // Role Filter
    if (userRole === 'technician') {
      const isTech = order.technician === 'Danilo Costa';
      const isElaborator = order.elaborator === 'Danilo Costa';
      if (!isTech && !isElaborator) return false;
    }
    
    // Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(lowerSearch) ||
        order.agency.toLowerCase().includes(lowerSearch) ||
        order.contract.toLowerCase().includes(lowerSearch)
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {userRole === 'manager' ? 'Todas as O.S' : 'Minhas O.S'}
          </h2>
          <p className="text-slate-500">
            {userRole === 'manager' 
              ? 'Gestão completa das Ordens de Serviço por Contrato e Agência.' 
              : 'Lista de OS onde você atua como Técnico ou Elaborador.'}
          </p>
        </div>
        {userRole === 'manager' && (
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" /> Nova OS
          </Button>
        )}
      </div>

      {/* KPI Cards Simplificados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard title="Novas (Fornecedor)" value={displayedOrders.filter(o => o.status === 'Fornecedor Acionado').length} color="bg-blue-50" icon={<Clock className="text-blue-500" />} />
        <StatusCard title="Levantamento OK" value={displayedOrders.filter(o => o.status === 'Levantamento OK').length} color="bg-amber-50" icon={<CheckCircle2 className="text-amber-500" />} />
        <StatusCard title="Em Orçamento" value={displayedOrders.filter(o => o.status === 'Enviada para Orçamento').length} color="bg-purple-50" icon={<Clock className="text-purple-500" />} />
        <StatusCard title="Concluídas" value={displayedOrders.filter(o => o.status === 'Concluída').length} color="bg-emerald-50" icon={<CheckCircle2 className="text-emerald-500" />} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Ordens de Serviço</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar OS, Agência ou Contrato..."
                  className="pl-9 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
              <OrdersTable data={displayedOrders} onSelect={setSelectedOrderId} />
            </TabsContent>
            <TabsContent value="active">
              <OrdersTable data={displayedOrders.filter(o => o.status !== 'Concluída')} onSelect={setSelectedOrderId} />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersTable data={displayedOrders.filter(o => o.status === 'Concluída')} onSelect={setSelectedOrderId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedOrderId && (
        <WorkOrderDetails 
          orderId={selectedOrderId} 
          userRole={userRole}
          onClose={() => setSelectedOrderId(null)} 
        />
      )}
    </div>
  );
}

function OrdersTable({ data, onSelect }: { data: any[], onSelect: (id: string) => void }) {
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
          <TableHead className="w-[120px]">OS</TableHead>
          <TableHead>Agência / Prefixo</TableHead>
          <TableHead>Contrato</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Responsáveis</TableHead>
          <TableHead>Status</TableHead>
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
            <TableCell className="font-medium text-emerald-700">{order.id}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{order.agency}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Building2 size={10} /> {order.prefix}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-sm text-slate-600">{order.contract}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-slate-400" />
                {order.dueDate}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-xs">
                <span><span className="text-slate-500">Tec:</span> {order.technician || '-'}</span>
                <span><span className="text-slate-500">Rel:</span> {order.elaborator || '-'}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
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
   const styles = {
    'Fornecedor Acionado': "bg-blue-100 text-blue-700 border-blue-200",
    'Levantamento OK': "bg-amber-100 text-amber-700 border-amber-200",
    'Enviada para Orçamento': "bg-purple-100 text-purple-700 border-purple-200",
    'Concluída': "bg-emerald-100 text-emerald-700 border-emerald-200",
    'Devolvida': "bg-red-100 text-red-700 border-red-200"
  };
  
  const style = styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700";

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
