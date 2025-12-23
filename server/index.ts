import express from 'express';
import cors from 'cors';
import { storage } from './storage';
import type { InsertOrdemServico, InsertDificuldade } from '../shared/schema';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', async (req, res) => {
  try {
    const ordens = await storage.getOrdensServico();
    res.json({ status: 'ok', ordensCount: ordens.length });
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) });
  }
});

app.get('/api/ordens-servico', async (req, res) => {
  try {
    const ordens = await storage.getOrdensServico();
    res.json(ordens);
  } catch (error) {
    console.error('Erro ao buscar O.S:', error);
    res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
  }
});

app.get('/api/ordens-servico/:id', async (req, res) => {
  try {
    const os = await storage.getOrdemServico(req.params.id);
    if (!os) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json(os);
  } catch (error) {
    console.error('Erro ao buscar O.S:', error);
    res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
  }
});

app.post('/api/ordens-servico', async (req, res) => {
  try {
    const os = await storage.createOrdemServico(req.body as InsertOrdemServico);
    res.status(201).json(os);
  } catch (error) {
    console.error('Erro ao criar O.S:', error);
    res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
  }
});

app.post('/api/ordens-servico/batch', async (req, res) => {
  try {
    const osList: InsertOrdemServico[] = req.body;
    if (!Array.isArray(osList)) {
      return res.status(400).json({ error: 'Body deve ser um array de ordens de serviço' });
    }
    const created = await storage.createManyOrdensServico(osList);
    res.status(201).json({ imported: created.length, ordens: created });
  } catch (error) {
    console.error('Erro ao criar O.S em lote:', error);
    res.status(500).json({ error: 'Erro ao importar ordens de serviço' });
  }
});

app.patch('/api/ordens-servico/:id', async (req, res) => {
  try {
    const os = await storage.updateOrdemServico(req.params.id, req.body);
    if (!os) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json(os);
  } catch (error) {
    console.error('Erro ao atualizar O.S:', error);
    res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
  }
});

app.delete('/api/ordens-servico/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteOrdemServico(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar O.S:', error);
    res.status(500).json({ error: 'Erro ao deletar ordem de serviço' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.get('/api/tecnicos', async (req, res) => {
  try {
    const tecnicos = await storage.getTecnicos();
    res.json(tecnicos);
  } catch (error) {
    console.error('Erro ao buscar técnicos:', error);
    res.status(500).json({ error: 'Erro ao buscar técnicos' });
  }
});

app.get('/api/dificuldades', async (req, res) => {
  try {
    const dificuldades = await storage.getDificuldades();
    res.json(dificuldades);
  } catch (error) {
    console.error('Erro ao buscar dificuldades:', error);
    res.status(500).json({ error: 'Erro ao buscar dificuldades' });
  }
});

app.get('/api/dificuldades/:ordemServicoId', async (req, res) => {
  try {
    const dificuldades = await storage.getDificuldadesByOS(req.params.ordemServicoId);
    res.json(dificuldades);
  } catch (error) {
    console.error('Erro ao buscar dificuldades:', error);
    res.status(500).json({ error: 'Erro ao buscar dificuldades' });
  }
});

app.post('/api/dificuldades', async (req, res) => {
  try {
    const dificuldade = await storage.createDificuldade(req.body as InsertDificuldade);
    res.status(201).json(dificuldade);
  } catch (error) {
    console.error('Erro ao criar dificuldade:', error);
    res.status(500).json({ error: 'Erro ao criar dificuldade' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
