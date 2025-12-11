export type UserRole = 'manager' | 'technician' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

export const USERS: User[] = [
  { id: '1', name: 'Paulo Silva', email: 'paulo@maffeng.com', role: 'manager', initials: 'PS' },
  { id: '2', name: 'Danilo Costa', email: 'danilo@maffeng.com', role: 'technician', initials: 'DC' },
  { id: '3', name: 'Alexandre Souza', email: 'alexandre@maffeng.com', role: 'admin', initials: 'AS' },
];

export type OSStatus = 
  | 'Fornecedor Acionado'
  | 'Em Levantamento'
  | 'Em Elaboração'
  | 'Em Orçamento'
  | 'Concluída'
  | 'Com Dificuldade'
  | 'Mudança de Contrato';

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
  tecnico: string | null;
  agendamento: string | null;
  dataLevantamento: string | null;
  valorLevantamento: number | null;
  valorAprovado: number | null;
  anexos: string[];
  dificuldades: Dificuldade[];
  criadoEm: string;
  atualizadoEm: string;
}
