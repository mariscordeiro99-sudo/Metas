// Configuração - Detecta automaticamente o IP/host
const getApiUrl = () => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = '3000';
    return `${protocol}//${host}:${port}/api`;
};
const API_URL = getApiUrl();

// Elements
const container = document.getElementById('marcas-container');
const btnAdd = document.getElementById('btn-add-marca');
const btnCalcular = document.getElementById('btn-calcular');
const breakdownList = document.getElementById('breakdown-list');

// Formatadores
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const unitFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

// Funções Auxiliares
function formatValue(val, type) {
    if (type === 'units') return unitFormatter.format(Math.round(val)) + ' un';
    return currencyFormatter.format(val);
}

function formatCurrency(val) {
    return currencyFormatter.format(val);
}

// Salvar no banco de dados
async function salvarNoBanco(dados) {
    try {
        const response = await fetch(`${API_URL}/salvar-meta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (result.sucesso) {
            console.log(" Dados salvos com ID:", result.id);
            gerarRelatorio();
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
    }
}

// Gerar relatório
async function gerarRelatorio() {
    try {
        const response = await fetch(`${API_URL}/historico`);
        const historico = await response.json();
        console.log("📊 RELATÓRIO DE SIMULAÇÕES:");
        console.table(historico);
    } catch (error) {
        console.error("Erro ao buscar relatório:", error);
    }
}

// Setup para linhas de marcas
function setupMarcaRowListeners(row) {
    const toggles = row.querySelectorAll('.type-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            toggles.forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary');
                b.classList.add('text-secondary', 'hover:bg-surface-variant');
            });
            btn.classList.remove('text-secondary', 'hover:bg-surface-variant');
            btn.classList.add('bg-primary', 'text-on-primary');
            row.dataset.type = btn.dataset.type;
        });
    });

    row.querySelector('.btn-remove-marca').addEventListener('click', () => {
        row.remove();
    });
}

// Criar nova linha de marca
function createMarcaRow() {
    const div = document.createElement('div');
    div.className = 'marca-row bg-surface-container-low/30 p-4 border border-outline-variant rounded-lg space-y-4 animate-in slide-in-from-top-2';
    div.dataset.type = 'currency';
    div.innerHTML = `
        <div class="flex flex-wrap items-end gap-4">
            <div class="flex-1 min-w-[200px] flex flex-col gap-2">
                <label class="font-bold text-sm text-on-surface-variant">Nome da Marca</label>
                <input class="marca-nome w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ex: Puma" type="text"/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-bold text-sm text-on-surface-variant">Tipo</label>
                <div class="flex bg-surface-container rounded-lg p-1">
                    <button class="type-toggle px-4 py-2 text-xs font-bold rounded bg-primary text-on-primary transition-all" data-type="currency">R$</button>
                    <button class="type-toggle px-4 py-2 text-xs font-bold rounded text-secondary hover:bg-surface-variant transition-all" data-type="units">Un</button>
                </div>
            </div>
            <button class="btn-remove-marca p-3 text-error hover:bg-error-container rounded-lg transition-colors ml-auto">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label class="font-bold text-sm text-on-surface-variant">Meta Mensal</label>
                <input class="marca-valor w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Meta" type="number"/>
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-bold text-sm text-on-surface-variant">Vendido Atual</label>
                <input class="marca-vendido w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Atual" type="number" value="0"/>
            </div>
        </div>
    `;
    setupMarcaRowListeners(div);
    return div;
}

// Adicionar primeira marca
function initializeMarcas() {
    if (container.children.length === 0) {
        const defaultRow = document.createElement('div');
        defaultRow.className = 'marca-row bg-surface-container-low/30 p-4 border border-outline-variant rounded-lg space-y-4 animate-in slide-in-from-top-2';
        defaultRow.dataset.type = 'currency';
        defaultRow.innerHTML = `
            <div class="flex flex-wrap items-end gap-4">
                <div class="flex-1 min-w-[200px] flex flex-col gap-2">
                    <label class="font-bold text-sm text-on-surface-variant">Nome da Marca</label>
                    <input class="marca-nome w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ex: Nike" type="text" value="Nike"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-bold text-sm text-on-surface-variant">Tipo</label>
                    <div class="flex bg-surface-container rounded-lg p-1">
                        <button class="type-toggle px-4 py-2 text-xs font-bold rounded bg-primary text-on-primary transition-all" data-type="currency">R$</button>
                        <button class="type-toggle px-4 py-2 text-xs font-bold rounded text-secondary hover:bg-surface-variant transition-all" data-type="units">Un</button>
                    </div>
                </div>
                <button class="btn-remove-marca p-3 text-error hover:bg-error-container rounded-lg transition-colors ml-auto">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label class="font-bold text-sm text-on-surface-variant">Meta Mensal</label>
                    <input class="marca-valor w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Meta" type="number" value="100000"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-bold text-sm text-on-surface-variant">Vendido Atual</label>
                    <input class="marca-vendido w-full bg-surface-container-lowest border border-outline p-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Atual" type="number" value="24000"/>
                </div>
            </div>
        `;
        setupMarcaRowListeners(defaultRow);
        container.appendChild(defaultRow);
    }
}

// Calcular
function calcular() {
    // Inputs gerais
    const metaMensal = parseFloat(document.getElementById('input-meta-total').value) || 0;
    const diasRestantes = parseInt(document.getElementById('input-dias-restantes').value) || 1;
    const vendido = parseFloat(document.getElementById('input-vendido').value) || 0;

    // Inputs equipe
    const nBalconistas = parseInt(document.getElementById('input-balconistas').value) || 0;
    const nFarmaceuticos = parseInt(document.getElementById('input-farmaceuticos').value) || 0;
    const nOperadores = parseInt(document.getElementById('input-operadores').value) || 0;

    // Pesos
    const wBalconista = 1.0;
    const wFarmaceutico = 0.7;
    const wOperador = 0.3;


    const totalSomaPesos = (nBalconistas * wBalconista) + (nFarmaceuticos * wFarmaceutico) + (nOperadores * wOperador);

    const saldoRestante = metaMensal - vendido;
    const atingimento = metaMensal > 0 ? (vendido / metaMensal) * 100 : 0;
    const metaDiaLoja = diasRestantes > 0 ? saldoRestante / diasRestantes : 0;

    // Distribuição proporcional por peso da equipe
    const metaDiaPorPeso = totalSomaPesos > 0 ? metaDiaLoja / totalSomaPesos : 0;
    const metaMensalPorPeso = totalSomaPesos > 0 ? saldoRestante / totalSomaPesos : 0;

    // Metas por papel (por pessoa, por dia e por mês)
    const metaBalconista = metaDiaPorPeso * wBalconista;
    const metaFarmaceutico = metaDiaPorPeso * wFarmaceutico;
    const metaOperador = metaDiaPorPeso * wOperador;

    const metaMensalBalconista = metaMensalPorPeso * wBalconista;
    const metaMensalFarmaceutico = metaMensalPorPeso * wFarmaceutico;
    const metaMensalOperador = metaMensalPorPeso * wOperador;

    // Update resumo
    document.getElementById('resumo-meta-dia').textContent = formatCurrency(metaDiaLoja);
    document.getElementById('resumo-atingimento').textContent = atingimento.toFixed(1) + '%';
    document.getElementById('resumo-saldo').textContent = formatCurrency(saldoRestante);
    document.getElementById('resumo-meta-balconista').textContent = formatCurrency(metaBalconista);
    document.getElementById('resumo-meta-farmaceutico').textContent = formatCurrency(metaFarmaceutico);
    document.getElementById('resumo-meta-operador').textContent = formatCurrency(metaOperador);
    document.getElementById('resumo-meta-balconista-mensal').textContent = `Meta mensal por pessoa: ${formatCurrency(metaMensalBalconista)}`;
    document.getElementById('resumo-meta-farmaceutico-mensal').textContent = `Meta mensal por pessoa: ${formatCurrency(metaMensalFarmaceutico)}`;
    document.getElementById('resumo-meta-operador-mensal').textContent = `Meta mensal por pessoa: ${formatCurrency(metaMensalOperador)}`;

    // Breakdown por marca
    breakdownList.innerHTML = '';
    const marcaRows = document.querySelectorAll('.marca-row');
    const marcas = [];

    marcaRows.forEach(row => {
        const nome = row.querySelector('.marca-nome').value || 'Sem nome';
        const valor = parseFloat(row.querySelector('.marca-valor').value) || 0;
        const vendidoMarca = parseFloat(row.querySelector('.marca-vendido').value) || 0;
        const tipo = row.dataset.type;

        const metaMarcaDia = valor > 0 ? ((valor / metaMensal) * metaDiaLoja) : 0;
        const atingimentoMarca = valor > 0 ? (vendidoMarca / valor) * 100 : 0;
        const saldoMarca = valor - vendidoMarca;

        marcas.push({
            nome,
            valor,
            vendidoMarca,
            metaMarcaDia,
            atingimentoMarca,
            saldoMarca,
            tipo
        });

        const card = document.createElement('div');
        card.className = 'p-4 bg-surface-container-low border border-outline-variant rounded-lg';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-bold text-primary">${nome}</h3>
                <span class="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded">${tipo === 'units' ? 'Unidades' : 'Moeda'}</span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Meta Diária</p>
                    <h4 class="font-bold text-primary">${formatValue(metaMarcaDia, tipo)}</h4>
                </div>
                <div>
                    <p class="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Atingimento</p>
                    <h4 class="font-bold text-primary">${atingimentoMarca.toFixed(1)}%</h4>
                </div>
                <div>
                    <p class="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Saldo</p>
                    <h4 class="font-bold text-primary">${formatValue(saldoMarca, tipo)}</h4>
                </div>
                <div>
                    <p class="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Meta Mensal</p>
                    <h4 class="font-bold text-primary">${formatValue(valor, tipo)}</h4>
                </div>
            </div>
        `;
        breakdownList.appendChild(card);
    });

    // Salvar no banco
    const dadosParaSalvar = {
        meta_total: metaMensal,
        vendido: vendido,
        meta_diaria: metaDiaLoja
    };
    salvarNoBanco(dadosParaSalvar);
}

