import React from 'react';
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Plus, Calendar, Clock, ArrowRight } from 'lucide-react';

const mockPlans = [
  {
    id: 'PL-001',
    title: 'Manutenção Mensal - Compressores',
    frequency: 'Mensal',
    equipmentCount: 3,
    estimatedTime: '2h',
    lastExecution: '2023-10-15',
    nextExecution: '2023-11-15',
    status: 'active'
  },
  {
    id: 'PL-002',
    title: 'Lubrificação Geral - Tornos',
    frequency: 'Semanal',
    equipmentCount: 5,
    estimatedTime: '45m',
    lastExecution: '2023-10-25',
    nextExecution: '2023-11-01',
    status: 'active'
  },
  {
    id: 'PL-003',
    title: 'Inspeção Elétrica Trimestral',
    frequency: 'Trimestral',
    equipmentCount: 12,
    estimatedTime: '4h',
    lastExecution: '2023-08-10',
    nextExecution: '2023-11-10',
    status: 'active'
  },
  {
    id: 'PL-004',
    title: 'Troca de Óleo - Geradores',
    frequency: 'Semestral',
    equipmentCount: 2,
    estimatedTime: '3h',
    lastExecution: '2023-05-15',
    nextExecution: '2023-11-15',
    status: 'pending_review'
  }
];

export function PreventiveList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Planos de Manutenção</h2>
          <p className="text-slate-500">Agende e gerencie rotinas preventivas.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Total de Planos</p>
                <h3 className="text-2xl font-bold text-blue-700">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900">Próximos 7 Dias</p>
                <h3 className="text-2xl font-bold text-emerald-700">5</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">Atrasados</p>
                <h3 className="text-2xl font-bold text-amber-700">1</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Ativos</CardTitle>
          <CardDescription>Lista de rotinas de manutenção programadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Equipamentos</TableHead>
                <TableHead>Tempo Est.</TableHead>
                <TableHead>Próxima Exec.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{plan.title}</span>
                      <span className="text-xs text-slate-500">{plan.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.frequency}</Badge>
                  </TableCell>
                  <TableCell>{plan.equipmentCount}</TableCell>
                  <TableCell>{plan.estimatedTime}</TableCell>
                  <TableCell>{new Date(plan.nextExecution).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {plan.status === 'active' ? (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Ativo</Badge>
                    ) : (
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Revisão</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                      Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
