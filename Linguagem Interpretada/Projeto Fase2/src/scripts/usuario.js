// Script da área do usuário

document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    exibirInfoUsuario();
    carregarProdutos();
    configurarEventos();
});

function verificarSessao() {
    const usuario = storage.obterSessao();
    if (!usuario || usuario.tipo === 'empresa') {
        window.location.href = 'login.html';
    }
}

function exibirInfoUsuario() {
    const usuario = storage.obterSessao();
    const emailElement = document.getElementById('usuarioEmail');
    if (emailElement) {
        emailElement.textContent = `Email: ${usuario.email}`;
    }
}

function configurarEventos() {
    const btnTransferir = document.getElementById('transferirProdutoBtn');
    const modalTransferir = document.getElementById('modalTransferir');
    const closeBtns = document.querySelectorAll('.close');

    // Modal Transferir
    if (btnTransferir) {
        btnTransferir.addEventListener('click', () => {
            modalTransferir.style.display = 'block';
        });
    }

    // Fechar modais
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Formulário Transferir
    document.getElementById('transferirForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('codigoTransferencia').value.trim();
        const emailDestinatario = document.getElementById('emailDestinatario').value.trim();
        const usuario = storage.obterSessao();

        if (!codigo || !emailDestinatario) {
            alert('Preencha todos os campos');
            return;
        }

        const produto = storage.obterProdutoPorCodigo(codigo);

        if (!produto) {
            alert('Produto não encontrado!');
            return;
        }

        if (produto.dono !== usuario.email) {
            alert('Este produto não pertence a você!');
            return;
        }

        if (emailDestinatario === usuario.email) {
            alert('Não é possível transferir para si mesmo!');
            return;
        }

        const destinatario = storage.obterUsuarioPorEmail(emailDestinatario);

        if (!destinatario) {
            alert('Usuário destinatário não encontrado!');
            return;
        }

        storage.atualizarProduto(codigo, { dono: emailDestinatario });
        alert('Produto transferido com sucesso!');
        document.getElementById('transferirForm').reset();
        modalTransferir.style.display = 'none';
        carregarProdutos();
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            storage.limparSessao();
            window.location.href = '../../index.html';
        });
    }
}

function carregarProdutos() {
    const usuario = storage.obterSessao();
    const produtos = storage.obterProdutosPorDono(usuario.email);
    const container = document.getElementById('produtosList');

    if (!container) return;

    if (produtos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 1rem;">Você não possui produtos ainda. Use o botão de transferir para enviar o produto a outro usuário ou aguarde a transferência de um proprietário.</p>';
        return;
    }

    container.innerHTML = produtos.map(produto => `
        <div class="produto-card">
            <h3>${produto.nome}</h3>
            <div class="produto-info">
                <strong>Código:</strong>
                <code>${produto.codigo}</code>
            </div>
            <div class="produto-info">
                <strong>Empresa:</strong> ${produto.empresa}
            </div>
            <div class="produto-info">
                <strong>Adquirido em:</strong> ${new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
            <div class="produto-actions">
                <button onclick="copiarCodigo('${produto.codigo}')" class="btn btn-secondary btn-small">Copiar</button>
            </div>
        </div>
    `).join('');
}

function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        alert('Código copiado para a área de transferência!');
    }).catch(() => {
        alert('Erro ao copiar código');
    });
}