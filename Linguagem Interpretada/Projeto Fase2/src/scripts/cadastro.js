
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    const mensagem = document.getElementById('mensagem');
    const tipoRadios = document.querySelectorAll('input[name="tipoConta"]');
    const empresaNomeGroup = document.getElementById('empresaNomeGroup');

    if (!form) return;

    tipoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'empresa' && radio.checked) {
                empresaNomeGroup.style.display = 'block';
            } else if (radio.value === 'usuario' && radio.checked) {
                empresaNomeGroup.style.display = 'none';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const tipoConta = document.querySelector('input[name="tipoConta"]:checked').value;
        const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
        const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmaSenha = document.getElementById('confirmaSenha').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const cpfCnpj = document.getElementById('cpfCnpj').value.trim();

        if (!email.includes('@')) {
            mostrarMensagem('Email inválido', 'erro');
            return;
        }

        if (!nomeCompleto) {
            mostrarMensagem('Nome completo é obrigatório', 'erro');
            return;
        }

        if (senha.length < 6) {
            mostrarMensagem('Senha deve ter mínimo 6 caracteres', 'erro');
            return;
        }

        if (senha !== confirmaSenha) {
            mostrarMensagem('Senhas não conferem', 'erro');
            return;
        }

        if (!dataNascimento) {
            mostrarMensagem('Data de nascimento é obrigatória', 'erro');
            return;
        }

        if (!cpfCnpj) {
            mostrarMensagem('CPF/CNPJ é obrigatório', 'erro');
            return;
        }

        if (tipoConta === 'usuario' && cpfCnpj.length !== 11) {
            mostrarMensagem('CPF deve conter 11 dígitos', 'erro');
            return;
        }

        if (tipoConta === 'empresa' && cpfCnpj.length !== 14) {
            mostrarMensagem('CNPJ deve conter 14 dígitos', 'erro');
            return;
        }

        if (tipoConta === 'empresa' && !nomeEmpresa) {
            mostrarMensagem('Nome da empresa é obrigatório para cadastro empresarial', 'erro');
            return;
        }

        if (storage.obterUsuarioPorEmail(email)) {
            mostrarMensagem('Email já cadastrado', 'erro');
            return;
        }

        const novoUsuario = {
            email,
            senha,
            tipo: tipoConta,
            nome: nomeCompleto,
            dataNascimento,
            cpfCnpj
        };

        if (tipoConta === 'empresa') {
            novoUsuario.empresa = nomeEmpresa;
        }

        storage.adicionarUsuario(novoUsuario);
        mostrarMensagem('Cadastro realizado com sucesso!', 'sucesso');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = `mensagem ${tipo}`;
    }
});