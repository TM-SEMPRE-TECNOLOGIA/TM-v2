import React, { useEffect, useMemo } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import { Button } from './ui/button'
import { Bell, Clock } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { useNotificationsStore } from '../lib/notificationsStore'
import { format } from 'date-fns'

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return format(date, 'dd/MM/yyyy HH:mm')
}

export function Notifications() {
  const notificacoes = useNotificationsStore((state) => state.notificacoes)
  const isLoading = useNotificationsStore((state) => state.isLoading)
  const error = useNotificationsStore((state) => state.error)
  const fetchNotificacoes = useNotificationsStore((state) => state.fetchNotificacoes)

  useEffect(() => {
    if (!notificacoes.length && !isLoading) {
      fetchNotificacoes()
    }
  }, [fetchNotificacoes, isLoading, notificacoes.length])

  const unreadCount = useMemo(() => (
    notificacoes.filter((notificacao) => notificacao.statusLeitura === 'nao_lida').length
  ), [notificacoes])

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
          <h4 className="font-semibold text-sm text-slate-900">Notificacoes</h4>
          <span className="text-xs text-slate-500">{unreadCount} nao lidas</span>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {error && (
              <div className="p-6 text-center text-slate-400">
                <p className="text-sm">Erro ao carregar notificacoes</p>
              </div>
            )}
            {!error && notificacoes.length === 0 && !isLoading && (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Sem notificacoes</p>
              </div>
            )}
            {!error && notificacoes.length > 0 && (
              notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-default flex gap-3
                    ${notificacao.statusLeitura === 'nao_lida' ? 'bg-blue-50/30' : ''}
                  `}
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900 leading-none">{notificacao.titulo}</p>
                    <p className="text-xs text-slate-500">{notificacao.mensagem}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {formatDateTime(notificacao.data)}
                    </p>
                  </div>
                  {notificacao.statusLeitura === 'nao_lida' && (
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
