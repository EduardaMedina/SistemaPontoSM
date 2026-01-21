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

    // 👇 MÊS ATUAL AUTOMÁTICO
    atualizarTituloMesAtual();
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

    // 🔎 Estamos na tela ponto?
    const ehTelaPonto = document.body.contains(
        document.querySelector(".ponto-container")
    );

    // =========================
    // TELA PONTO → CARDS (HOJE)
    // =========================
    if (ehTelaPonto) {
        const hojeISO = new Date().toISOString().slice(0, 10);

        todos
            .filter(r => r.iso.slice(0, 10) === hojeISO)
            .reverse()
            .forEach(r => {

                const data = r.iso.slice(0, 10).split("-");
                const dataFormatada = `${data[2]}/${data[1]}/${data[0]}`;

                const card = document.createElement("div");
                card.className = "registro-card";
                card.textContent = `${dataFormatada} - ${r.tipo}: ${r.hora}`;

                area.appendChild(card);
            });

        if (area.children.length === 0) {
            area.innerHTML = "<p>Nenhum ponto registrado hoje.</p>";
        }

        return;
    }

    // =========================
    // OUTRAS TELAS → TABELA
    // =========================
    const grupos = {};

    todos.forEach(r => {
        const dataISO = r.iso.slice(0, 10);
        if (!grupos[dataISO]) grupos[dataISO] = [];
        grupos[dataISO].push(r);
    });

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

    const datas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

    datas.forEach(dataISO => {
        const [ano, mes, dia] = dataISO.split("-");
        const registros = grupos[dataISO];

        const colunas = ["", "", "", ""];
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


// =======================
// FUNÇÃO: MÊS ATUAL NO TÍTULO
// =======================
function atualizarTituloMesAtual() {
    const titulo = document.getElementById("tituloMesAtual");
    if (!titulo) return;

    const agora = new Date();
    const mes = agora.getMonth();
    const ano = agora.getFullYear();

    const meses = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL",
        "MAIO", "JUNHO", "JULHO", "AGOSTO",
        "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    titulo.textContent = `${meses[mes]} / ${ano}`;
}


// =======================
// MENU
// =======================
function toggleMenu() {
    const box = document.getElementById("menuBox");
    const icon = document.querySelector(".menu-icon");

    if (box.style.left === "0px") {
        box.style.left = "-240px";
        icon.classList.remove("menu-aberto");
    } else {
        box.style.left = "0px";
        icon.classList.add("menu-aberto");
    }
}

function sair() {
    // Aqui podemos apenas voltar para a tela de login
    window.location.href = "login.html";
}