// Event Listeners
btnAdd.addEventListener('click', () => {
    container.appendChild(createMarcaRow());
});

btnCalcular.addEventListener('click', calcular);

// Initialize
initializeMarcas();

// SPA Navigation
const sectionOverview = document.getElementById('section-overview');
const sectionCalculadora = document.getElementById('section-calculadora');
const sectionMarcas = document.getElementById('section-marcas');
const sectionEquipe = document.getElementById('section-equipe');
const sectionRelatorios = document.getElementById('section-relatorios');

function showSection(section) {
    [sectionOverview, sectionCalculadora, sectionMarcas, sectionEquipe, sectionRelatorios].forEach((item) => {
        if (item) item.style.display = 'none';
    });
    if (section) section.style.display = '';
}

// Navegação topo
document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionOverview);
    renderDashboard();
});
document.getElementById('nav-simulador')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionCalculadora);
});
document.getElementById('nav-relatorios')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionRelatorios);
    renderRelatorios();
});

document.getElementById('side-overview')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionOverview);
    renderDashboard();
});
document.getElementById('side-calculadora')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionCalculadora);
});
document.getElementById('side-marcas')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionMarcas);
    renderMarcasResumo();
});
document.getElementById('side-equipe')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(sectionEquipe);
    renderEquipeResumo();
});

