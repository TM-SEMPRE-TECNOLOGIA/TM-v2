import { pgTable, text, serial, integer, timestamp, date, numeric, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum('user_role', ['manager', 'elaborador', 'contract_admin']);

export const osStatusEnum = pgEnum('os_status', [
  'Fornecedor Acionado',
  'Em Levantamento',
  'Em Elaboração',
  'Em Orçamento',
  'Concluída',
  'Com Dificuldade',
  'Mudança de Contrato'
]);

export const notificacaoStatusLeituraEnum = pgEnum('notificacao_status_leitura', [
  'lida',
  'nao_lida'
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  role: userRoleEnum("role").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tecnicos = pgTable("tecnicos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contratos = pgTable("contratos", {
  id: serial("id").primaryKey(),
  codigo: text("codigo").notNull().unique(),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordensServico = pgTable("ordens_servico", {
  id: uuid("id").defaultRandom().primaryKey(),
  os: text("os").notNull(),
  prefixo: text("prefixo"),
  agencia: text("agencia").notNull(),
  contrato: text("contrato").notNull(),
  vencimento: text("vencimento"),
  situacao: osStatusEnum("situacao").default('Fornecedor Acionado').notNull(),
  elaborador: text("elaborador"),
  elaboradorId: text("elaborador_id"),
  tecnico: text("tecnico"),
  tecnicoId: text("tecnico_id"),
  valorOrcado: numeric("valor_orcado", { precision: 12, scale: 2 }),
  valorAprovado: numeric("valor_aprovado", { precision: 12, scale: 2 }),
  dataAprovacao: text("data_aprovacao"),
  aprovadoPor: text("aprovado_por"),
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dificuldades = pgTable("dificuldades", {
  id: serial("id").primaryKey(),
  ordemServicoId: uuid("ordem_servico_id").references(() => ordensServico.id).notNull(),
  texto: text("texto").notNull(),
  autorId: text("autor_id"),
  autorNome: text("autor_nome"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const notificacoes = pgTable("notificacoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: timestamp("data").defaultNow().notNull(),
  titulo: text("titulo").notNull(),
  mensagem: text("mensagem").notNull(),
  statusLeitura: notificacaoStatusLeituraEnum("status_leitura").default('nao_lida').notNull(),
});

export const ordensServicoRelations = relations(ordensServico, ({ many }) => ({
  dificuldades: many(dificuldades),
}));

export const dificuldadesRelations = relations(dificuldades, ({ one }) => ({
  ordemServico: one(ordensServico, {
    fields: [dificuldades.ordemServicoId],
    references: [ordensServico.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Tecnico = typeof tecnicos.$inferSelect;
export type InsertTecnico = typeof tecnicos.$inferInsert;
export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = typeof contratos.$inferInsert;
export type OrdemServico = typeof ordensServico.$inferSelect;
export type InsertOrdemServico = typeof ordensServico.$inferInsert;
export type Dificuldade = typeof dificuldades.$inferSelect;
export type InsertDificuldade = typeof dificuldades.$inferInsert;
export type Notificacao = typeof notificacoes.$inferSelect;
export type InsertNotificacao = typeof notificacoes.$inferInsert;
