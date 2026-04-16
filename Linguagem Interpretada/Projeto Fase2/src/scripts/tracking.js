// Sistema de rastreamento de produtos

class ProductTracking {
    constructor() {
        this.initializeTracking();
    }

    initializeTracking() {
        console.log('Sistema de rastreamento inicializado');
    }

    // Obter histórico de um produto
    obterHistorico(codigo) {
        const produtos = storage.obterProdutos();
        const produto = produtos.find(p => p.codigo === codigo);
        
        if (!produto) {
            return null;
        }

        return {
            codigo: produto.codigo,
            nome: produto.nome,
            empresa: produto.empresa,
            donoPrimeira: produto.empresa,
            donoAtual: produto.dono,
            dataCriacao: produto.dataCriacao,
            historico: [
                {
                    evento: 'Produto Criado',
                    data: produto.dataCriacao,
                    responsavel: produto.empresa
                },
                ...(produto.dono ? [{
                    evento: 'Produto Transferido',
                    data: new Date().toISOString(),
                    responsavel: produto.dono
                }] : [])
            ]
        };
    }

    // Listar todos os produtos com rastreamento
    listarProdutosRastreados() {
        return storage.obterProdutos().map(produto => ({
            codigo: produto.codigo,
            nome: produto.nome,
            empresa: produto.empresa,
            donoPrimeira: produto.empresa,
            donoAtual: produto.dono,
            status: produto.dono ? 'Transferido' : 'Disponível'
        }));
    }

    // Gerar relatório de rastreabilidade
    gerarRelatorio(numeroDias = 30) {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - numeroDias);

        const produtos = storage.obterProdutos();
        const produtosRelatorio = produtos.filter(p => 
            new Date(p.dataCriacao) >= dataLimite
        );

        return {
            periodo: `Últimos ${numeroDias} dias`,
            totalProdutos: produtosRelatorio.length,
            produtosDisponíveis: produtosRelatorio.filter(p => !p.dono).length,
            produtosTransferidos: produtosRelatorio.filter(p => p.dono).length,
            empresasPartecipantes: [...new Set(produtosRelatorio.map(p => p.empresa))],
            dados: produtosRelatorio
        };
    }
}

// Instância global
const tracking = new ProductTracking();

// Componente React para verificação de produtos
const VerificadorProduto = () => {
    const [codigo, setCodigo] = React.useState('');
    const [produto, setProduto] = React.useState(null);
    const [carregando, setCarregando] = React.useState(false);
    const [erro, setErro] = React.useState('');

    const verificar = (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        setProduto(null);

        if (!codigo.trim()) {
            setErro('Insira um código válido');
            setCarregando(false);
            return;
        }

        // Simular busca
        setTimeout(() => {
            const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            const produtoEncontrado = produtos.find(p => p.codigo === codigo);

            if (produtoEncontrado) {
                setProduto(produtoEncontrado);
            } else {
                setErro('Produto não encontrado!');
            }

            setCarregando(false);
        }, 500);
    };

    const gerarQRCodeURL = () => {
        if (!produto) return '';
        const url = encodeURIComponent(produto.codigo);
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`;
    };

    const copiarCodigo = () => {
        navigator.clipboard.writeText(produto.codigo).then(() => {
            alert('Código copiado!');
        });
    };

    return (
        <div className="container">
            <div className="verificar-container">
                <h1 style={{textAlign: 'center', color: 'var(--primary-color)', marginBottom: '2rem'}}>
                    ✓ Verificar Autenticidade do Produto
                </h1>

                <form onSubmit={verificar} style={{background: 'var(--bg-darker)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)'}}>
                    <div className="form-group">
                        <label htmlFor="codigo">Código do Produto (Hash):</label>
                        <input
                            type="text"
                            id="codigo"
                            placeholder="Cole ou escaneie o código QR aqui"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={carregando}>
                        {carregando ? 'Verificando...' : 'Verificar Produto'}
                    </button>
                </form>

                {erro && (
                    <div style={{background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.375rem', marginTop: '2rem'}}>
                        ✗ {erro}
                    </div>
                )}

                {produto && (
                    <div className="resultado-produto">
                        <h3>Produto Verificado</h3>

                        <div className="qr-container">
                            <img src={gerarQRCodeURL()} alt="QR Code do Produto" style={{maxWidth: '250px'}} />
                        </div>

                        <div className="produto-info">
                            <strong>Nome do Produto:</strong><br/>
                            <span style={{fontSize: '1.1rem', color: 'var(--text-light)'}}>{produto.nome}</span>
                        </div>

                        <div className="produto-info">
                            <strong>Código Único:</strong><br/>
                            <code>{produto.codigo}</code>
                        </div>

                        <div className="produto-info">
                            <strong>Empresa Fabricante:</strong><br/>
                            <span>{produto.empresa}</span>
                        </div>

                        <div className="produto-info">
                            <strong>Proprietário Atual:</strong><br/>
                            <span>{produto.dono || '⚠ Sem proprietário (disponível)'}</span>
                        </div>

                        <div className="produto-info">
                            <strong>Data de Criação:</strong><br/>
                            <span>{new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <button onClick={copiarCodigo} className="btn btn-secondary btn-full" style={{marginTop: '1rem'}}>
                            Copiar Código
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

ReactDOM.render(<VerificadorProduto />, document.getElementById('root'));