// Inicial: Calculadora
showSection(sectionCalculadora);

// Dashboard: indicadores simples
async function renderDashboard() {
    // Busca histórico do backend
    let historico = [];
    try {
        const response = await fetch(`${API_URL}/historico`);
        historico = await response.json();
    } catch (e) {}
    const totalSimulacoes = historico.length;
    const somaMetas = historico.reduce((acc, h) => acc + (h.meta_total || 0), 0);
    const somaVendidos = historico.reduce((acc, h) => acc + (h.vendido || 0), 0);
    const mediaAtingimento = historico.length > 0 ? (somaVendidos / somaMetas) * 100 : 0;
    document.getElementById('dashboard-indicadores').innerHTML = `
        <div class="p-6 bg-primary-container text-on-primary rounded-lg flex flex-col items-center">
            <span class="text-3xl font-bold">${totalSimulacoes}</span>
            <span class="text-sm mt-2">Simulações Realizadas</span>
        </div>
        <div class="p-6 bg-surface-container-high border border-outline-variant rounded-lg flex flex-col items-center">
            <span class="text-3xl font-bold">${formatCurrency(somaMetas)}</span>
            <span class="text-sm mt-2">Meta Total Acumulada</span>
        </div>
        <div class="p-6 bg-surface-container-high border border-outline-variant rounded-lg flex flex-col items-center">
            <span class="text-3xl font-bold">${mediaAtingimento.toFixed(1)}%</span>
            <span class="text-sm mt-2">Atingimento Médio</span>
        </div>
    `;
}

