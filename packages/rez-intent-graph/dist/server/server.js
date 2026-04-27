// ── Intent Graph Server ───────────────────────────────────────────────────────────
// Standalone Express server for RTMN Commerce Memory Intent Graph
import express from 'express';
import intentRouter from '../api/intent.routes.js';
import commerceMemoryRouter from '../api/commerce-memory.routes.js';
const app = express();
// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
// CORS for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-cron-secret, x-user-id');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
});
// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        service: 'intent-graph',
        timestamp: new Date().toISOString(),
    });
});
// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/intent', intentRouter);
app.use('/api/commerce-memory', commerceMemoryRouter);
// ── Error Handler ─────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[Error]', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});
// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[Intent Graph] Server running on port ${PORT}`);
    console.log(`[Intent Graph] Health check: http://localhost:${PORT}/health`);
    console.log(`[Intent Graph] Intent API: http://localhost:${PORT}/api/intent`);
    console.log(`[Intent Graph] Commerce Memory API: http://localhost:${PORT}/api/commerce-memory`);
});
export default app;
//# sourceMappingURL=server.js.map