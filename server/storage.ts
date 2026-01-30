import { 
  users, tecnicos, contratos, ordensServico, dificuldades, notificacoes,
  type User, type InsertUser,
  type Tecnico, type InsertTecnico,
  type Contrato, type InsertContrato,
  type OrdemServico, type InsertOrdemServico,
  type Dificuldade, type InsertDificuldade,
  type Notificacao
} from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTecnicos(): Promise<Tecnico[]>;
  getTecnico(id: number): Promise<Tecnico | undefined>;
  createTecnico(tecnico: InsertTecnico): Promise<Tecnico>;

  getContratos(): Promise<Contrato[]>;
  getContrato(id: number): Promise<Contrato | undefined>;
  createContrato(contrato: InsertContrato): Promise<Contrato>;

  getOrdensServico(): Promise<OrdemServico[]>;
  getOrdemServico(id: string): Promise<OrdemServico | undefined>;
  createOrdemServico(os: InsertOrdemServico): Promise<OrdemServico>;
  createManyOrdensServico(osList: InsertOrdemServico[]): Promise<OrdemServico[]>;
  updateOrdemServico(id: string, os: Partial<InsertOrdemServico>): Promise<OrdemServico | undefined>;
  deleteOrdemServico(id: string): Promise<boolean>;

  getDificuldades(): Promise<Dificuldade[]>;
  getDificuldadesByOS(ordemServicoId: string): Promise<Dificuldade[]>;
  createDificuldade(dificuldade: InsertDificuldade): Promise<Dificuldade>;

  getNotificacoes(filter?: 'todas' | 'nao_lida'): Promise<Notificacao[]>;
  marcarNotificacaoComoLida(id: string): Promise<Notificacao | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTecnicos(): Promise<Tecnico[]> {
    return await db.select().from(tecnicos);
  }

  async getTecnico(id: number): Promise<Tecnico | undefined> {
    const [tecnico] = await db.select().from(tecnicos).where(eq(tecnicos.id, id));
    return tecnico || undefined;
  }

  async createTecnico(insertTecnico: InsertTecnico): Promise<Tecnico> {
    const [tecnico] = await db.insert(tecnicos).values(insertTecnico).returning();
    return tecnico;
  }

  async getContratos(): Promise<Contrato[]> {
    return await db.select().from(contratos);
  }

  async getContrato(id: number): Promise<Contrato | undefined> {
    const [contrato] = await db.select().from(contratos).where(eq(contratos.id, id));
    return contrato || undefined;
  }

  async createContrato(insertContrato: InsertContrato): Promise<Contrato> {
    const [contrato] = await db.insert(contratos).values(insertContrato).returning();
    return contrato;
  }

  async getOrdensServico(): Promise<OrdemServico[]> {
    return await db.select().from(ordensServico).orderBy(desc(ordensServico.createdAt));
  }

  async getOrdemServico(id: string): Promise<OrdemServico | undefined> {
    const [os] = await db.select().from(ordensServico).where(eq(ordensServico.id, id));
    return os || undefined;
  }

  async createOrdemServico(insertOS: InsertOrdemServico): Promise<OrdemServico> {
    const [os] = await db.insert(ordensServico).values(insertOS).returning();
    return os;
  }

  async createManyOrdensServico(osList: InsertOrdemServico[]): Promise<OrdemServico[]> {
    if (osList.length === 0) return [];
    const result = await db.insert(ordensServico).values(osList).returning();
    return result;
  }

  async updateOrdemServico(id: string, updateData: Partial<InsertOrdemServico>): Promise<OrdemServico | undefined> {
    const [os] = await db
      .update(ordensServico)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(ordensServico.id, id))
      .returning();
    return os || undefined;
  }

  async deleteOrdemServico(id: string): Promise<boolean> {
    const result = await db.delete(ordensServico).where(eq(ordensServico.id, id)).returning();
    return result.length > 0;
  }

  async getDificuldades(): Promise<Dificuldade[]> {
    return await db.select().from(dificuldades).orderBy(desc(dificuldades.criadoEm));
  }

  async getDificuldadesByOS(ordemServicoId: string): Promise<Dificuldade[]> {
    return await db
      .select()
      .from(dificuldades)
      .where(eq(dificuldades.ordemServicoId, ordemServicoId))
      .orderBy(desc(dificuldades.criadoEm));
  }

  async createDificuldade(insertDificuldade: InsertDificuldade): Promise<Dificuldade> {
    const [dificuldade] = await db.insert(dificuldades).values(insertDificuldade).returning();
    return dificuldade;
  }

  async getNotificacoes(filter: 'todas' | 'nao_lida' = 'todas'): Promise<Notificacao[]> {
    if (filter === 'nao_lida') {
      return await db
        .select()
        .from(notificacoes)
        .where(eq(notificacoes.statusLeitura, 'nao_lida'))
        .orderBy(desc(notificacoes.data));
    }
    return await db.select().from(notificacoes).orderBy(desc(notificacoes.data));
  }

  async marcarNotificacaoComoLida(id: string): Promise<Notificacao | undefined> {
    const [notificacao] = await db
      .update(notificacoes)
      .set({ statusLeitura: 'lida' })
      .where(eq(notificacoes.id, id))
      .returning();
    return notificacao || undefined;
  }
}

export const storage = new DatabaseStorage();
