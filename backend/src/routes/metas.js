const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Rota para buscar o histórico (Relatório)
router.get('/historico', (req, res) => {
    db.all('SELECT * FROM historico_metas ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Rota para salvar uma nova meta
router.post('/salvar-meta', (req, res) => {
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

module.exports = router;
