// Script da área da empresa

document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    carregarProdutos();
    configurarEventos();
});

function verificarSessao() {
    const usuario = storage.obterSessao();
    if (!usuario || usuario.tipo !== 'empresa') {
        window.location.href = 'login.html';
    }
}

function configurarEventos() {
    const btnCadastro = document.getElementById('cadastroProdutoBtn');
    const modalProduto = document.getElementById('modalProduto');
    const modalEtiqueta = document.getElementById('modalEtiqueta');
    const closeBtns = document.querySelectorAll('.modal .close');
    const form = document.getElementById('produtoForm');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const closeLabelBtn = document.getElementById('closeLabelBtn');
    const downloadEtiquetaBtn = document.getElementById('downloadEtiquetaBtn');

    if (!btnCadastro) return;

    btnCadastro.addEventListener('click', () => {
        modalProduto.style.display = 'block';
    });

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

    if (downloadEtiquetaBtn) {
        downloadEtiquetaBtn.addEventListener('click', imprimirEtiqueta);
    }

    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codigo = document.getElementById('qrProdutoCodigo').textContent;
            if (codigo) {
                copiarCodigo(codigo);
            }
        });
    }

    if (closeLabelBtn) {
        closeLabelBtn.addEventListener('click', () => {
            if (modalEtiqueta) {
                modalEtiqueta.style.display = 'none';
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nomeProduto = document.getElementById('nomeProduto').value.trim();
        const usuario = storage.obterSessao();

        if (!nomeProduto) {
            alert('Nome do produto é obrigatório');
            return;
        }

        const novoProduto = {
            nome: nomeProduto,
            codigo: storage.gerarCodigo(),
            empresa: usuario.email,
            dono: null
        };

        storage.adicionarProduto(novoProduto);
        form.reset();
        modalProduto.style.display = 'none';
        carregarProdutos();
    });

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
    const produtos = storage.obterProdutosPorEmpresa(usuario.email);
    const container = document.getElementById('produtosList');

    if (!container) return;

    if (produtos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 1rem;">Nenhum produto cadastrado ainda. Clique em "Novo Produto" para começar.</p>';
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
                <strong>Dono:</strong> ${produto.dono || 'Nenhum'}
            </div>
            <div class="produto-info">
                <strong>Criado em:</strong> ${new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
            <div class="produto-actions">
                <button onclick="abrirModalEtiqueta('${produto.codigo}', '${produto.nome.replace(/'/g, "\\'") }', '${produto.empresa.replace(/'/g, "\\'")}')" class="btn btn-secondary btn-small">Gerar Etiqueta</button>
                <button onclick="transferirPropriedade('${produto.codigo}')" class="btn btn-primary btn-small">Transferir Propriedade</button>
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

function abrirModalEtiqueta(codigo, nomeProduto, empresaEmail) {
    const modalEtiqueta = document.getElementById('modalEtiqueta');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const qrProdutoCodigo = document.getElementById('qrProdutoCodigo');
    const qrProdutoNome = document.getElementById('qrProdutoNome');
    const qrProdutoEmpresa = document.getElementById('qrProdutoEmpresa');

    if (!modalEtiqueta || !qrCodeImage || !qrProdutoCodigo || !qrProdutoNome || !qrProdutoEmpresa) return;

    const empresaUsuario = storage.obterUsuarioPorEmail(empresaEmail);
    const nomeEmpresa = empresaUsuario?.empresa || empresaEmail;

    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(codigo)}`;
    qrProdutoNome.textContent = nomeProduto || '—';
    qrProdutoEmpresa.textContent = nomeEmpresa;
    qrProdutoCodigo.textContent = codigo;
    modalEtiqueta.style.display = 'block';
}

function imprimirEtiqueta() {
    const nomeProduto = document.getElementById('qrProdutoNome').textContent;
    const empresa = document.getElementById('qrProdutoEmpresa').textContent;
    const codigo = document.getElementById('qrProdutoCodigo').textContent;
    const qrSrc = document.getElementById('qrCodeImage').src;

    if (!nomeProduto || !empresa || !codigo || !qrSrc) return;

    const printWindow = window.open('', '_blank');
    const html = `
        <html>
            <head>
                <title>Etiqueta do Produto</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #fff; background-color: #0f172a; padding: 20px; text-align: center; }
                    .label { width: 100%; max-width: 420px; margin: auto; padding: 20px; border: 1px solid #fff; background-color: #020617; }
                    .label img { max-width: 180px; margin-bottom: 20px; }
                    .label h1 { font-size: 24px; margin-bottom: 10px; color: #fff; }
                    .label p { margin: 10px 0; font-size: 16px; color: #fff; }
                    .label .code { display: inline-block; padding: 10px 12px; margin-top: 8px; background: #111827; border: 1px solid #334155; font-family: monospace; color: #fff; }
                    .qr { margin: 20px 0; }
                    .qr img { width: 200px; height: 200px; }
                </style>
            </head>
            <body onload="window.print(); window.onafterprint = function(){ window.close(); }">
                <div class="label">
                    <img src="../images/logo_name.png" alt="Logo BrandQRAuth" />
                    <h1>Etiqueta do Produto</h1>
                    <p><strong>Produto:</strong> ${esc(nomeProduto)}</p>
                    <p><strong>Empresa:</strong> ${esc(empresa)}</p>
                    <p><strong>Código:</strong></p>
                    <div class="code">${esc(codigo)}</div>
                    <div class="qr"><img src="${qrSrc}" alt="QR Code do Produto" /></div>
                </div>
            </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
}

function esc(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function transferirPropriedade(codigo) {
    const emailDestinatario = prompt('Digite o email do usuário para transferir este produto:');
    const usuario = storage.obterSessao();

    if (!emailDestinatario) {
        return;
    }

    if (emailDestinatario === usuario.email) {
        alert('Informe um destinatário diferente de seu próprio email.');
        return;
    }

    const destinatario = storage.obterUsuarioPorEmail(emailDestinatario);
    if (!destinatario || destinatario.tipo !== 'usuario') {
        alert('Usuário destinatário não encontrado ou inválido.');
        return;
    }

    storage.atualizarProduto(codigo, { dono: emailDestinatario });
    alert('Propriedade transferida com sucesso!');
    carregarProdutos();
}