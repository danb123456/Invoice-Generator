import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const db = new Database('database.sqlite');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS recurring_invoices (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Clients
  app.get('/api/clients', async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('clients').select('data');
      if (error) return res.status(500).json({ error: error.message });
      res.json(data.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : r.data));
    } else {
      const rows = db.prepare('SELECT data FROM clients').all() as { data: string }[];
      res.json(rows.map(r => JSON.parse(r.data)));
    }
  });

  app.post('/api/clients', async (req, res) => {
    const client = req.body;
    if (supabase) {
      const { error } = await supabase.from('clients').upsert({ id: client.id, data: client });
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } else {
      db.prepare('INSERT OR REPLACE INTO clients (id, data) VALUES (?, ?)').run(client.id, JSON.stringify(client));
      res.json({ success: true });
    }
  });

  app.delete('/api/clients/:id', async (req, res) => {
    if (supabase) {
      const { error } = await supabase.from('clients').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } else {
      db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    }
  });

  // Recurring Invoices
  app.get('/api/recurring', async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('recurring_invoices').select('data');
      if (error) return res.status(500).json({ error: error.message });
      res.json(data.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : r.data));
    } else {
      const rows = db.prepare('SELECT data FROM recurring_invoices').all() as { data: string }[];
      res.json(rows.map(r => JSON.parse(r.data)));
    }
  });

  app.post('/api/recurring', async (req, res) => {
    const profile = req.body;
    if (supabase) {
      const { error } = await supabase.from('recurring_invoices').upsert({ id: profile.id, data: profile });
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } else {
      db.prepare('INSERT OR REPLACE INTO recurring_invoices (id, data) VALUES (?, ?)').run(profile.id, JSON.stringify(profile));
      res.json({ success: true });
    }
  });

  app.delete('/api/recurring/:id', async (req, res) => {
    if (supabase) {
      const { error } = await supabase.from('recurring_invoices').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } else {
      db.prepare('DELETE FROM recurring_invoices WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
