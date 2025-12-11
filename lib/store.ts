import { OrdemServico, User, USERS } from './types';

let ordensServico: OrdemServico[] = [];

export function getOrdensServico(): OrdemServico[] {
  return [...ordensServico];
}

export function setOrdensServico(os: OrdemServico[]): void {
  ordensServico = os;
}

export function addOrdensServico(novasOS: OrdemServico[]): void {
  ordensServico = [...ordensServico, ...novasOS];
}

export function updateOrdemServico(id: string, updates: Partial<OrdemServico>): void {
  ordensServico = ordensServico.map(os => 
    os.id === id ? { ...os, ...updates, atualizadoEm: new Date().toISOString() } : os
  );
}

export function getOrdemServicoById(id: string): OrdemServico | undefined {
  return ordensServico.find(os => os.id === id);
}

export function getOSByTecnico(tecnicoId: string): OrdemServico[] {
  const tecnico = USERS.find(u => u.id === tecnicoId);
  if (!tecnico) return [];
  return ordensServico.filter(os => os.tecnico === tecnico.name);
}

export function getOSByContrato(contrato: string): OrdemServico[] {
  return ordensServico.filter(os => os.contrato === contrato);
}

export function getContratos(): string[] {
  const contratos = new Set(ordensServico.map(os => os.contrato));
  return Array.from(contratos);
}

export function getOSStats() {
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
