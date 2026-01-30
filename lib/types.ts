export type UserRole = 'manager' | 'elaborador' | 'contract_admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  contratos?: string[];
}

export const USERS: User[] = [
  { id: '1', name: 'Paulo Silva', email: 'paulo@maffeng.com', role: 'manager', initials: 'PS' },
  { id: '2', name: 'Thiago', email: 'thiago@maffeng.com', role: 'elaborador', initials: 'TH' },
  { id: '3', name: 'Danilo', email: 'danilo@maffeng.com', role: 'elaborador', initials: 'DA' },
  { id: '4', name: 'Felipe', email: 'felipe@maffeng.com', role: 'elaborador', initials: 'FE' },
  { id: '5', name: 'Davi', email: 'davi@maffeng.com', role: 'elaborador', initials: 'DV' },
  { id: '6', name: 'Alexandre', email: 'alexandre@maffeng.com', role: 'contract_admin', initials: 'AL' },
  { id: '7', name: 'João Victor', email: 'joaovictor@maffeng.com', role: 'contract_admin', initials: 'JV' },
  { id: '8', name: 'Laura', email: 'laura@maffeng.com', role: 'contract_admin', initials: 'LA' },
];

export interface Tecnico {
  id: string;
  nome: string;
  initials: string;
}

export const TECNICOS: Tecnico[] = [
  { id: 't1', nome: 'Fellipe', initials: 'FP' },
  { id: 't2', nome: 'Ulisses', initials: 'UL' },
  { id: 't3', nome: 'Alexandro', initials: 'AX' },
  { id: 't4', nome: 'Vanderlan', initials: 'VD' },
  { id: 't5', nome: 'Sidney', initials: 'SI' },
  { id: 't6', nome: 'Mendes', initials: 'ME' },
  { id: 't7', nome: 'Glaicon', initials: 'GL' },
  { id: 't8', nome: 'Ueliton', initials: 'UE' },
  { id: 't9', nome: 'Flávio', initials: 'FL' },
];

export type OSStatus = 
  | 'Fornecedor Acionado'
  | 'Em Levantamento'
  | 'Em Elaboração'
  | 'Em Orçamento'
  | 'Concluída'
  | 'Com Dificuldade'
  | 'Mudança de Contrato';


export type StatusLeitura = 'lida' | 'nao_lida'

export interface Notificacao {
  id: string
  data: string
  titulo: string
  mensagem: string
  statusLeitura: StatusLeitura
}
export interface Dificuldade {
  id: string;
  texto: string;
  autor: string;
  dataHora: string;
}

export interface OrdemServico {
  id: string;
  os: string;
  prefixo: string;
  agencia: string;
  contrato: string;
  vencimento: string;
  situacao: OSStatus;
  elaborador: string | null;
  elaboradorId: string | null;
  tecnico: string | null;
  tecnicoId: string | null;
  agendamento?: string | null;
  dataLevantamento?: string | null;
  valorLevantamento?: number | null;
  valorOrcado: number | null;
  valorAprovado: number | null;
  dataAprovacao: string | null;
  aprovadoPor: string | null;
  observacoes?: string;
  anexos?: string[];
  dificuldades: Dificuldade[];
  criadoEm?: string;
  atualizadoEm?: string;
}
