// =======================
// CONFIGURAÇÕES
// =======================
const STORAGE_KEY = "registrosPonto_v1";
const STORAGE_TIPO = "tipoAtualPonto_v1";

// Tipo atual alternando entre Entrada/Saída
let tipoAtual = localStorage.getItem(STORAGE_TIPO) || "Entrada";


// =======================
// INICIALIZAÇÃO
// =======================
document.addEventListener("DOMContentLoaded", () => {

    // Botão
    const btn = document.getElementById("btnPonto");
    if (btn) btn.addEventListener("click", registrarPonto);

    // Relógio
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);

    // Render inicial dos registros
    renderizarAgrupado();
});


// =======================
// FUNÇÃO: REGISTRAR PONTO
// =======================
function registrarPonto() {
    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR");
    const iso = agora.toISOString();

    const registro = {
        tipo: tipoAtual,
        hora: hora,
        iso: iso
    };

    const lista = carregarRegistros();
    lista.push(registro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    // Alternar Entrada / Saída
    tipoAtual = tipoAtual === "Entrada" ? "Saída" : "Entrada";
    localStorage.setItem(STORAGE_TIPO, tipoAtual);

    // Atualiza tela
    renderizarAgrupado();
}


// =======================
// FUNÇÃO: CARREGAR REGISTROS
// =======================
function carregarRegistros() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}


// =======================
// FUNÇÃO: AGRUPAR E MOSTRAR NA TELA
// =======================
function renderizarAgrupado() {
    const area = document.getElementById("registroAgrupado");
    if (!area) return;

    const todos = carregarRegistros();
    area.innerHTML = "";

    if (todos.length === 0) {
        area.innerHTML = "<p>Nenhum registro ainda.</p>";
        return;
    }

    // Agrupar por data
    const grupos = {};

    todos.forEach(r => {
        const dataISO = r.iso.slice(0,10);
        if (!grupos[dataISO]) grupos[dataISO] = [];
        grupos[dataISO].push(r);
    });

    // Montar tabela
    let html = `
        <table class="tabela-ponto">
            <tr>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Entrada</th>
                <th>Saída</th>
            </tr>
    `;

    // Obter todas as datas e ordenar do mais recente para o mais antigo
const datas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

datas.forEach(dataISO => {
    const [ano, mes, dia] = dataISO.split("-");
    const registros = grupos[dataISO];

    // Distribuir em colunas por ordem registrada
    const colunas = ["", "", "", ""]; // até 4 registros no dia
    registros.forEach((r, index) => {
        if (index < 4) colunas[index] = r.hora;
    });

    html += `
        <tr>
            <td>${dia}/${mes}/${ano}</td>
            <td>${colunas[0] || "-"}</td>
            <td>${colunas[1] || "-"}</td>
            <td>${colunas[2] || "-"}</td>
            <td>${colunas[3] || "-"}</td>
        </tr>
    `;
});


    html += "</table>";
    area.innerHTML = html;
}



// =======================
// FUNÇÃO: RELÓGIO
// =======================
function atualizarRelogio() {
    const agora = new Date();
    document.getElementById("relogioAtual").textContent =
        agora.toLocaleTimeString("pt-BR", { hour12: false });
}

function toggleMenu() {
    const box = document.getElementById("menuBox");
    const icon = document.querySelector(".menu-icon");

    if (box.style.left === "0px") {
        // fechar menu
        box.style.left = "-240px";
        icon.classList.remove("menu-aberto"); // ícone volta a preto
    } else {
        // abrir menu
        box.style.left = "0px";
        icon.classList.add("menu-aberto"); // ícone permanece vermelho
    }
}
