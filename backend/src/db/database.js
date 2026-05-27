const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conecta ao arquivo de banco de dados
const dbPath = path.join(__dirname, '../../simulacoes.db');
const db = new sqlite3.Database(dbPath);

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

module.exports = db;
