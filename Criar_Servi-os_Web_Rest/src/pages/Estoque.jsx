import React, { useEffect, useState, useMemo } from 'react'
import Header    from '../components/dashboard/Header'
import Sidebar   from '../components/dashboard/Sidebar'
import { produtosAPI } from '../services/api'
import styles    from '../styles/Estoque.module.css'

const fmt = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
  if (!isOpen) return null
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

function Toast({ msg, tipo = 'sucesso', onDone }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) } }, [msg])
  if (!msg) return null
  return (
    <div className={`${styles.toast} ${tipo === 'erro' ? styles.toastErro : ''}`}>
      <span>{tipo === 'erro' ? '✗' : '✓'}</span> {msg}
    </div>
  )
}

export default function Estoque({ user, onLogout, sidebarAberta, onToggleSidebar, onFecharSidebar }) {
  const isVisualizador = user?.role === 'Visualizador'

  const [produtos,      setProdutos]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [backendOk,     setBackendOk]     = useState(true)
  const [busca,         setBusca]         = useState('')
  const [filtroStatus,  setFiltroStatus]  = useState('todos')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [toast,         setToast]         = useState({ msg:'', tipo:'sucesso' })
  const [modalMov,      setModalMov]      = useState(false)
  const [produtoSel,    setProdutoSel]    = useState(null)
  const [tipoMov,       setTipoMov]       = useState('entrada')
  const [quantidade,    setQuantidade]    = useState('')
  const [motivo,        setMotivo]        = useState('')
  const [movErro,       setMovErro]       = useState('')
  const [historico,     setHistorico]     = useState([])

  async function carregarProdutos() {
    setLoading(true)
    try {
      const data = await produtosAPI.listar() // ← usa a API com token JWT
      setProdutos(Array.isArray(data) ? data : [])
      setBackendOk(true)
    } catch {
      setBackendOk(false)
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarProdutos() }, [])

  function getStatus(p) {
    if (p.estoque === 0)                                      return 'critico'
    if (p.estoqueMinimo > 0 && p.estoque <= p.estoqueMinimo) return 'baixo'
    return 'ok'
  }

  const categorias = useMemo(() => ['todas', ...new Set(produtos.map(p => p.categoria).filter(Boolean))], [produtos])

  const produtosFiltrados = useMemo(() => produtos.filter(p => {
    const matchBusca     = [p.nome, p.codigoBarras, p.categoria, p.fornecedor].some(v => v?.toLowerCase().includes(busca.toLowerCase()))
    const matchStatus    = filtroStatus === 'todos' || getStatus(p) === filtroStatus
    const matchCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria
    return matchBusca && matchStatus && matchCategoria
  }), [produtos, busca, filtroStatus, filtroCategoria])

  const resumo = useMemo(() => ({
    total:   produtos.length,
    critico: produtos.filter(p => getStatus(p) === 'critico').length,
    baixo:   produtos.filter(p => getStatus(p) === 'baixo').length,
    ok:      produtos.filter(p => getStatus(p) === 'ok').length,
  }), [produtos])

  function abrirMovimentacao(produto, tipo) {
    if (isVisualizador) return
    setProdutoSel(produto)
    setTipoMov(tipo)
    setQuantidade('')
    setMotivo('')
    setMovErro('')
    setModalMov(true)
  }

  const qtdNum        = Number(quantidade) || 0
  const estoqueAntes  = produtoSel?.estoque || 0
  const estoqueDepois = tipoMov === 'entrada' ? estoqueAntes + qtdNum : estoqueAntes - qtdNum

  async function handleMovimentacao(e) {
    e.preventDefault()
    setMovErro('')
    if (!qtdNum || qtdNum <= 0) { setMovErro('Informe uma quantidade válida'); return }
    if (tipoMov === 'saida' && qtdNum > estoqueAntes) {
      setMovErro(`Estoque insuficiente — disponível: ${estoqueAntes} ${produtoSel.unidade || 'un'}`)
      return
    }
    try {
      await produtosAPI.atualizar(produtoSel._id, { estoque: estoqueDepois }) // ← usa API com token
      setHistorico(prev => [{
        id: Date.now(), produto: produtoSel.nome, tipo: tipoMov,
        quantidade: qtdNum, motivo: motivo || '—',
        estoqueAntes, estoqueDepois,
        data: new Date().toLocaleString('pt-BR'),
      }, ...prev])
      setModalMov(false)
      setToast({ msg:`${tipoMov === 'entrada' ? 'Entrada' : 'Saída'} de ${qtdNum} ${produtoSel.unidade || 'un'} registrada!`, tipo:'sucesso' })
      carregarProdutos()
    } catch (err) {
      setMovErro(err.message || 'Erro ao atualizar estoque')
    }
  }

  const statusConfig = {
    critico: { label:'Crítico', cor:styles.tagCritico, bg:styles.rowCritico },
    baixo:   { label:'Baixo',   cor:styles.tagBaixo,   bg:styles.rowBaixo   },
    ok:      { label:'Ok',      cor:styles.tagOk,      bg:''                },
  }

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

        {isVisualizador && (
          <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:14, color:'#b45309', display:'flex', alignItems:'center', gap:8 }}>
            👁️ Você está no modo <strong>Visualizador</strong> — apenas leitura.
          </div>
        )}

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Estoque</h1>
            <p className={styles.pageSubtitle}>Visualize, filtre e movimente o estoque dos produtos</p>
          </div>

        </div>

        {/* cards de resumo */}
        <div className={styles.resumoGrid}>
          {[
            { key:'todos',   icon:'📦', label:'Total de produtos', valor:resumo.total,   extra:'' },
            { key:'critico', icon:'🚨', label:'Sem estoque',       valor:resumo.critico, extra:styles.resumoCardCritico },
            { key:'baixo',   icon:'⚠️', label:'Estoque baixo',     valor:resumo.baixo,   extra:styles.resumoCardBaixo  },
            { key:'ok',      icon:'✅', label:'Estoque ok',        valor:resumo.ok,      extra:styles.resumoCardOk     },
          ].map(card => (
            <button key={card.key} className={`${styles.resumoCard} ${card.extra} ${filtroStatus===card.key?styles.resumoActive:''}`} onClick={() => setFiltroStatus(card.key)}>
              <div className={styles.resumoIcon}>{card.icon}</div>
              <div className={styles.resumoInfo}>
                <div className={styles.resumoValor}>{card.valor}</div>
                <div className={styles.resumoLabel}>{card.label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* filtros */}
        <div className={styles.filtros}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input className={styles.searchInput} placeholder="Buscar produto, código ou categoria..." value={busca} onChange={e => setBusca(e.target.value)} />
            {busca && <button className={styles.searchClear} onClick={() => setBusca('')}>×</button>}
          </div>
          <select className={styles.select} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            {categorias.map(c => <option key={c} value={c}>{c === 'todas' ? 'Todas as categorias' : c}</option>)}
          </select>
        </div>

        {/* tabela */}
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loading}>⏳ Carregando estoque...</div>
          ) : produtosFiltrados.length === 0 ? (
            <div className={styles.empty}><div style={{fontSize:40,marginBottom:12}}>📦</div><p>Nenhum produto encontrado</p></div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {['Produto','Categoria','Fornecedor','Estoque atual','Mínimo','Status','Valor em estoque', !isVisualizador && 'Ações'].filter(Boolean).map(h=><th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map(p => {
                  const status = getStatus(p)
                  const cfg    = statusConfig[status]
                  return (
                    <tr key={p._id} className={cfg.bg}>
                      <td>
                        <div className={styles.prodCell}>
                          <div className={styles.prodIcon}>📦</div>
                          <div>
                            <div className={styles.prodNome}>{p.nome}</div>
                            <div className={styles.prodCod}>{p.codigoBarras}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.categoria}</td>
                      <td>{p.fornecedor || '—'}</td>
                      <td><span className={`${styles.estoqueNum} ${status==='critico'?styles.estoqueCritico:status==='baixo'?styles.estoqueBaixo:styles.estoqueOk}`}>{p.estoque} {p.unidade||'un'}</span></td>
                      <td>{p.estoqueMinimo||0} {p.unidade||'un'}</td>
                      <td><span className={cfg.cor}>{cfg.label}</span></td>
                      <td className={styles.bold}>{fmt((p.estoque||0)*(p.custo||0))}</td>
                      {!isVisualizador && (
                        <td>
                          <div className={styles.actionBtns}>
                            <button className={styles.btnEntrada} onClick={()=>abrirMovimentacao(p,'entrada')}>↑ Entrada</button>
                            <button className={styles.btnSaida}   onClick={()=>abrirMovimentacao(p,'saida')} disabled={p.estoque===0}>↓ Saída</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {produtosFiltrados.length > 0 && !loading && (
          <div className={styles.tableFooter}>
            {produtosFiltrados.length} produto{produtosFiltrados.length!==1?'s':''} encontrado{produtosFiltrados.length!==1?'s':''}
            {(filtroStatus!=='todos'||busca||filtroCategoria!=='todas') && (
              <button className={styles.limparFiltro} onClick={()=>{setFiltroStatus('todos');setBusca('');setFiltroCategoria('todas')}}>× Limpar filtros</button>
            )}
          </div>
        )}

        {/* histórico */}
        {historico.length > 0 && (
          <div className={styles.historicoSection}>
            <h2 className={styles.historicoTitle}>📋 Histórico de movimentações</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr>{['Produto','Tipo','Qtd','Antes','Depois','Motivo','Data'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {historico.map(h => (
                    <tr key={h.id}>
                      <td className={styles.bold}>{h.produto}</td>
                      <td><span className={h.tipo==='entrada'?styles.tagEntrada:styles.tagSaida}>{h.tipo==='entrada'?'↑ Entrada':'↓ Saída'}</span></td>
                      <td>{h.quantidade}</td>
                      <td>{h.estoqueAntes}</td>
                      <td className={styles.bold}>{h.estoqueDepois}</td>
                      <td>{h.motivo}</td>
                      <td>{h.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal movimentação — só para não-visualizadores */}
      {!isVisualizador && (
        <Modal isOpen={modalMov} onClose={()=>setModalMov(false)} title={tipoMov==='entrada'?'↑ Registrar Entrada':'↓ Registrar Saída'}>
          {produtoSel && (
            <form onSubmit={handleMovimentacao}>
              <div className={styles.movProdInfo}>
                <div className={styles.movProdIcon}>📦</div>
                <div>
                  <div className={styles.movProdNome}>{produtoSel.nome}</div>
                  <div className={styles.movProdEstoque}>Estoque atual: <strong>{estoqueAntes} {produtoSel.unidade||'un'}</strong></div>
                </div>
              </div>

              <div className={styles.movTipos}>
                <button type="button" className={`${styles.movTipoBtn} ${tipoMov==='entrada'?styles.movTipoEntrada:''}`} onClick={()=>{setTipoMov('entrada');setMovErro('')}}>↑ Entrada</button>
                <button type="button" className={`${styles.movTipoBtn} ${tipoMov==='saida'?styles.movTipoSaida:''}`}   onClick={()=>{setTipoMov('saida');setMovErro('')}} disabled={estoqueAntes===0}>↓ Saída</button>
              </div>

              <div className={styles.movField}>
                <label className={styles.movLabel}>Quantidade *</label>
                <input className={styles.movInput} type="number" min="1" max={tipoMov==='saida'?estoqueAntes:undefined} value={quantidade} onChange={e=>setQuantidade(e.target.value)} placeholder="Ex: 10" autoFocus />
                {tipoMov==='saida' && <span className={styles.movHint}>Máximo disponível: {estoqueAntes} {produtoSel.unidade||'un'}</span>}
              </div>

              <div className={styles.movField}>
                <label className={styles.movLabel}>Motivo (opcional)</label>
                <input className={styles.movInput} value={motivo} onChange={e=>setMotivo(e.target.value)} placeholder={tipoMov==='entrada'?'Ex: Compra de fornecedor':'Ex: Venda, Ajuste, Perda'} />
              </div>

              {/* preview */}
              {qtdNum > 0 && (
                <div className={styles.preview}>
                  <div className={styles.previewBloco}>
                    <span className={styles.previewRotulo}>Antes</span>
                    <span className={styles.previewNum}>{estoqueAntes}</span>
                    <span className={styles.previewUnidade}>{produtoSel.unidade||'un'}</span>
                  </div>
                  <div className={`${styles.previewSeta} ${tipoMov==='entrada'?styles.previewSetaEntrada:styles.previewSetaSaida}`}>
                    {tipoMov==='entrada'?`+${qtdNum}`:`-${qtdNum}`}
                  </div>
                  <div className={styles.previewBloco}>
                    <span className={styles.previewRotulo}>Depois</span>
                    <span className={`${styles.previewNum} ${estoqueDepois<=0?styles.previewNumCritico:produtoSel.estoqueMinimo>0&&estoqueDepois<=produtoSel.estoqueMinimo?styles.previewNumBaixo:styles.previewNumOk}`}>
                      {estoqueDepois}
                    </span>
                    <span className={styles.previewUnidade}>{produtoSel.unidade||'un'}</span>
                  </div>
                </div>
              )}

              {movErro && <div className={styles.movErro}>✗ {movErro}</div>}

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={()=>setModalMov(false)}>Cancelar</button>
                <button type="submit" className={tipoMov==='entrada'?styles.btnSalvarEntrada:styles.btnSalvarSaida}>
                  {tipoMov==='entrada'?'↑ Confirmar Entrada':'↓ Confirmar Saída'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      <Toast msg={toast.msg} tipo={toast.tipo} onDone={()=>setToast({msg:'',tipo:'sucesso'})} />
    </div>
  )
}