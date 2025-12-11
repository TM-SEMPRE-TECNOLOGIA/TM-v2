import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Bell, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

// Mock Notifications baseadas nas regras de negócio
const notifications = [
  {
    id: 1,
    title: 'Prazo de Relatório Expirando',
    message: 'OS-98235 vence em 2 dias (Regra 15 dias).',
    time: '2 horas atrás',
    type: 'warning',
    read: false
  },
  {
    id: 2,
    title: 'Nova Atribuição',
    message: 'Você foi definido como Elaborador da OS-98240.',
    time: '5 horas atrás',
    type: 'info',
    read: false
  },
  {
    id: 3,
    title: 'Valor Aprovado',
    message: 'Alexandre aprovou o orçamento da OS-98210.',
    time: '1 dia atrás',
    type: 'success',
    read: true
  },
   {
    id: 4,
    title: 'Nova Dificuldade Registrada',
    message: 'Danilo reportou problema de acesso na Agência Central.',
    time: '1 dia atrás',
    type: 'warning',
    read: true
  }
];

export function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h4 className="font-semibold text-sm text-slate-900">Notificações</h4>
          <span className="text-xs text-slate-500">{unreadCount} não lidas</span>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3
                  ${!notif.read ? 'bg-blue-50/30' : ''}
                `}
              >
                <div className={`mt-1 p-1.5 rounded-full h-fit
                  ${notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                    notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                    'bg-blue-100 text-blue-600'}
                `}>
                  {notif.type === 'warning' ? <AlertTriangle size={14} /> : 
                   notif.type === 'success' ? <CheckCircle2 size={14} /> : 
                   <FileText size={14} />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-900 leading-none">{notif.title}</p>
                  <p className="text-xs text-slate-500">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {notif.time}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-slate-100 text-center">
          <Button variant="ghost" size="sm" className="text-xs text-slate-500 w-full h-8">
            Marcar todas como lidas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
