import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Header  from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { custosAPI, produtosAPI, configuracoesAPI } from '../services/api'
import styles  from '../styles/Administrativo.module.css'

const fmt    = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)
const fmtPct = v => `${Number(v).toFixed(1)}%`

const CATEGORIAS_CUSTO = ['Infraestrutura','Pessoal','Marketing','Logística','Tecnologia','Outros']

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

export default function Administrativo({ user, onLogout, sidebarAberta, onToggleSidebar, onFecharSidebar }) {
  // ── permissão ──
  const isVisualizador = user?.role === 'Visualizador'

  const [produtos,     setProdutos]     = useState([])
  const [custos,       setCustos]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [backendOk,    setBackendOk]    = useState(true)
  const [volumeMensal, setVolumeMensal] = useState(200)
  const [margemLucro,  setMargemLucro]  = useState(30)
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [modalCusto,   setModalCusto]   = useState(false)
  const [editCusto,    setEditCusto]    = useState(null)
  const [toast,        setToast]        = useState({ msg:'', tipo:'sucesso' })
  const [activeTab,    setActiveTab]    = useState('custos')
  const [nomeCusto,    setNomeCusto]    = useState('')
  const [catCusto,     setCatCusto]     = useState(CATEGORIAS_CUSTO[0])
  const [valorCusto,   setValorCusto]   = useState('')
  const [erroCusto,    setErroCusto]    = useState('')
  const [salvando,     setSalvando]     = useState(false)

  async function carregarTudo() {
    setLoading(true)
    try {
      const [p, c, config] = await Promise.all([
        produtosAPI.listar(),
        custosAPI.listar(),
        configuracoesAPI.listar(),
      ])
      setProdutos(p)
      setCustos(c)
      if (config.volumeMensal) setVolumeMensal(Number(config.volumeMensal))
      if (config.margemLucro)  setMargemLucro(Number(config.margemLucro))
      setBackendOk(true)
    } catch {
      setBackendOk(false)
      setToast({ msg:'Backend offline — não foi possível carregar os dados', tipo:'erro' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarTudo() }, [])

  const salvarConfig = useCallback(async (chave, valor) => {
    if (isVisualizador) return // bloqueia visualizador
    setSalvandoConfig(true)
    try {
      await configuracoesAPI.salvar(chave, valor)
    } catch { } finally {
      setSalvandoConfig(false)
    }
  }, [isVisualizador])

  function handleVolumeMensal(valor) {
    if (isVisualizador) return
    setVolumeMensal(valor)
    salvarConfig('volumeMensal', valor)
  }

  function handleMargemLucro(valor) {
    if (isVisualizador) return
    setMargemLucro(valor)
    salvarConfig('margemLucro', valor)
  }

  /* cálculos */
  const totalFixoMensal = useMemo(() => custos.reduce((s, c) => s + c.valor, 0), [custos])
  const custoPorProduto = useMemo(() => volumeMensal > 0 ? totalFixoMensal / volumeMensal : 0, [totalFixoMensal, volumeMensal])

  const produtosComSugestao = useMemo(() => produtos.map(p => {
    const custoTotal  = (p.custo || 0) + custoPorProduto
    const precoMinimo = custoTotal * (1 + margemLucro / 100)
    const precoAtual  = p.venda || 0
    const margemReal  = custoTotal > 0 ? ((precoAtual - custoTotal) / custoTotal) * 100 : 0
    const status      = precoAtual >= precoMinimo ? 'ok' : precoAtual > 0 ? 'baixo' : 'indefinido'
    return { ...p, custoTotal, precoMinimo, margemReal, status }
  }), [produtos, custoPorProduto, margemLucro])

  const porCategoria = useMemo(() => {
    const grupos = {}
    custos.forEach(c => {
      if (!grupos[c.categoria]) grupos[c.categoria] = 0
      grupos[c.categoria] += c.valor
    })
    return Object.entries(grupos).sort((a, b) => b[1] - a[1])
  }, [custos])

  async function handleSaveCusto(e) {
    e.preventDefault()
    setErroCusto('')
    if (!nomeCusto || !valorCusto) { setErroCusto('Preencha todos os campos'); return }
    const valor = Number(valorCusto.replace(',', '.'))
    if (isNaN(valor) || valor <= 0) { setErroCusto('Informe um valor válido'); return }

    setSalvando(true)
    try {
      if (editCusto) {
        await custosAPI.atualizar(editCusto._id, { nome:nomeCusto, categoria:catCusto, valor })
        setToast({ msg:'Custo atualizado com sucesso!', tipo:'sucesso' })
      } else {
        await custosAPI.criar({ nome:nomeCusto, categoria:catCusto, valor })
        setToast({ msg:'Custo cadastrado com sucesso!', tipo:'sucesso' })
      }
      setModalCusto(false)
      resetForm()
      carregarTudo()
    } catch (err) {
      setErroCusto(err.message || 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  async function excluirCusto(id, nome) {
    if (!confirm(`Deseja excluir "${nome}"?`)) return
    try {
      await custosAPI.remover(id)
      setToast({ msg:'Custo removido.', tipo:'sucesso' })
      carregarTudo()
    } catch {
      setToast({ msg:'Erro ao excluir custo', tipo:'erro' })
    }
  }

  function abrirEditar(custo) {
    setEditCusto(custo)
    setNomeCusto(custo.nome)
    setCatCusto(custo.categoria)
    setValorCusto(custo.valor.toString())
    setErroCusto('')
    setModalCusto(true)
  }

  function abrirNovoCusto() {
    setEditCusto(null)
    resetForm()
    setModalCusto(true)
  }

  function resetForm() {
    setNomeCusto(''); setCatCusto(CATEGORIAS_CUSTO[0]); setValorCusto(''); setErroCusto('')
  }

  const statusConfig = {
    ok:         { label:'Preço ok',     cls: styles.tagOk    },
    baixo:      { label:'Abaixo ideal', cls: styles.tagBaixo },
    indefinido: { label:'Sem preço',    cls: styles.tagCinza },
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

        {/* aviso visualizador */}
        {isVisualizador && (
          <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:14, color:'#b45309', display:'flex', alignItems:'center', gap:8 }}>
            👁️ Você está no modo <strong>Visualizador</strong> — apenas leitura. Contate o administrador para fazer alterações.
          </div>
        )}

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Administrativo</h1>
            <p className={styles.pageSubtitle}>Gerencie custos fixos e calcule a precificação ideal dos produtos</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>

          </div>
        </div>

        {/* cards */}
        <div className={styles.resumoGrid}>
          <div className={styles.resumoCard}>
            <div className={styles.resumoIcon}>💸</div>
            <div>
              <div className={styles.resumoValor}>{fmt(totalFixoMensal)}</div>
              <div className={styles.resumoLabel}>Custos fixos/mês</div>
            </div>
          </div>
          <div className={styles.resumoCard}>
            <div className={styles.resumoIcon}>📦</div>
            <div>
              <div className={styles.resumoValor}>{volumeMensal}</div>
              <div className={styles.resumoLabel}>Produtos vendidos/mês</div>
            </div>
          </div>
          <div className={styles.resumoCard}>
            <div className={styles.resumoIcon}>🔢</div>
            <div>
              <div className={styles.resumoValor}>{fmt(custoPorProduto)}</div>
              <div className={styles.resumoLabel}>Custo fixo por produto</div>
            </div>
          </div>
          <div className={styles.resumoCard}>
            <div className={styles.resumoIcon}>🎯</div>
            <div>
              <div className={styles.resumoValor}>{margemLucro}%</div>
              <div className={styles.resumoLabel}>Margem de lucro alvo</div>
            </div>
          </div>
        </div>

        {/* abas */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab==='custos'?styles.tabActive:''}`} onClick={() => setActiveTab('custos')}>
            💸 Custos Fixos <span className={styles.tabCount}>{custos.length}</span>
          </button>
          <button className={`${styles.tab} ${activeTab==='precificacao'?styles.tabActive:''}`} onClick={() => setActiveTab('precificacao')}>
            🎯 Precificação Sugerida <span className={styles.tabCount}>{produtosComSugestao.length}</span>
          </button>
        </div>

        {/* ── ABA CUSTOS ── */}
        {activeTab === 'custos' && (
          <>
            <div className={styles.actions}>
              <div className={styles.configRow}>
                <div className={styles.configField}>
                  <label className={styles.configLabel}>📦 Volume médio de vendas/mês</label>
                  <input
                    className={styles.configInput}
                    type="number" min="1"
                    value={volumeMensal}
                    onChange={e => handleVolumeMensal(Number(e.target.value))}
                    disabled={isVisualizador}
                    style={isVisualizador ? { opacity:0.6, cursor:'not-allowed' } : {}}
                  />
                </div>
                <div className={styles.configField}>
                  <label className={styles.configLabel}>🎯 Margem de lucro alvo (%)</label>
                  <input
                    className={styles.configInput}
                    type="number" min="0"
                    value={margemLucro}
                    onChange={e => handleMargemLucro(Number(e.target.value))}
                    disabled={isVisualizador}
                    style={isVisualizador ? { opacity:0.6, cursor:'not-allowed' } : {}}
                  />
                </div>
              </div>
              {/* botão novo — escondido para Visualizador */}
              {!isVisualizador && (
                <button className={styles.btnNew} onClick={abrirNovoCusto}>+ Novo custo</button>
              )}
            </div>

            {porCategoria.length > 0 && (
              <div className={styles.catGrid}>
                {porCategoria.map(([cat, valor]) => (
                  <div key={cat} className={styles.catCard}>
                    <div className={styles.catNome}>{cat}</div>
                    <div className={styles.catValor}>{fmt(valor)}</div>
                    <div className={styles.catBarra}>
                      <div className={styles.catBarraFill} style={{ width:`${totalFixoMensal > 0 ? (valor/totalFixoMensal)*100 : 0}%` }}/>
                    </div>
                    <div className={styles.catPct}>{totalFixoMensal > 0 ? fmtPct((valor/totalFixoMensal)*100) : '0%'} do total</div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.tableWrap}>
              {loading ? (
                <div className={styles.loading}>⏳ Carregando custos...</div>
              ) : custos.length === 0 ? (
                <div className={styles.empty}>
                  <div style={{fontSize:40,marginBottom:12}}>💸</div>
                  <p>Nenhum custo fixo cadastrado ainda.</p>
                  {!isVisualizador && <p style={{fontSize:13,marginTop:4}}>Clique em <strong>+ Novo custo</strong> para começar.</p>}
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {['Descrição','Categoria','Valor mensal','% do total', !isVisualizador && 'Ações'].filter(Boolean).map(h=><th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {custos.map(c => (
                      <tr key={c._id}>
                        <td className={styles.bold}>{c.nome}</td>
                        <td><span className={styles.tagCategoria}>{c.categoria}</span></td>
                        <td className={styles.bold}>{fmt(c.valor)}</td>
                        <td>
                          <div className={styles.pctWrap}>
                            <div className={styles.pctBarra}>
                              <div className={styles.pctBarraFill} style={{width:`${totalFixoMensal>0?(c.valor/totalFixoMensal)*100:0}%`}}/>
                            </div>
                            <span>{totalFixoMensal>0?fmtPct((c.valor/totalFixoMensal)*100):'0%'}</span>
                          </div>
                        </td>
                        {!isVisualizador && (
                          <td>
                            <div className={styles.actionBtns}>
                              <button className={styles.btnEdit}   onClick={()=>abrirEditar(c)}>✏️</button>
                              <button className={styles.btnDelete} onClick={()=>excluirCusto(c._id, c.nome)}>🗑️</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr className={styles.totalRow}>
                      <td colSpan={2} className={styles.bold}>Total mensal</td>
                      <td className={styles.totalValor}>{fmt(totalFixoMensal)}</td>
                      <td>100%</td>
                      {!isVisualizador && <td/>}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── ABA PRECIFICAÇÃO ── */}
        {activeTab === 'precificacao' && (
          <>
            <div className={styles.precInfo}>
              <div className={styles.precInfoItem}>
                <span className={styles.precInfoIcon}>🔢</span>
                <div>
                  <div className={styles.precInfoLabel}>Custo fixo por produto</div>
                  <div className={styles.precInfoValor}>{fmt(custoPorProduto)}</div>
                </div>
              </div>
              <div className={styles.precInfoItem}>
                <span className={styles.precInfoIcon}>🎯</span>
                <div>
                  <div className={styles.precInfoLabel}>Margem alvo</div>
                  <div className={styles.precInfoValor}>{margemLucro}%</div>
                </div>
              </div>
              <div className={styles.precInfoItem}>
                <span className={styles.precInfoIcon}>📊</span>
                <div>
                  <div className={styles.precInfoLabel}>Fórmula</div>
                  <div className={styles.precInfoFormula}>Preço mínimo = (Custo + Custo fixo) × (1 + Margem%)</div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={styles.empty}>⏳ Carregando produtos...</div>
            ) : produtosComSugestao.length === 0 ? (
              <div className={styles.empty}>
                <div style={{fontSize:40,marginBottom:12}}>📦</div>
                <p>Nenhum produto cadastrado ainda.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>{['Produto','Custo compra','Custo total*','Preço atual','Preço mínimo','Margem real','Status'].map(h=><th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {produtosComSugestao.map(p => (
                      <tr key={p._id} className={p.status==='baixo'?styles.rowBaixo:''}>
                        <td>
                          <div className={styles.prodCell}>
                            <div className={styles.prodIcon}>📦</div>
                            <div className={styles.prodNome}>{p.nome}</div>
                          </div>
                        </td>
                        <td>{fmt(p.custo||0)}</td>
                        <td>
                          <div className={styles.custoTotalCell}>
                            <span className={styles.bold}>{fmt(p.custoTotal)}</span>
                            <span className={styles.custoFixoLabel}>+{fmt(custoPorProduto)} fixo</span>
                          </div>
                        </td>
                        <td className={styles.bold}>{fmt(p.venda||0)}</td>
                        <td><span className={p.status==='baixo'?styles.precoMinimoBaixo:styles.precoMinimoOk}>{fmt(p.precoMinimo)}</span></td>
                        <td><span className={p.margemReal >= margemLucro ? styles.margemOk : styles.margemBaixo}>{fmtPct(p.margemReal)}</span></td>
                        <td><span className={statusConfig[p.status]?.cls}>{statusConfig[p.status]?.label}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.tableFooterNote}>
                  * Custo total = Custo de compra + Custo fixo rateado ({fmt(custoPorProduto)}/produto)
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {!isVisualizador && (
        <Modal isOpen={modalCusto} onClose={()=>setModalCusto(false)} title={editCusto?'Editar Custo Fixo':'Novo Custo Fixo'}>
          <form onSubmit={handleSaveCusto} className={styles.formCol}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Descrição *</label>
              <input className={styles.formInput} value={nomeCusto} onChange={e=>setNomeCusto(e.target.value)} placeholder="Ex: Aluguel, Energia, Salário..." autoFocus />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Categoria</label>
              <select className={styles.formInput} value={catCusto} onChange={e=>setCatCusto(e.target.value)}>
                {CATEGORIAS_CUSTO.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Valor mensal (R$) *</label>
              <input className={styles.formInput} value={valorCusto} onChange={e=>setValorCusto(e.target.value)} placeholder="Ex: 1500,00" />
            </div>
            {erroCusto && <div className={styles.alertErro}>✗ {erroCusto}</div>}
            <div className={styles.formFooter}>
              <button type="button" className={styles.cancelButton} onClick={()=>setModalCusto(false)}>Cancelar</button>
              <button type="submit" className={styles.saveButton} disabled={salvando}>
                {salvando ? 'Salvando...' : editCusto ? 'Salvar alterações' : 'Adicionar custo'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <Toast msg={toast.msg} tipo={toast.tipo} onDone={()=>setToast({msg:'',tipo:'sucesso'})} />
    </div>
  )
}