import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckSquare, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const mockChecklists = [
  { id: 1, title: 'Preventiva de Compressor', items: 12, type: 'Mecânica', tech: 'Danilo' },
  { id: 2, title: 'Inspeção Diária Empilhadeira', items: 8, type: 'Segurança', tech: 'Danilo' },
  { id: 3, title: 'Checklist Quadro Elétrico', items: 15, type: 'Elétrica', tech: 'Pedro' },
  { id: 4, title: 'Lubrificação Torno CNC', items: 5, type: 'Mecânica', tech: 'Danilo' },
];

const mockCalendarEvents = [
  { day: 5, type: 'preventive', title: 'Manutenção Mensal' },
  { day: 12, type: 'corrective', title: 'Reparo Motor' },
  { day: 15, type: 'inspection', title: 'Auditoria ISO' },
  { day: 22, type: 'preventive', title: 'Lubrificação Geral' },
  { day: 28, type: 'meeting', title: 'Reunião Mensal' },
];

interface AgendaProps {
  userRole?: 'manager' | 'technician';
}

export function AgendaAndChecklist({ userRole = 'manager' }: AgendaProps) {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Se técnico, filtra checklists
  const displayedChecklists = userRole === 'technician'
    ? mockChecklists.filter(c => c.tech === 'Danilo')
    : mockChecklists;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Agenda Section */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
               {userRole === 'manager' ? 'Agenda de Manutenção' : 'Minha Agenda'}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">Novembro 2023</span>
               <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="text-xs font-medium text-slate-500 uppercase">Dom</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Seg</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Ter</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Qua</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Qui</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Sex</div>
                <div className="text-xs font-medium text-slate-500 uppercase">Sáb</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                 {/* Empty days for offset */}
                 <div className="h-24 bg-slate-50 rounded-md border border-slate-100"></div>
                 <div className="h-24 bg-slate-50 rounded-md border border-slate-100"></div>
                 
                 {daysInMonth.map((day) => {
                    const events = mockCalendarEvents.filter(e => e.day === day);
                    return (
                      <div key={day} className="h-24 bg-white p-1 rounded-md border border-slate-200 flex flex-col items-start justify-start hover:border-emerald-500 transition-colors cursor-pointer overflow-hidden">
                        <span className={`text-xs font-medium mb-1 ${events.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>{day}</span>
                        {events.map((event, idx) => (
                           <div key={idx} className={`w-full text-[10px] truncate px-1 py-0.5 rounded mb-0.5
                             ${event.type === 'preventive' ? 'bg-emerald-100 text-emerald-700' : ''}
                             ${event.type === 'corrective' ? 'bg-red-100 text-red-700' : ''}
                             ${event.type === 'inspection' ? 'bg-blue-100 text-blue-700' : ''}
                             ${event.type === 'meeting' ? 'bg-purple-100 text-purple-700' : ''}
                           `}>
                             {event.title}
                           </div>
                        ))}
                      </div>
                    );
                 })}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Preventiva</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Corretiva</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Inspeção</div>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="w-full md:w-80 space-y-4">
           <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Checklists</h2>
             <Button variant="ghost" size="sm" className="text-emerald-600">Ver todos</Button>
          </div>

          <div className="space-y-3">
            {displayedChecklists.map((checklist) => (
              <Card key={checklist.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                      <CheckSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm">{checklist.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-5">{checklist.type}</Badge>
                        <span className="text-xs text-slate-500">{checklist.items} itens</span>
                      </div>
                       {userRole === 'manager' && (
                         <div className="mt-2 text-[10px] text-slate-400">Atribuído: {checklist.tech}</div>
                       )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {userRole === 'manager' && (
              <Button className="w-full mt-4" variant="outline">
                <CheckSquare className="mr-2 h-4 w-4" /> Criar Novo Checklist
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
