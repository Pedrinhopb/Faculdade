// Gerencia toda a persistência de dados no localStorage

class StorageManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Inicializar usuários
        if (!localStorage.getItem('usuarios')) {
            const usuarios = [
                {
                    id: 1,
                    email: 'admin@empresa.com',
                    senha: '123456',
                    tipo: 'empresa',
                    nome: 'Administrador Gucci',
                    dataNascimento: '1990-01-01',
                    cpfCnpj: '12.345.678/0001-90',
                    empresa: 'Gucci'
                },
                {
                    id: 2,
                    email: 'usuario@usuario.com',
                    senha: '123456',
                    tipo: 'usuario',
                    nome: 'João Silva',
                    dataNascimento: '1995-05-15',
                    cpfCnpj: '123.456.789-00'
                },
                {
                    id: 3,
                    email: 'usuario2@usuario.com',
                    senha: '123456',
                    tipo: 'usuario',
                    nome: 'Maria Santos',
                    dataNascimento: '1996-06-20',
                    cpfCnpj: '234.567.890-12'
                }
            ];
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Inicializar produtos
        if (!localStorage.getItem('produtos')) {
            const produtos = [
                {
                    id: 1,
                    nome: 'Bolsa Gucci Marmont Matelassê',
                    codigo: 'PROD-2026-001-ABC123DEF456',
                    empresa: 'admin@empresa.com',
                    dono: null,
                    dataCriacao: new Date().toISOString()
                },
                {
                    id: 2,
                    nome: 'Bolsa Gucci Bamboo Handle',
                    codigo: 'PROD-2026-002-GHI789JKL012',
                    empresa: 'admin@empresa.com',
                    dono: null,
                    dataCriacao: new Date().toISOString()
                },
                {
                    id: 3,
                    nome: 'Bolsa Gucci Jackie 1961',
                    codigo: 'PROD-2026-003-MNO345PQR678',
                    empresa: 'admin@empresa.com',
                    dono: 'usuario@usuario.com',
                    dataCriacao: new Date().toISOString()
                },
                {
                    id: 4,
                    nome: 'Bolsa Gucci Dionysus GG',
                    codigo: 'PROD-2026-004-QWE456ASD789',
                    empresa: 'admin@empresa.com',
                    dono: null,
                    dataCriacao: new Date().toISOString()
                },
                {
                    id: 5,
                    nome: 'Bolsa Gucci Ophidia GG',
                    codigo: 'PROD-2026-005-ZXC123VBN456',
                    empresa: 'admin@empresa.com',
                    dono: null,
                    dataCriacao: new Date().toISOString()
                },
                {
                    id: 6,
                    nome: 'Bolsa Gucci Horsebit 1955',
                    codigo: 'PROD-2026-006-RTY789FGH012',
                    empresa: 'admin@empresa.com',
                    dono: null,
                    dataCriacao: new Date().toISOString()
                }
            ];
            localStorage.setItem('produtos', JSON.stringify(produtos));
        }
    }

    // Usuários
    obterUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    }

    salvarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    adicionarUsuario(usuario) {
        const usuarios = this.obterUsuarios();
        usuario.id = Math.max(...usuarios.map(u => u.id), 0) + 1;
        usuarios.push(usuario);
        this.salvarUsuarios(usuarios);
        return usuario;
    }

    obterUsuarioPorEmail(email) {
        if (!email) return null;
        const normalizedEmail = email.toString().trim().toLowerCase();
        return this.obterUsuarios().find(u => u.email.toString().trim().toLowerCase() === normalizedEmail);
    }

    // Produtos
    obterProdutos() {
        return JSON.parse(localStorage.getItem('produtos')) || [];
    }

    salvarProdutos(produtos) {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    adicionarProduto(produto) {
        const produtos = this.obterProdutos();
        produto.id = Math.max(...produtos.map(p => p.id), 0) + 1;
        produto.dataCriacao = new Date().toISOString();
        produtos.push(produto);
        this.salvarProdutos(produtos);
        return produto;
    }

    obterProdutoPorCodigo(codigo) {
        return this.obterProdutos().find(p => p.codigo === codigo);
    }

    obterProdutosPorDono(email) {
        if (!email) return [];
        const normalizedEmail = email.toString().trim().toLowerCase();
        return this.obterProdutos().filter(p => p.dono && p.dono.toString().trim().toLowerCase() === normalizedEmail);
    }

    obterProdutosPorEmpresa(empresa) {
        if (!empresa) return [];
        const normalizedEmail = empresa.toString().trim().toLowerCase();
        return this.obterProdutos().filter(p => p.empresa && p.empresa.toString().trim().toLowerCase() === normalizedEmail);
    }

    atualizarProduto(codigo, atualizacoes) {
        const produtos = this.obterProdutos();
        const produto = produtos.find(p => p.codigo === codigo);
        if (produto) {
            Object.assign(produto, atualizacoes);
            this.salvarProdutos(produtos);
        }
        return produto;
    }

    removerProduto(codigo) {
        const produtos = this.obterProdutos();
        const index = produtos.findIndex(p => p.codigo === codigo);
        if (index !== -1) {
            produtos.splice(index, 1);
            this.salvarProdutos(produtos);
            return true;
        }
        return false;
    }

    // Sessão
    salvarSessao(usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }

    obterSessao() {
        return JSON.parse(localStorage.getItem('usuarioLogado'));
    }

    limparSessao() {
        localStorage.removeItem('usuarioLogado');
    }

    gerarCodigo() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15).toUpperCase();
        const numero = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        return `PROD-${new Date().getFullYear()}-${numero}-${random}`;
    }
}

// Instância global
const storage = new StorageManager();