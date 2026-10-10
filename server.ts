import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.js';
import { createApp } from './server/app.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  try {
    await connectDB();
  } catch (dbErr: any) {
    console.error('[ChaiChukta] DB connection warning:', dbErr?.message || dbErr);
  }

  const app = createApp();

  if (process.env.NODE_ENV === 'production') {
    const express = (await import('express')).default;
    const path = (await import('path')).default;
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ChaiChukta] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ChaiChukta] Fatal startup error:', err);
  process.exit(1);
});
