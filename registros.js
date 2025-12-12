// =======================
// CONFIGURAÇÕES
// =======================
const STORAGE_KEY = "registrosPonto_v1";

// =======================
// INICIALIZAÇÃO
// =======================
document.addEventListener("DOMContentLoaded", () => {
    // Botões de meses
    const botoes = document.querySelectorAll(".mes-btn");
    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            const mesSelecionado = btn.getAttribute("data-mes");
            renderizarPorMes(mesSelecionado);
        });
    });

    // Inicialmente, não mostrar nenhum registro
document.getElementById("registroAgrupado").innerHTML = "";

});

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
// FUNÇÃO: RENDERIZAR POR MÊS
// =======================
function renderizarPorMes(mesISO) {
    const area = document.getElementById("registroAgrupado");
    const todos = carregarRegistros();

    // Filtrar registros do mês selecionado
    const registrosMes = todos.filter(r => r.iso.slice(0,7) === mesISO);

    if (registrosMes.length === 0) {
        area.innerHTML = "<p>Nenhum registro neste mês.</p>";
        return;
    }

    // Agrupar por data
    const grupos = {};
    registrosMes.forEach(r => {
        const dataISO = r.iso.slice(0,10);
        if (!grupos[dataISO]) grupos[dataISO] = [];
        grupos[dataISO].push(r);
    });

    // Ordenar datas do mais recente ao mais antigo
    const datasOrdenadas = Object.keys(grupos).sort((a,b) => b.localeCompare(a));

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

    datasOrdenadas.forEach(dataISO => {
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

function toggleMenu() {
    const box = document.getElementById("menuBox");
    const icon = document.querySelector(".menu-icon");

    if (box.style.left === "0px") {
        // fechar menu
        box.style.left = "-240px";
        icon.classList.remove("menu-aberto");
    } else {
        // abrir menu
        box.style.left = "0px";
        icon.classList.add("menu-aberto");
    }
}
