import type { OrdemServico as OSType, Notificacao } from '../lib/types';

const API_BASE = '/api';

export interface APIOrdemServico {
  id: string;
  os: string;
  prefixo: string | null;
  agencia: string;
  contrato: string;
  vencimento: string | null;
  situacao: string;
  elaborador: string | null;
  elaboradorId: string | null;
  tecnico: string | null;
  tecnicoId: string | null;
  valorOrcado: string | null;
  valorAprovado: string | null;
  dataAprovacao: string | null;
  aprovadoPor: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface APINotificacao {
  id: string;
  data: string;
  titulo: string;
  mensagem: string;
  statusLeitura: 'lida' | 'nao_lida';
}

function parseOrdemServico(os: APIOrdemServico): OSType {
  return {
    id: os.id,
    os: os.os,
    prefixo: os.prefixo || '',
    agencia: os.agencia,
    contrato: os.contrato,
    vencimento: os.vencimento || '',
    situacao: os.situacao as OSType['situacao'],
    elaborador: os.elaborador,
    elaboradorId: os.elaboradorId,
    tecnico: os.tecnico,
    tecnicoId: os.tecnicoId,
    valorOrcado: os.valorOrcado ? parseFloat(os.valorOrcado) : null,
    valorAprovado: os.valorAprovado ? parseFloat(os.valorAprovado) : null,
    dataAprovacao: os.dataAprovacao,
    aprovadoPor: os.aprovadoPor,
    observacoes: os.observacoes || '',
    dificuldades: [],
  };
}

function parseNotificacao(notificacao: APINotificacao): Notificacao {
  return {
    id: notificacao.id,
    data: notificacao.data,
    titulo: notificacao.titulo,
    mensagem: notificacao.mensagem,
    statusLeitura: notificacao.statusLeitura,
  };
}

export const api = {
  async getOrdensServico(): Promise<OSType[]> {
    const response = await fetch(`${API_BASE}/ordens-servico`);
    if (!response.ok) throw new Error('Erro ao buscar ordens de serviço');
    const data: APIOrdemServico[] = await response.json();
    return data.map(parseOrdemServico);
  },

  async getOrdemServico(id: string): Promise<OSType> {
    const response = await fetch(`${API_BASE}/ordens-servico/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar ordem de serviço');
    const data: APIOrdemServico = await response.json();
    return parseOrdemServico(data);
  },

  async createOrdemServico(os: Partial<OSType>): Promise<OSType> {
    const response = await fetch(`${API_BASE}/ordens-servico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        os: os.os,
        prefixo: os.prefixo || null,
        agencia: os.agencia,
        contrato: os.contrato,
        vencimento: os.vencimento || null,
        situacao: os.situacao || 'Fornecedor Acionado',
        elaborador: os.elaborador || null,
        elaboradorId: os.elaboradorId || null,
        tecnico: os.tecnico || null,
        tecnicoId: os.tecnicoId || null,
        valorOrcado: os.valorOrcado?.toString() || null,
        valorAprovado: os.valorAprovado?.toString() || null,
        dataAprovacao: os.dataAprovacao || null,
        aprovadoPor: os.aprovadoPor || null,
        observacoes: os.observacoes || null,
      }),
    });
    if (!response.ok) throw new Error('Erro ao criar ordem de serviço');
    const data: APIOrdemServico = await response.json();
    return parseOrdemServico(data);
  },

  async createManyOrdensServico(osList: Partial<OSType>[]): Promise<{ imported: number; ordens: OSType[] }> {
    const payload = osList.map(os => ({
      os: os.os,
      prefixo: os.prefixo || null,
      agencia: os.agencia,
      contrato: os.contrato,
      vencimento: os.vencimento || null,
      situacao: os.situacao || 'Fornecedor Acionado',
      elaborador: os.elaborador || null,
      elaboradorId: os.elaboradorId || null,
      tecnico: os.tecnico || null,
      tecnicoId: os.tecnicoId || null,
      valorOrcado: os.valorOrcado?.toString() || null,
      valorAprovado: os.valorAprovado?.toString() || null,
      dataAprovacao: os.dataAprovacao || null,
      aprovadoPor: os.aprovadoPor || null,
      observacoes: os.observacoes || null,
    }));
    
    const response = await fetch(`${API_BASE}/ordens-servico/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao importar ordens de serviço');
    const data = await response.json();
    return {
      imported: data.imported,
      ordens: data.ordens.map(parseOrdemServico),
    };
  },

  async updateOrdemServico(id: string, updates: Partial<OSType>): Promise<OSType> {
    const payload: Record<string, any> = {};
    if (updates.os !== undefined) payload.os = updates.os;
    if (updates.prefixo !== undefined) payload.prefixo = updates.prefixo || null;
    if (updates.agencia !== undefined) payload.agencia = updates.agencia;
    if (updates.contrato !== undefined) payload.contrato = updates.contrato;
    if (updates.vencimento !== undefined) payload.vencimento = updates.vencimento || null;
    if (updates.situacao !== undefined) payload.situacao = updates.situacao;
    if (updates.elaborador !== undefined) payload.elaborador = updates.elaborador || null;
    if (updates.elaboradorId !== undefined) payload.elaboradorId = updates.elaboradorId || null;
    if (updates.tecnico !== undefined) payload.tecnico = updates.tecnico || null;
    if (updates.tecnicoId !== undefined) payload.tecnicoId = updates.tecnicoId || null;
    if (updates.valorOrcado !== undefined) payload.valorOrcado = updates.valorOrcado?.toString() || null;
    if (updates.valorAprovado !== undefined) payload.valorAprovado = updates.valorAprovado?.toString() || null;
    if (updates.dataAprovacao !== undefined) payload.dataAprovacao = updates.dataAprovacao || null;
    if (updates.aprovadoPor !== undefined) payload.aprovadoPor = updates.aprovadoPor || null;
    if (updates.observacoes !== undefined) payload.observacoes = updates.observacoes || null;

    const response = await fetch(`${API_BASE}/ordens-servico/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao atualizar ordem de serviço');
    const data: APIOrdemServico = await response.json();
    return parseOrdemServico(data);
  },

  async deleteOrdemServico(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/ordens-servico/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar ordem de serviço');
    return true;
  },

  async healthCheck(): Promise<{ status: string; ordensCount: number }> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error('Erro ao verificar status do servidor');
    return response.json();
  },

  async getNotificacoes(status?: 'todas' | 'nao_lidas'): Promise<Notificacao[]> {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE}/notificacoes${params}`);
    if (!response.ok) throw new Error('Erro ao buscar notificacoes');
    const data: APINotificacao[] = await response.json();
    return data.map(parseNotificacao);
  },

  async marcarNotificacaoComoLida(id: string): Promise<Notificacao> {
    const response = await fetch(`${API_BASE}/notificacoes/${id}/lida`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Erro ao marcar notificacao como lida');
    const data: APINotificacao = await response.json();
    return parseNotificacao(data);
  },
};
