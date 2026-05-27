const express = require('express');
const cors = require('cors');
const metasRoutes = require('./routes/metas');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', metasRoutes);

const PORT = process.env.PORT || 3000;
const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando!`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Rede: http://${localIP}:${PORT}`);
    console.log(`   Acesse no celular: http://${localIP}:8000`);
});
