import React, { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCircle2, Circle, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'
import { useNotificationsStore } from '../lib/notificationsStore'
import type { Notificacao } from '../lib/types'
import { format } from 'date-fns'

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return format(date, 'dd/MM/yyyy HH:mm')
}

const sortByDateDesc = (a: Notificacao, b: Notificacao) => {
  const dateA = new Date(a.data).getTime()
  const dateB = new Date(b.data).getTime()
  return dateB - dateA
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<'todas' | 'nao_lidas'>('todas')
  const notificacoes = useNotificationsStore((state) => state.notificacoes)
  const isLoading = useNotificationsStore((state) => state.isLoading)
  const error = useNotificationsStore((state) => state.error)
  const fetchNotificacoes = useNotificationsStore((state) => state.fetchNotificacoes)
  const marcarComoLida = useNotificationsStore((state) => state.marcarComoLida)

  useEffect(() => {
    fetchNotificacoes()
  }, [fetchNotificacoes])

  const visibleNotifications = useMemo(() => {
    const list = filter === 'nao_lidas'
      ? notificacoes.filter((item) => item.statusLeitura === 'nao_lida')
      : notificacoes

    return [...list].sort(sortByDateDesc)
  }, [filter, notificacoes])

  const hasNotifications = visibleNotifications.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Notificacoes</h3>
          <p className="text-sm text-slate-500">Acompanhe as notificacoes mais recentes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('todas')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'nao_lidas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('nao_lidas')}
          >
            Nao lidas
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando notificacoes...
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-8 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
          <p className="text-sm">Nao foi possivel carregar as notificacoes.</p>
        </div>
      )}

      {!isLoading && !error && !hasNotifications && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-slate-500">
          <Bell className="h-7 w-7" />
          <p className="text-sm">Sem notificacoes</p>
        </div>
      )}

      {!isLoading && !error && hasNotifications && (
        <div className="space-y-3">
          {visibleNotifications.map((notificacao) => (
            <div
              key={notificacao.id}
              className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between
                ${notificacao.statusLeitura === 'nao_lida'
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-slate-200 bg-white'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {notificacao.statusLeitura === 'nao_lida' ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Circle className="h-4 w-4 fill-emerald-500" />
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notificacao.titulo}</p>
                  <p className="text-sm text-slate-500">{notificacao.mensagem}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(notificacao.data)}</p>
                </div>
              </div>
              {notificacao.statusLeitura === 'nao_lida' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => marcarComoLida(notificacao.id)}
                >
                  Marcar como lida
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
