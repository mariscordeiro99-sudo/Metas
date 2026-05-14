const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Conecta ao arquivo de banco de dados
const db = new sqlite3.Database('./simulacoes.db');

// Cria a tabela se ela não existir
db.run(`
    CREATE TABLE IF NOT EXISTS historico_metas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meta_total REAL,
        vendido REAL,
        meta_diaria REAL,
        data_calculo DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Rota para buscar o histórico (Relatório)
app.get('/api/historico', (req, res) => {
    db.all('SELECT * FROM historico_metas ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Rota para salvar uma nova meta
app.post('/api/salvar-meta', (req, res) => {
    const { meta_total, vendido, meta_diaria } = req.body;
    db.run(
        `INSERT INTO historico_metas (meta_total, vendido, meta_diaria) VALUES (?, ?, ?)`,
        [meta_total, vendido, meta_diaria],
        function(err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ sucesso: true, id: this.lastID });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));