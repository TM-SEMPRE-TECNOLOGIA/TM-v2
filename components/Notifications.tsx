import React, { useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Bell, Clock, CheckCircle2, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useOSStore } from '../lib/store';
import { parseISO, isBefore, addDays, differenceInDays, format } from 'date-fns';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'success' | 'info';
  read: boolean;
}

export function Notifications() {
  const ordensServico = useOSStore((state) => state.ordensServico);

  const notifications = useMemo(() => {
    const notifs: NotificationItem[] = [];
    const now = new Date();

    ordensServico.forEach(os => {
      if (!os.vencimento || os.situacao === 'Concluída') return;

      try {
        const vencimento = parseISO(os.vencimento);
        const diasRestantes = differenceInDays(vencimento, now);

        const agenciaStr = (os.agencia || '').substring(0, 30);
        if (diasRestantes < 0) {
          notifs.push({
            id: `atrasada-${os.id}`,
            title: 'O.S Atrasada',
            message: `${os.os} está ${Math.abs(diasRestantes)} dias atrasada - ${agenciaStr}`,
            time: format(vencimento, 'dd/MM/yyyy'),
            type: 'warning',
            read: false
          });
        } else if (diasRestantes <= 3) {
          notifs.push({
            id: `urgente-${os.id}`,
            title: 'Prazo Expirando',
            message: `${os.os} vence em ${diasRestantes} dia(s) - ${agenciaStr}`,
            time: format(vencimento, 'dd/MM/yyyy'),
            type: 'warning',
            read: false
          });
        } else if (diasRestantes <= 7) {
          notifs.push({
            id: `alerta-${os.id}`,
            title: 'Vencimento Próximo',
            message: `${os.os} vence em ${diasRestantes} dias`,
            time: format(vencimento, 'dd/MM/yyyy'),
            type: 'info',
            read: true
          });
        }
      } catch {}

      if (os.valorAprovado && os.dataAprovacao) {
        try {
          const dataAprov = parseISO(os.dataAprovacao);
          if (differenceInDays(now, dataAprov) <= 3) {
            notifs.push({
              id: `aprovado-${os.id}`,
              title: 'Valor Aprovado',
              message: `${os.os} teve orçamento aprovado: R$ ${os.valorAprovado.toFixed(2)}`,
              time: format(dataAprov, 'dd/MM/yyyy'),
              type: 'success',
              read: true
            });
          }
        } catch {}
      }

      if (os.dificuldades && os.dificuldades.length > 0) {
        const lastDif = os.dificuldades[os.dificuldades.length - 1];
        try {
          const dataDif = parseISO(lastDif.dataHora);
          if (differenceInDays(now, dataDif) <= 2) {
            notifs.push({
              id: `dif-${lastDif.id}`,
              title: 'Nova Dificuldade',
              message: `${os.os} - ${(lastDif.texto || '').substring(0, 40)}...`,
              time: format(dataDif, 'dd/MM/yyyy'),
              type: 'warning',
              read: false
            });
          }
        } catch {}
      }
    });

    notifs.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return 0;
    });

    return notifs.slice(0, 10);
  }, [ordensServico]);

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
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notif) => (
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
                     <Calendar size={14} />}
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
              ))
            )}
          </div>
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-slate-100 text-center">
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 w-full h-8">
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
