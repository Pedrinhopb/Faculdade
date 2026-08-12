import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header  from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { produtosAPI, fornecedoresAPI, clientesAPI, usuariosAPI, custosAPI } from '../services/api'
import styles  from '../styles/Dashboard.module.css'

const fmt = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)

export default function Dashboard({ user, onLogout, sidebarAberta, onToggleSidebar, onFecharSidebar }) {
  const navigate = useNavigate()

  const [produtos,     setProdutos]     = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [clientes,     setClientes]     = useState([])
  const [usuarios,     setUsuarios]     = useState([])
  const [custos,       setCustos]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [backendOk,    setBackendOk]    = useState(true)

  async function carregarDados() {
    setLoading(true)
    try {
      const [p, f, c, u, cu] = await Promise.all([
        produtosAPI.listar(),
        fornecedoresAPI.listar(),
        clientesAPI.listar(),
        usuariosAPI.listar(),
        custosAPI.listar(),
      ])
      setProdutos(Array.isArray(p) ? p : [])
      setFornecedores(Array.isArray(f) ? f : [])
      setClientes(Array.isArray(c) ? c : [])
      setUsuarios(Array.isArray(u) ? u : [])
      setCustos(Array.isArray(cu) ? cu : [])
      setBackendOk(true)
    } catch {
      setBackendOk(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  /* ── cálculos ── */
  const produtosCriticos = useMemo(() => produtos.filter(p => p.estoque === 0), [produtos])
  const produtosBaixo    = useMemo(() => produtos.filter(p => p.estoqueMinimo > 0 && p.estoque > 0 && p.estoque <= p.estoqueMinimo), [produtos])
  const valorEstoque     = useMemo(() => produtos.reduce((s, p) => s + (p.estoque||0)*(p.custo||0), 0), [produtos])
  const totalCustos      = useMemo(() => custos.reduce((s, c) => s + c.valor, 0), [custos])
  const receitaEstimada  = useMemo(() => produtos.reduce((s, p) => s + (p.estoque||0)*(p.venda||0), 0), [produtos])
  const lucroEstimado    = receitaEstimada - valorEstoque - totalCustos

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const metricas = [
    { icon:'📦', label:'Produtos',     valor:produtos.length,     desc:'cadastrados',    cor:'#3b82f6', path:'/cadastro'       },
    { icon:'🏭', label:'Fornecedores', valor:fornecedores.length, desc:'cadastrados',    cor:'#8b5cf6', path:'/cadastro'       },
    { icon:'👤', label:'Clientes',     valor:clientes.length,     desc:'cadastrados',    cor:'#f59e0b', path:'/cadastro'       },
    { icon:'💰', label:'Valor estoque',valor:fmt(valorEstoque),   desc:'em produtos',    cor:'var(--verde)', path:'/financeiro' },
    { icon:'📈', label:'Receita est.', valor:fmt(receitaEstimada),desc:'se vender tudo', cor:'#22a860', path:'/financeiro'    },
    { icon:'🏆', label:'Lucro est.',   valor:fmt(lucroEstimado),  desc:'líquido',        cor: lucroEstimado >= 0 ? '#22a860' : '#e74c3c', path:'/financeiro' },
  ]

  return (
    <div className={styles.page}>
      <Header user={user} onLogout={onLogout} onToggleSidebar={onToggleSidebar} />
      <Sidebar aberta={sidebarAberta} onFechar={onFecharSidebar} onLogout={onLogout} onToggle={onToggleSidebar} />

      <main className={styles.main}>
        {!backendOk && (
          <div className={styles.offlineAlert}>
            ⚠️ Backend offline — rode <code>npm run dev</code> na pasta <code>stockEasy-backend</code>
          </div>
        )}

        {/* boas vindas */}
        <div className={styles.welcome}>
          <div>
            <h1 className={styles.welcomeTitle}>{saudacao}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className={styles.welcomeDesc}>Aqui está um resumo geral do StockEasy</p>
          </div>

        </div>

        {loading ? (
          <div className={styles.loading}>⏳ Carregando dashboard...</div>
        ) : (
          <>


            <div className={styles.grid2}>

              {/* alertas de estoque */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>🚨 Alertas de estoque</h2>
                  <button className={styles.sectionLink} onClick={() => navigate('/estoque')}>Ver estoque →</button>
                </div>
                {produtosCriticos.length === 0 && produtosBaixo.length === 0 ? (
                  <div className={styles.alertaOk}>
                    <span>✅</span>
                    <span>Todos os produtos estão com estoque ok!</span>
                  </div>
                ) : (
                  <div className={styles.alertaLista}>
                    {produtosCriticos.map(p => (
                      <div key={p._id} className={`${styles.alertaItem} ${styles.alertaCritico}`}>
                        <div className={styles.alertaInfo}>
                          <span className={styles.alertaNome}>📦 {p.nome}</span>
                          <span className={styles.alertaTag} style={{background:'rgba(231,76,60,0.15)',color:'#e74c3c'}}>SEM ESTOQUE</span>
                        </div>
                        <span className={styles.alertaQtd} style={{color:'#e74c3c'}}>0 {p.unidade||'un'}</span>
                      </div>
                    ))}
                    {produtosBaixo.map(p => (
                      <div key={p._id} className={`${styles.alertaItem} ${styles.alertaBaixo}`}>
                        <div className={styles.alertaInfo}>
                          <span className={styles.alertaNome}>📦 {p.nome}</span>
                          <span className={styles.alertaTag} style={{background:'rgba(245,158,11,0.15)',color:'#b45309'}}>ESTOQUE BAIXO</span>
                        </div>
                        <span className={styles.alertaQtd} style={{color:'#f59e0b'}}>{p.estoque} / {p.estoqueMinimo} {p.unidade||'un'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* resumo financeiro */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>💰 Resumo financeiro</h2>
                  <button className={styles.sectionLink} onClick={() => navigate('/financeiro')}>Ver financeiro →</button>
                </div>
                <div className={styles.financeiroLista}>
                  {[
                    { label:'Valor em estoque',  valor: fmt(valorEstoque),    cor:'var(--verde)' },
                    { label:'Receita estimada',   valor: fmt(receitaEstimada), cor:'#3b82f6'      },
                    { label:'Custos fixos/mês',   valor: fmt(totalCustos),     cor:'#f59e0b'      },
                    { label:'Lucro líquido est.', valor: fmt(lucroEstimado),   cor: lucroEstimado >= 0 ? '#22a860' : '#e74c3c' },
                  ].map(item => (
                    <div key={item.label} className={styles.financeiroItem}>
                      <span className={styles.financeiroLabel}>{item.label}</span>
                      <span className={styles.financeiroValor} style={{ color: item.cor }}>{item.valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* últimos produtos cadastrados */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>📦 Últimos produtos</h2>
                  <button className={styles.sectionLink} onClick={() => navigate('/cadastro')}>Ver cadastro →</button>
                </div>
                {produtos.length === 0 ? (
                  <div className={styles.empty}>Nenhum produto cadastrado ainda</div>
                ) : (
                  <div className={styles.listaItens}>
                    {[...produtos].slice(-5).reverse().map(p => (
                      <div key={p._id} className={styles.listaItem}>
                        <div className={styles.listaItemIcon}>📦</div>
                        <div className={styles.listaItemInfo}>
                          <div className={styles.listaItemNome}>{p.nome}</div>
                          <div className={styles.listaItemDesc}>{p.categoria} · {p.estoque} {p.unidade||'un'} em estoque</div>
                        </div>
                        <div className={styles.listaItemValor}>{fmt(p.venda||0)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* clientes e fornecedores */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>👥 Cadastros recentes</h2>
                  <button className={styles.sectionLink} onClick={() => navigate('/cadastro')}>Ver todos →</button>
                </div>
                <div className={styles.cadastrosGrid}>
                  <div className={styles.cadastroCard}>
                    <div className={styles.cadastroIcon}>🏭</div>
                    <div className={styles.cadastroValor}>{fornecedores.length}</div>
                    <div className={styles.cadastroLabel}>Fornecedores</div>
                  </div>
                  <div className={styles.cadastroCard}>
                    <div className={styles.cadastroIcon}>👤</div>
                    <div className={styles.cadastroValor}>{clientes.length}</div>
                    <div className={styles.cadastroLabel}>Clientes</div>
                  </div>
                  <div className={styles.cadastroCard}>
                    <div className={styles.cadastroIcon}>🔐</div>
                    <div className={styles.cadastroValor}>{usuarios.length}</div>
                    <div className={styles.cadastroLabel}>Usuários</div>
                  </div>
                  <div className={styles.cadastroCard}>
                    <div className={styles.cadastroIcon}>💸</div>
                    <div className={styles.cadastroValor}>{custos.length}</div>
                    <div className={styles.cadastroLabel}>Custos fixos</div>
                  </div>
                </div>

                {/* usuários ativos/inativos */}
                <div className={styles.usuariosResumo}>
                  <div className={styles.usuarioItem}>
                    <span className={styles.pillGreen}>Ativos</span>
                    <span className={styles.bold}>{usuarios.filter(u=>u.status==='Ativo').length}</span>
                  </div>
                  <div className={styles.usuarioItem}>
                    <span className={styles.pillRed}>Inativos</span>
                    <span className={styles.bold}>{usuarios.filter(u=>u.status==='Inativo').length}</span>
                  </div>
                  <div className={styles.usuarioItem}>
                    <span className={styles.pillGray}>Visualizadores</span>
                    <span className={styles.bold}>{usuarios.filter(u=>u.permissao==='Visualizador').length}</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}