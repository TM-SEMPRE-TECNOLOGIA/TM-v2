import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../lib/store', () => ({
  useOSStore: (selector: any) => selector({
    fetchOrdensServico: vi.fn()
  })
}))

vi.mock('../components/Dashboard', () => ({
  Dashboard: () => <div>Dashboard</div>
}))

vi.mock('../components/TeamList', () => ({
  TeamList: () => <div>TeamList</div>
}))

vi.mock('../components/AgendaAndChecklist', () => ({
  AgendaAndChecklist: () => <div>Agenda</div>
}))

vi.mock('../components/WorkOrders', () => ({
  WorkOrders: () => <div>WorkOrders</div>
}))

vi.mock('../components/ImportOS', () => ({
  ImportOS: () => <div>ImportOS</div>
}))

vi.mock('../components/DifficultyLog', () => ({
  DifficultyLog: () => <div>DifficultyLog</div>
}))

vi.mock('../components/Reports', () => ({
  Reports: () => <div>Reports</div>
}))

vi.mock('../components/Settings', () => ({
  Settings: () => <div>Settings</div>
}))

vi.mock('../components/BalancoPreventivas', () => ({
  BalancoPreventivas: () => <div>BalancoPreventivas</div>
}))

vi.mock('../components/Notifications', () => ({
  Notifications: () => <div data-testid="notifications-popover" />
}))

const apiMock = {
  getOrdensServico: vi.fn().mockResolvedValue([]),
  getNotificacoes: vi.fn(),
  marcarNotificacaoComoLida: vi.fn(),
}

vi.mock('../lib/api', () => ({
  api: apiMock,
}))

const seedNotifications = () => ([
  {
    id: 'n1',
    data: '2026-01-30T10:00:00.000Z',
    titulo: 'Aviso de Prazo',
    mensagem: 'Prazo expirando',
    statusLeitura: 'nao_lida',
  },
  {
    id: 'n2',
    data: '2026-01-29T08:00:00.000Z',
    titulo: 'Atualizacao',
    mensagem: 'Status atualizado',
    statusLeitura: 'lida',
  }
])

describe('Notificacoes - fluxo principal', () => {
  beforeEach(() => {
    apiMock.getNotificacoes.mockResolvedValue(seedNotifications())
    apiMock.marcarNotificacaoComoLida.mockImplementation(async (id: string) => ({
      ...(seedNotifications().find((item) => item.id === id) ?? seedNotifications()[0]),
      statusLeitura: 'lida'
    }))
  })

  afterEach(async () => {
    vi.clearAllMocks()
    const { useNotificationsStore } = await import('../lib/notificationsStore')
    useNotificationsStore.setState({ notificacoes: [], isLoading: false, error: null })
  })

  it('lista, filtra e marca como lida com atualizacao de badge', async () => {
    const user = userEvent.setup()
    const { default: App } = await import('../App')

    render(<App />)

    const managerButton = await screen.findByText('Paulo Silva')
    await user.click(managerButton)

    const notificationsNav = await screen.findByText('Notificacoes')
    await user.click(notificationsNav)

    expect(await screen.findByText('Aviso de Prazo')).toBeInTheDocument()
    expect(screen.getByText('Atualizacao')).toBeInTheDocument()

    const badge = await screen.findByText('1')
    expect(badge).toBeInTheDocument()

    const naoLidasButton = screen.getByRole('button', { name: 'Nao lidas' })
    await user.click(naoLidasButton)

    expect(screen.getByText('Aviso de Prazo')).toBeInTheDocument()
    expect(screen.queryByText('Atualizacao')).not.toBeInTheDocument()

    const marcarComoLida = screen.getByRole('button', { name: 'Marcar como lida' })
    await user.click(marcarComoLida)

    expect(await screen.findByText('Sem notificacoes')).toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
})