// Relatórios: tabela de histórico
function renderMarcasResumo() {
    const metaMensalTotal = parseFloat(document.getElementById('input-meta-total')?.value || 0);
    const diasRestantes = parseInt(document.getElementById('input-dias-restantes')?.value || 1, 10);
    const saldoRestante = metaMensalTotal > 0 ? metaMensalTotal - (parseFloat(document.getElementById('input-vendido')?.value || 0)) : 0;
    const metaDiaLoja = diasRestantes > 0 ? saldoRestante / diasRestantes : 0;

    const rows = Array.from(document.querySelectorAll('.marca-row'));
    const cards = rows.map((row) => {
        const nome = row.querySelector('.marca-nome')?.value || 'Sem nome';
        const valor = parseFloat(row.querySelector('.marca-valor')?.value) || 0;
        const vendido = parseFloat(row.querySelector('.marca-vendido')?.value) || 0;
        const tipo = row.dataset.type || 'currency';
        const metaDiariaMarca = valor > 0 ? (valor / Math.max(metaMensalTotal, 1)) * metaDiaLoja : 0;
        return `<article class="p-4 border border-outline-variant rounded-lg bg-surface-container-low">\
            <h3 class="text-lg font-bold text-primary">${nome}</h3>\
            <p class="text-sm text-secondary mt-1">Meta mensal: ${formatValue(valor, tipo)}</p>\
            <p class="text-sm text-secondary">Meta diária: ${formatValue(metaDiariaMarca, tipo)}</p>\
            <p class="text-sm text-secondary">Vendido: ${formatValue(vendido, tipo)}</p>\
            <p class="text-sm text-secondary">Saldo: ${formatValue(valor - vendido, tipo)}</p>\
        </article>`;
    }).join('');
    document.getElementById('marcas-resumo').innerHTML = cards || '<p class="text-secondary">Nenhuma marca adicionada.</p>';
}

