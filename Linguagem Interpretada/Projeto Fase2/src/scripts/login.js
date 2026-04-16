
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const mensagem = document.getElementById('mensagem');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        if (!email.includes('@')) {
            mostrarMensagem('Email inválido', 'erro');
            return;
        }

        if (senha.length < 6) {
            mostrarMensagem('Senha deve ter mínimo 6 caracteres', 'erro');
            return;
        }

        const usuario = storage.obterUsuarioPorEmail(email);

        if (!usuario) {
            mostrarMensagem('Usuário não encontrado', 'erro');
            return;
        }

        if (usuario.senha !== senha) {
            mostrarMensagem('Senha incorreta', 'erro');
            return;
        }

        storage.salvarSessao(usuario);
        mostrarMensagem('Login realizado com sucesso!', 'sucesso');

        setTimeout(() => {
            if (usuario.tipo === 'empresa') {
                window.location.href = 'empresa.html';
            } else {
                window.location.href = 'usuario.html';
            }
        }, 1500);
    });

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = `mensagem ${tipo}`;
    }
});