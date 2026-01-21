// =======================
// CONFIGURAÇÕES
// =======================
const STORAGE_KEY = "registrosPonto_v1";

// =======================
// INICIALIZAÇÃO
// =======================
document.addEventListener("DOMContentLoaded", () => {
    gerarBotoesDeMes();
    document.getElementById("registroAgrupado").innerHTML = "";
});

// =======================
// CARREGAR REGISTROS
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
// FORMATAR HORA (sem segundos)
// =======================
function formatarHora(hora) {
    return hora ? hora.slice(0, 5) : "-";
}

// =======================
// GERAR BOTÕES DE MESES
// =======================
function gerarBotoesDeMes() {
    const container = document.getElementById("listaMeses");
    const registros = carregarRegistros();

    container.innerHTML = "";

    if (registros.length === 0) {
        container.innerHTML = "<p>Nenhum registro encontrado.</p>";
        return;
    }

    const meses = [...new Set(registros.map(r => r.iso.slice(0, 7)))]
        .sort((a, b) => b.localeCompare(a));

    meses.forEach(mesISO => {
        const [ano, mes] = mesISO.split("-");
        const btn = document.createElement("button");
        btn.className = "mes-btn";
        btn.textContent = `${nomeMesPt(mes)} | ${ano}`;
        btn.onclick = () => renderizarPorMes(mesISO);
        container.appendChild(btn);
    });
}

// =======================
// NOME DO MÊS
// =======================
function nomeMesPt(mes) {
    const nomes = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL",
        "MAIO", "JUNHO", "JULHO", "AGOSTO",
        "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];
    return nomes[parseInt(mes) - 1];
}

// =======================
// RENDERIZAR REGISTROS POR MÊS
// =======================
function renderizarPorMes(mesISO) {
    const area = document.getElementById("registroAgrupado");
    const listaMeses = document.getElementById("listaMeses");
    const barraMes = document.getElementById("barraMes");
    const tituloMes = document.getElementById("tituloMes");

    const todos = carregarRegistros();
    const registrosMes = todos.filter(r => r.iso.slice(0, 7) === mesISO);

    if (registrosMes.length === 0) {
        area.innerHTML = "<p>Nenhum registro neste mês.</p>";
        return;
    }

    listaMeses.style.display = "none";
    barraMes.style.display = "flex";

    const [ano, mes] = mesISO.split("-");
    tituloMes.textContent = `Registros de ${nomeMesPt(mes)} | ${ano}`;

    const grupos = {};
    registrosMes.forEach(r => {
        const dataISO = r.iso.slice(0, 10);
        if (!grupos[dataISO]) grupos[dataISO] = [];
        grupos[dataISO].push(r);
    });

    const datasOrdenadas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

    let html = `
        <table class="tabela-ponto">
            <tr>
                <th>Data</th>
                <th>E1</th><th>S1</th>
                <th>E2</th><th>S2</th>
                <th>E3</th><th>S3</th>
                <th>E4</th><th>S4</th>
                <th>Ações</th>
            </tr>
    `;

    datasOrdenadas.forEach(dataISO => {
        const [ano, mes, dia] = dataISO.split("-");
        const registros = grupos[dataISO];

        const entradas = registros.filter(r => r.tipo === "Entrada").map(r => formatarHora(r.hora));
        const saidas   = registros.filter(r => r.tipo === "Saída").map(r => formatarHora(r.hora));

        html += `<tr data-data="${dataISO}"><td>${dia}/${mes}/${ano}</td>`;

        for (let i = 0; i < 4; i++) {
            html += `<td>${entradas[i] || "-"}</td>`;
            html += `<td>${saidas[i] || "-"}</td>`;
        }

        html += `
            <td class="acoes">
                <button class="btn-edit" onclick="editarLinha(this)">⚙️</button>
                <button class="btn-save" onclick="salvarLinha(this)" style="display:none;">✅</button>
            </td>
        </tr>`;
    });

    html += "</table>";
    area.innerHTML = html;
}

// =======================
// EDITAR UMA DATA
// =======================
function editarLinha(btn) {
    const tr = btn.closest("tr");
    const tds = tr.querySelectorAll("td");

    for (let i = 1; i <= 8; i++) {
        if (tds[i].innerText !== "-") {
            tds[i].innerHTML = `<input type="time" value="${tds[i].innerText}">`;
        }
    }

    tr.querySelector(".btn-edit").style.display = "none";
    tr.querySelector(".btn-save").style.display = "inline-block";
}

// =======================
// SALVAR AJUSTE
// =======================
function salvarLinha(btn) {
    const tr = btn.closest("tr");
    const inputs = tr.querySelectorAll("input");

    inputs.forEach(input => {
        input.parentElement.innerText = input.value || "-";
    });

    tr.querySelector(".btn-edit").style.display = "inline-block";
    tr.querySelector(".btn-save").style.display = "none";
}

// =======================
// VOLTAR PARA MESES
// =======================
function voltarMeses() {
    document.getElementById("registroAgrupado").innerHTML = "";
    document.getElementById("barraMes").style.display = "none";
    document.getElementById("listaMeses").style.display = "block";
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
