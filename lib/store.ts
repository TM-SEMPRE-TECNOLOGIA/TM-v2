import { create } from 'zustand';
import { OrdemServico, USERS, TECNICOS } from './types';
import { api } from './api';

interface OSState {
  ordensServico: OrdemServico[];
  isLoading: boolean;
  error: string | null;
  
  setOrdensServico: (os: OrdemServico[]) => void;
  addOrdensServico: (novasOS: OrdemServico[]) => void;
  updateOrdemServico: (id: string, updates: Partial<OrdemServico>) => void;
  clearOrdensServico: () => void;
  
  fetchOrdensServico: () => Promise<void>;
  importOrdensServico: (osList: Partial<OrdemServico>[]) => Promise<{ imported: number }>;
  updateOrdemServicoAPI: (id: string, updates: Partial<OrdemServico>) => Promise<void>;
  deleteOrdemServicoAPI: (id: string) => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => ({
  ordensServico: [],
  isLoading: false,
  error: null,

  setOrdensServico: (os) => set({ ordensServico: os }),

  addOrdensServico: (novasOS) => set((state) => ({
    ordensServico: [...state.ordensServico, ...novasOS]
  })),

  updateOrdemServico: (id, updates) => set((state) => ({
    ordensServico: state.ordensServico.map(os =>
      os.id === id 
        ? { ...os, ...updates, atualizadoEm: new Date().toISOString() } 
        : os
    )
  })),

  clearOrdensServico: () => set({ ordensServico: [] }),

  fetchOrdensServico: async () => {
    set({ isLoading: true, error: null });
    try {
      const ordens = await api.getOrdensServico();
      set({ ordensServico: ordens, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar O.S:', error);
      set({ error: 'Erro ao carregar dados do servidor', isLoading: false });
    }
  },

  importOrdensServico: async (osList) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.createManyOrdensServico(osList);
      set((state) => ({
        ordensServico: [...result.ordens, ...state.ordensServico],
        isLoading: false
      }));
      return { imported: result.imported };
    } catch (error) {
      console.error('Erro ao importar O.S:', error);
      set({ error: 'Erro ao importar dados', isLoading: false });
      throw error;
    }
  },

  updateOrdemServicoAPI: async (id, updates) => {
    try {
      const updated = await api.updateOrdemServico(id, updates);
      set((state) => ({
        ordensServico: state.ordensServico.map(os =>
          os.id === id ? updated : os
        )
      }));
    } catch (error) {
      console.error('Erro ao atualizar O.S:', error);
      throw error;
    }
  },

  deleteOrdemServicoAPI: async (id) => {
    try {
      await api.deleteOrdemServico(id);
      set((state) => ({
        ordensServico: state.ordensServico.filter(os => os.id !== id)
      }));
    } catch (error) {
      console.error('Erro ao deletar O.S:', error);
      throw error;
    }
  }
}));

export function getOrdemServicoById(id: string): OrdemServico | undefined {
  return useOSStore.getState().ordensServico.find(os => os.id === id);
}

export function getOSByElaborador(elaboradorId: string): OrdemServico[] {
  const elaborador = USERS.find(u => u.id === elaboradorId);
  if (!elaborador) return [];
  return useOSStore.getState().ordensServico.filter(os => 
    os.elaboradorId === elaboradorId || os.elaborador === elaborador.name
  );
}

export function getOSByTecnico(tecnicoId: string): OrdemServico[] {
  const tecnico = TECNICOS.find(t => t.id === tecnicoId);
  if (!tecnico) return [];
  return useOSStore.getState().ordensServico.filter(os => 
    os.tecnicoId === tecnicoId || os.tecnico === tecnico.nome
  );
}

export function getOSByContrato(contrato: string): OrdemServico[] {
  return useOSStore.getState().ordensServico.filter(os => os.contrato === contrato);
}

export function getContratos(): string[] {
  const ordensServico = useOSStore.getState().ordensServico;
  const contratos = new Set(ordensServico.map(os => os.contrato));
  return Array.from(contratos);
}

export function getOSStats() {
  const ordensServico = useOSStore.getState().ordensServico;
  const total = ordensServico.length;
  const emLevantamento = ordensServico.filter(os => os.situacao === 'Em Levantamento').length;
  const emElaboracao = ordensServico.filter(os => os.situacao === 'Em Elaboração').length;
  const emOrcamento = ordensServico.filter(os => os.situacao === 'Em Orçamento').length;
  const concluidas = ordensServico.filter(os => os.situacao === 'Concluída').length;
  const comDificuldade = ordensServico.filter(os => os.situacao === 'Com Dificuldade').length;
  const fornecedorAcionado = ordensServico.filter(os => os.situacao === 'Fornecedor Acionado').length;
  
  return {
    total,
    emLevantamento,
    emElaboracao,
    emOrcamento,
    concluidas,
    comDificuldade,
    fornecedorAcionado
  };
}
