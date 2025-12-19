import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UserRole, USERS } from '../lib/types';
import { useOSStore } from '../lib/store';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths, 
  subMonths,
  parseISO,
  getDay,
  isToday,
  isBefore
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaProps {
  userRole?: UserRole;
  currentUser?: typeof USERS[0];
}

export function AgendaAndChecklist({ userRole = 'manager', currentUser }: AgendaProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const ordensServico = useOSStore((state) => state.ordensServico);

  const filteredOS = useMemo(() => {
    if (userRole === 'elaborador' && currentUser) {
      return ordensServico.filter(os => 
        os.elaboradorId === currentUser.id || os.elaborador === currentUser.name
      );
    }
    return ordensServico;
  }, [ordensServico, userRole, currentUser]);

  const osComVencimento = useMemo(() => {
    return filteredOS.filter(os => os.vencimento && os.situacao !== 'Concluída');
  }, [filteredOS]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOffset = useMemo(() => {
    return getDay(startOfMonth(currentMonth));
  }, [currentMonth]);

  const getOSForDay = (day: Date) => {
    return osComVencimento.filter(os => {
      try {
        const vencimento = parseISO(os.vencimento);
        return isSameDay(vencimento, day);
      } catch {
        return false;
      }
    });
  };

  const selectedDayOS = useMemo(() => {
    if (!selectedDate) return [];
    return getOSForDay(selectedDate);
  }, [selectedDate, osComVencimento]);

  const getStatusColor = (situacao: string, vencimento: string) => {
    try {
      const dataVenc = parseISO(vencimento);
      if (isBefore(dataVenc, new Date()) && situacao !== 'Concluída') {
        return 'bg-red-100 text-red-700 border-red-200';
      }
    } catch {}
    
    const colors: Record<string, string> = {
      'Fornecedor Acionado': 'bg-blue-100 text-blue-700',
      'Em Levantamento': 'bg-amber-100 text-amber-700',
      'Em Elaboração': 'bg-orange-100 text-orange-700',
      'Em Orçamento': 'bg-purple-100 text-purple-700',
      'Concluída': 'bg-emerald-100 text-emerald-700',
      'Com Dificuldade': 'bg-red-100 text-red-700',
    };
    return colors[situacao] || 'bg-slate-100 text-slate-700';
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {userRole === 'elaborador' ? 'Minha Agenda' : 'Agenda de O.S'}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Hoje
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                  <div key={dia} className="text-xs font-medium text-slate-500 uppercase py-2">
                    {dia}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-20 bg-slate-50 rounded-md border border-slate-100"></div>
                ))}
                
                {calendarDays.map((day) => {
                  const osNoDia = getOSForDay(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isDiaAtual = isToday(day);
                  const temAtrasadas = osNoDia.some(os => {
                    try {
                      return isBefore(parseISO(os.vencimento), new Date());
                    } catch { return false; }
                  });
                  
                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => setSelectedDate(day)}
                      className={`
                        h-20 p-1 rounded-md border flex flex-col items-start justify-start 
                        cursor-pointer overflow-hidden transition-all
                        ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-400'}
                        ${isDiaAtual ? 'bg-emerald-50' : 'bg-white'}
                      `}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`
                          text-xs font-medium 
                          ${isDiaAtual ? 'bg-emerald-600 text-white px-1.5 py-0.5 rounded-full' : ''}
                          ${osNoDia.length > 0 ? 'text-slate-900' : 'text-slate-400'}
                        `}>
                          {format(day, 'd')}
                        </span>
                        {temAtrasadas && (
                          <AlertTriangle size={10} className="text-red-500" />
                        )}
                      </div>
                      {osNoDia.slice(0, 2).map((os) => (
                        <div 
                          key={os.id} 
                          className={`
                            w-full text-[9px] truncate px-1 py-0.5 rounded mb-0.5
                            ${getStatusColor(os.situacao, os.vencimento)}
                          `}
                        >
                          {os.os} - {os.agencia.substring(0, 15)}
                        </div>
                      ))}
                      {osNoDia.length > 2 && (
                        <div className="text-[9px] text-slate-500 px-1">
                          +{osNoDia.length - 2} mais
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Fornec. Acionado</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Em Levantamento</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Em Orçamento</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Atrasada</div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedDate 
                ? `O.S em ${format(selectedDate, "d 'de' MMMM", { locale: ptBR })}`
                : 'Selecione um dia'
              }
            </h2>
            {selectedDate && (
              <Badge variant="outline">{selectedDayOS.length} O.S</Badge>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-auto">
            {!selectedDate ? (
              <Card>
                <CardContent className="p-8 text-center text-slate-400">
                  <Clock size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Clique em um dia do calendário para ver as O.S</p>
                </CardContent>
              </Card>
            ) : selectedDayOS.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-slate-400">
                  <CheckCircle2 size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma O.S vence neste dia</p>
                </CardContent>
              </Card>
            ) : (
              selectedDayOS.map((os) => {
                const isAtrasada = isBefore(parseISO(os.vencimento), new Date());
                return (
                  <Card 
                    key={os.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      isAtrasada ? 'border-red-200 bg-red-50' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">O.S {os.os}</h4>
                            {isAtrasada && (
                              <Badge variant="destructive" className="text-[10px]">Atrasada</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{os.agencia}</p>
                          <p className="text-xs text-slate-500 mt-1">{os.contrato}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-xs">
                            {os.tecnico && (
                              <span className="text-slate-500">
                                <span className="font-medium">Téc:</span> {os.tecnico}
                              </span>
                            )}
                            {os.elaborador && (
                              <span className="text-slate-500">
                                <span className="font-medium">Elab:</span> {os.elaborador}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(os.situacao, os.vencimento)}>
                          {os.situacao}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
