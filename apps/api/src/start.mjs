import { createApp } from './server.mjs';
try { process.loadEnvFile('../../.env'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const app = createApp();
const port = Number(process.env.PORT || 4000);
app.server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`ABC API listening on ${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { app.server.close(() => { app.close(); process.exit(0); }); });