function renderEquipeResumo() {
    const metaMensal = parseFloat(document.getElementById('input-meta-total')?.value || 0);
    const diasRestantes = parseInt(document.getElementById('input-dias-restantes')?.value || 1, 10);
    const vendido = parseFloat(document.getElementById('input-vendido')?.value || 0);
    const balconistas = parseInt(document.getElementById('input-balconistas')?.value || 0, 10);
    const farmac = parseInt(document.getElementById('input-farmaceuticos')?.value || 0, 10);
    const ops = parseInt(document.getElementById('input-operadores')?.value || 0, 10);

    const wBalconista = 1.0;
    const wFarmaceutico = 0.7;
    const wOperador = 0.3;
    const totalSomaPesos = (balconistas * wBalconista) + (farmac * wFarmaceutico) + (ops * wOperador);
    const saldoRestante = metaMensal - vendido;
    const metaDiaLoja = diasRestantes > 0 ? saldoRestante / diasRestantes : 0;
    const metaDiariaPorPeso = totalSomaPesos > 0 ? metaDiaLoja / totalSomaPesos : 0;
    const metaMensalPorPeso = totalSomaPesos > 0 ? saldoRestante / totalSomaPesos : 0;

    const metaBalconista = metaDiariaPorPeso * wBalconista;
    const metaFarmaceutico = metaDiariaPorPeso * wFarmaceutico;
    const metaOperador = metaDiariaPorPeso * wOperador;

    document.getElementById('equipe-resumo').innerHTML = `
        <article class="p-4 border border-outline-variant rounded-lg bg-surface-container-low"><h3 class="text-lg font-bold text-primary">Balconistas</h3><p class="text-sm text-secondary">${balconistas} pessoas</p><p class="text-sm text-secondary mt-1">Meta diária por pessoa: ${formatCurrency(metaBalconista)}</p><p class="text-sm text-secondary">Meta mensal por pessoa: ${formatCurrency(metaMensalPorPeso * wBalconista)}</p></article>
        <article class="p-4 border border-outline-variant rounded-lg bg-surface-container-low"><h3 class="text-lg font-bold text-primary">Farmacêuticos</h3><p class="text-sm text-secondary">${farmac} pessoas</p><p class="text-sm text-secondary mt-1">Meta diária por pessoa: ${formatCurrency(metaFarmaceutico)}</p><p class="text-sm text-secondary">Meta mensal por pessoa: ${formatCurrency(metaMensalPorPeso * wFarmaceutico)}</p></article>
        <article class="p-4 border border-outline-variant rounded-lg bg-surface-container-low"><h3 class="text-lg font-bold text-primary">Ops. Financeiros</h3><p class="text-sm text-secondary">${ops} pessoas</p><p class="text-sm text-secondary mt-1">Meta diária por pessoa: ${formatCurrency(metaOperador)}</p><p class="text-sm text-secondary">Meta mensal por pessoa: ${formatCurrency(metaMensalPorPeso * wOperador)}</p></article>
    `;
}

async function renderRelatorios() {
    let historico = [];
    try {
        const response = await fetch(`${API_URL}/historico`);
        historico = await response.json();
    } catch (e) {}
    if (!historico.length) {
        document.getElementById('relatorios-tabela').innerHTML = '<p class="text-secondary">Nenhum dado encontrado.</p>';
        return;
    }
    let html = '<table class="min-w-full text-sm"><thead><tr>' +
        '<th class="px-4 py-2 text-left">Data</th>' +
        '<th class="px-4 py-2 text-left">Meta Total</th>' +
        '<th class="px-4 py-2 text-left">Vendido</th>' +
        '<th class="px-4 py-2 text-left">Meta Diária</th>' +
        '</tr></thead><tbody>';
    for (const row of historico) {
        html += `<tr>
            <td class="border-t px-4 py-2">${row.data_calculo ? new Date(row.data_calculo).toLocaleString('pt-BR') : '-'}</td>
            <td class="border-t px-4 py-2">${formatCurrency(row.meta_total)}</td>
            <td class="border-t px-4 py-2">${formatCurrency(row.vendido)}</td>
            <td class="border-t px-4 py-2">${formatCurrency(row.meta_diaria)}</td>
        </tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('relatorios-tabela').innerHTML = html;
}
