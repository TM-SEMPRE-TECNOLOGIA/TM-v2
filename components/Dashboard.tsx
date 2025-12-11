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
  Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';

const data = [
  { name: 'Jan', Preventive: 40, Corrective: 24 },
  { name: 'Feb', Preventive: 30, Corrective: 13 },
  { name: 'Mar', Preventive: 20, Corrective: 58 },
  { name: 'Apr', Preventive: 27, Corrective: 39 },
  { name: 'May', Preventive: 18, Corrective: 48 },
  { name: 'Jun', Preventive: 23, Corrective: 38 },
];

const pieData = [
  { name: 'Em Dia', value: 400, color: '#10b981' },
  { name: 'Atrasado', value: 30, color: '#ef4444' },
  { name: 'Pendente', value: 300, color: '#f59e0b' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total de Ativos" 
          value="1,234" 
          description="+4 novos este mês"
          icon={<HardDriveIcon className="text-blue-500" />}
        />
        <StatsCard 
          title="Preventivas em Dia" 
          value="94.2%" 
          description="+2.1% desde o último mês"
          icon={<CheckCircle className="text-emerald-500" />}
        />
        <StatsCard 
          title="Ordens Abertas" 
          value="23" 
          description="5 urgentes"
          icon={<Wrench className="text-amber-500" />}
        />
        <StatsCard 
          title="Atrasadas" 
          value="7" 
          description="Requer atenção imediata"
          icon={<AlertTriangle className="text-red-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Histórico de Manutenção</CardTitle>
            <CardDescription>Preventiva vs Corretiva (Últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="Preventive" fill="#10b981" radius={[4, 4, 0, 0]} name="Preventiva" />
                <Bar dataKey="Corrective" fill="#ef4444" radius={[4, 4, 0, 0]} name="Corretiva" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status das Preventivas</CardTitle>
            <CardDescription>Distribuição atual de tarefas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">730</span>
              <span className="text-xs text-slate-500 uppercase font-semibold">Total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Urgent Tasks List could go here */}
      <Card>
        <CardHeader>
          <CardTitle>Tarefas Urgentes</CardTitle>
          <CardDescription>Manutenções preventivas vencendo esta semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 text-red-600 rounded-md">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Troca de Filtro de Óleo - Compressor #0{i}</h4>
                    <p className="text-sm text-slate-500">Setor de Usinagem • Vence em 2 dias</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Ver Detalhes</button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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

function HardDriveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" x2="6.01" y1="16" y2="16" />
      <line x1="10" x2="10.01" y1="16" y2="16" />
    </svg>
  );
}
