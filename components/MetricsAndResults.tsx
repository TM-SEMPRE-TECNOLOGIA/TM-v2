import React from 'react';
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
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Calendar, Wrench, ListTodo, FileText } from 'lucide-react';

// Dados Mockados para os Gráficos Solicitados

// 1. Produtividade por Técnico (Concluídas vs Pendentes)
const technicianProductivityData = [
  { name: 'João S.', completed: 42, pending: 8 },
  { name: 'Pedro S.', completed: 35, pending: 15 },
  { name: 'Carlos O.', completed: 50, pending: 4 },
  { name: 'Marcos S.', completed: 28, pending: 12 },
  { name: 'Ricardo L.', completed: 45, pending: 6 },
];

// 2. Produtividade por Elaborador (Relatórios Entregues vs Atrasados)
const elaboratorProductivityData = [
  { name: 'Danilo Costa', delivered: 145, late: 3 },
  { name: 'Paulo Silva', delivered: 58, late: 0 },
  { name: 'Engenharia', delivered: 32, late: 8 },
  { name: 'Consultoria Externa', delivered: 15, late: 1 },
];

// 3. Produtividade/Volume por Contrato
const contractVolumeData = [
  { name: 'Manutenção Predial 23/24', value: 185, color: '#0ea5e9' }, // sky-500
  { name: 'Climatização - Zona Sul', value: 94, color: '#8b5cf6' },   // violet-500
  { name: 'Elétrica Global - SP', value: 65, color: '#f59e0b' },      // amber-500
  { name: 'Hidráulica - Matriz', value: 42, color: '#10b981' },       // emerald-500
];

// Dados específicos para o dashboard do Danilo (Técnico)
const myTasksData = [
  { name: 'Seg', tasks: 4 },
  { name: 'Ter', tasks: 6 },
  { name: 'Qua', tasks: 3 },
  { name: 'Qui', tasks: 5 },
  { name: 'Sex', tasks: 4 },
];

import { UserRole } from '../lib/types';

interface MetricsProps {
  userRole?: UserRole;
}

export function MetricsAndResults({ userRole = 'manager' }: MetricsProps) {
  
  // =================================================================================
  // VISÃO DO TÉCNICO (DANILO)
  // =================================================================================
  if (userRole === 'technician') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
         <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Meu Painel</h2>
          <p className="text-slate-500">Resumo das suas atividades e desempenho pessoal.</p>
        </div>
        <div className="flex gap-2">
           <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Semana Atual
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Minhas Pendências" 
          value="5" 
          description="2 Alta Prioridade"
          icon={<ListTodo className="text-blue-500" />}
        />
        <StatsCard 
          title="Concluídas (Mês)" 
          value="24" 
          description="Meta: 30"
          icon={<CheckCircle className="text-emerald-500" />}
        />
        <StatsCard 
          title="Aderência ao Prazo" 
          value="92%" 
          description="Excelente"
          icon={<TrendingUp className="text-amber-500" />}
        />
         <StatsCard 
          title="Horas Trabalhadas" 
          value="38h" 
          description="Esta semana"
          icon={<Clock className="text-indigo-500" />}
        />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Minhas Tarefas (Semana)</CardTitle>
              <CardDescription>Volume de trabalho diário</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={myTasksData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}/>
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tarefas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

           <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Próximas Atividades</CardTitle>
              <CardDescription>O que vem por aí hoje e amanhã</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="bg-emerald-100 p-2 rounded text-emerald-600 mr-3">
                    <Wrench size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Manutenção Preventiva - Compressor</h4>
                    <p className="text-xs text-slate-500">Hoje, 14:00</p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 border rounded text-slate-600">Alta</span>
                </div>
                 <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3">
                    <ListTodo size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Checklist Diário - Empilhadeiras</h4>
                    <p className="text-xs text-slate-500">Amanhã, 08:00</p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 border rounded text-slate-600">Normal</span>
                </div>
                 <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="bg-amber-100 p-2 rounded text-amber-600 mr-3">
                    <Wrench size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Troca de Rolamentos - Esteira</h4>
                    <p className="text-xs text-slate-500">Amanhã, 10:30</p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 border rounded text-slate-600">Média</span>
                </div>
              </div>
            </CardContent>
          </Card>
       </div>

      </div>
    )
  }

  // =================================================================================
  // VISÃO DO GERENTE (PAULO)
  // =================================================================================
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Gerencial</h2>
          <p className="text-slate-500">Visão consolidada de produtividade, contratos e equipe.</p>
        </div>
        <div className="flex gap-2">
           <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Últimos 30 dias
           </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total OS no Período" 
          value="386" 
          description="+12% vs mês anterior"
          icon={<FileText className="text-blue-500" />}
        />
        <StatsCard 
          title="Conclusão Média" 
          value="94%" 
          description="SLA de Atendimento"
          icon={<CheckCircle className="text-emerald-500" />}
        />
        <StatsCard 
          title="Custo Total Aprovado" 
          value="R$ 42.5k" 
          description="Acumulado do mês"
          icon={<TrendingUp className="text-amber-500" />}
        />
        <StatsCard 
          title="Técnicos Ativos" 
          value="12" 
          description="2 em Férias"
          icon={<Wrench className="text-indigo-500" />}
        />
      </div>

      {/* Linha 1: Técnicos e Contratos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Produtividade por Técnico */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Produtividade da Equipe Técnica</CardTitle>
            <CardDescription>OS Concluídas vs Pendentes por Técnico</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={technicianProductivityData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[0, 4, 4, 0]} name="Concluídas" barSize={12} stackId="a" />
                <Bar dataKey="pending" fill="#cbd5e1" radius={[0, 4, 4, 0]} name="Pendentes" barSize={12} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 2: Volume por Contrato */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Volume por Contrato</CardTitle>
            <CardDescription>Distribuição de OS por Centro de Custo</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractVolumeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {contractVolumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       {/* Linha 2: Produtividade Elaborador */}
       <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho dos Elaboradores</CardTitle>
            <CardDescription>Relatórios Entregues vs Atrasados (Prazo de 15 dias)</CardDescription>
          </CardHeader>
           <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={elaboratorProductivityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Relatórios Entregues" barSize={40} />
                <Bar dataKey="late" fill="#ef4444" radius={[4, 4, 0, 0]} name="Com Atraso" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
