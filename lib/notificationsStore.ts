import { create } from 'zustand'
import { api } from './api'
import type { Notificacao } from './types'

interface NotificationsState {
  notificacoes: Notificacao[]
  isLoading: boolean
  error: string | null
  fetchNotificacoes: () => Promise<void>
  marcarComoLida: (id: string) => Promise<void>
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notificacoes: [],
  isLoading: false,
  error: null,

  fetchNotificacoes: async () => {
    const { isLoading } = get()
    if (isLoading) return

    set({ isLoading: true, error: null })
    try {
      const notificacoes = await api.getNotificacoes()
      set({ notificacoes, isLoading: false })
    } catch (error) {
      console.error('Erro ao buscar notificacoes:', error)
      set({ error: 'Erro ao carregar notificacoes', isLoading: false })
    }
  },

  marcarComoLida: async (id) => {
    try {
      const atualizada = await api.marcarNotificacaoComoLida(id)
      set((state) => ({
        notificacoes: state.notificacoes.map((notificacao) =>
          notificacao.id === id ? atualizada : notificacao
        )
      }))
    } catch (error) {
      console.error('Erro ao marcar notificacao como lida:', error)
      set({ error: 'Erro ao marcar notificacao como lida' })
      throw error
    }
  }
}))
