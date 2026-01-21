document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnLogin");
    btn.addEventListener("click", login);
});

function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    // Usuários válidos
    const usuarios = {
        "eduarda@sm.com.br": "eduarda123", // alterado
        "usuario@sm.com.br": "usuario123", // nova
        "alicia@sm.com.br": "alicia123",
        "rodrigo@sm.com.br": "rodrigo123"   // nova
    };

    if (usuarios[email] && usuarios[email] === senha) {
        erro.textContent = "";
        window.location.href = "ponto.html"; // vai para a próxima tela
    } else {
        erro.textContent = "E-mail ou senha incorretos";
    }
}

function toggleSenha() {
    const senhaInput = document.getElementById("senha");
    const toggleBtn = document.querySelector(".toggle-senha");

    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        toggleBtn.textContent = "Ocultar";
    } else {
        senhaInput.type = "password";
        toggleBtn.textContent = "Mostrar";
    }
}
