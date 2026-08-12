import React, { useEffect, useState, useMemo } from 'react'
import Header  from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { produtosAPI, custosAPI, configuracoesAPI } from '../services/api'
import styles  from '../styles/Financeiro.module.css'

const fmt    = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)
const fmtPct = v => `${Number(v).toFixed(1)}%`

export default function Financeiro({ user, onLogout, sidebarAberta, onToggleSidebar, onFecharSidebar }) {
  const [produtos,     setProdutos]     = useState([])
  const [custos,       setCustos]       = useState([])
  const [volumeMensal, setVolumeMensal] = useState(200)
  const [margemLucro,  setMargemLucro]  = useState(30)
  const [loading,      setLoading]      = useState(true)
  const [backendOk,    setBackendOk]    = useState(true)

  async function carregarDados() {
    setLoading(true)
    try {
      const [p, c, config] = await Promise.all([
        produtosAPI.listar(),
        custosAPI.listar(),
        configuracoesAPI.listar(),
      ])
      setProdutos(Array.isArray(p) ? p : [])
      setCustos(Array.isArray(c) ? c : [])
      if (config.volumeMensal) setVolumeMensal(Number(config.volumeMensal))
      if (config.margemLucro)  setMargemLucro(Number(config.margemLucro))
      setBackendOk(true)
    } catch {
      setBackendOk(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  /* ── cálculos financeiros ── */

  // valor total do estoque (estoque × custo de compra)
  const valorEstoque = useMemo(() =>
    produtos.reduce((s, p) => s + (p.estoque || 0) * (p.custo || 0), 0)
  , [produtos])

  // receita estimada (estoque × preço de venda)
  const receitaEstimada = useMemo(() =>
    produtos.reduce((s, p) => s + (p.estoque || 0) * (p.venda || 0), 0)
  , [produtos])

  // lucro bruto estimado (receita - custo)
  const lucroBruto = receitaEstimada - valorEstoque

  // total de custos fixos mensais
  const totalCustosFixos = useMemo(() =>
    custos.reduce((s, c) => s + c.valor, 0)
  , [custos])

  // custo fixo por produto
  const custoPorProduto = volumeMensal > 0 ? totalCustosFixos / volumeMensal : 0

  // lucro líquido estimado (lucro bruto - custos fixos)
  const lucroLiquido = lucroBruto - totalCustosFixos

  // margem de lucro real média
  const margemReal = receitaEstimada > 0 ? (lucroBruto / receitaEstimada) * 100 : 0

  // produtos com preço abaixo do mínimo
  const produtosAbaixo = useMemo(() => produtos.filter(p => {
    const custoTotal  = (p.custo || 0) + custoPorProduto
    const precoMinimo = custoTotal * (1 + margemLucro / 100)
    return (p.venda || 0) > 0 && (p.venda || 0) < precoMinimo
  }), [produtos, custoPorProduto, margemLucro])

  // produtos por categoria com valor em estoque
  const porCategoria = useMemo(() => {
    const grupos = {}
    produtos.forEach(p => {
      const cat = p.categoria || 'Outros'
      if (!grupos[cat]) grupos[cat] = { qtd:0, valor:0 }
      grupos[cat].qtd   += p.estoque || 0
      grupos[cat].valor += (p.estoque || 0) * (p.custo || 0)
    })
    return Object.entries(grupos).sort((a,b) => b[1].valor - a[1].valor)
  }, [produtos])

  const cards = [
    { icon:'📦', label:'Valor em estoque',     valor: fmt(valorEstoque),    desc:'Custo total dos produtos em estoque',      cor:'var(--verde)'  },
    { icon:'💰', label:'Receita estimada',      valor: fmt(receitaEstimada), desc:'Se vender tudo pelo preço de venda',       cor:'#3b82f6'       },
    { icon:'📈', label:'Lucro bruto estimado',  valor: fmt(lucroBruto),      desc:'Receita menos custo de compra',            cor:'#22a860'       },
    { icon:'💸', label:'Custos fixos/mês',      valor: fmt(totalCustosFixos),desc:'Total de despesas fixas mensais',          cor:'#f59e0b'       },
    { icon:'🏆', label:'Lucro líquido est.',    valor: fmt(lucroLiquido),    desc:'Lucro bruto menos custos fixos',           cor: lucroLiquido >= 0 ? '#22a860' : '#e74c3c' },
    { icon:'📊', label:'Margem real média',     valor: fmtPct(margemReal),   desc:'Percentual de lucro sobre a receita',      cor:'var(--verde)'  },
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

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Financeiro</h1>
            <p className={styles.pageSubtitle}>Visão financeira do estoque, custos e lucratividade estimada</p>
          </div>

        </div>

        {loading ? (
          <div className={styles.loading}>⏳ Carregando dados financeiros...</div>
        ) : (
          <>
            {/* cards principais */}
            <div className={styles.cardsGrid}>
              {cards.map(card => (
                <div key={card.label} className={styles.card}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardValor} style={{ color: card.cor }}>{card.valor}</div>
                    <div className={styles.cardLabel}>{card.label}</div>
                    <div className={styles.cardDesc}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* aviso de produtos abaixo do preço mínimo */}
            {produtosAbaixo.length > 0 && (
              <div className={styles.alertaSection}>
                <div className={styles.alertaHeader}>
                  <span>⚠️</span>
                  <strong>{produtosAbaixo.length} produto{produtosAbaixo.length !== 1 ? 's' : ''} com preço abaixo do mínimo recomendado</strong>
                </div>
                <div className={styles.alertaLista}>
                  {produtosAbaixo.map(p => {
                    const custoTotal  = (p.custo || 0) + custoPorProduto
                    const precoMinimo = custoTotal * (1 + margemLucro / 100)
                    const diferenca   = precoMinimo - (p.venda || 0)
                    return (
                      <div key={p._id} className={styles.alertaItem}>
                        <span className={styles.alertaNome}>📦 {p.nome}</span>
                        <span className={styles.alertaAtual}>Atual: {fmt(p.venda || 0)}</span>
                        <span className={styles.alertaMinimo}>Mínimo: {fmt(precoMinimo)}</span>
                        <span className={styles.alertaDiff}>-{fmt(diferenca)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className={styles.grid2}>
              {/* valor por categoria */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📦 Estoque por categoria</h2>
                <div className={styles.tableWrap}>
                  {porCategoria.length === 0 ? (
                    <div className={styles.empty}>Nenhum produto cadastrado</div>
                  ) : (
                    <table className={styles.table}>
                      <thead>
                        <tr>{['Categoria','Qtd em estoque','Valor em estoque','%'].map(h=><th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {porCategoria.map(([cat, info]) => (
                          <tr key={cat}>
                            <td className={styles.bold}>{cat}</td>
                            <td>{info.qtd}</td>
                            <td className={styles.bold}>{fmt(info.valor)}</td>
                            <td>
                              <div className={styles.pctWrap}>
                                <div className={styles.pctBarra}>
                                  <div className={styles.pctFill} style={{ width:`${valorEstoque > 0 ? (info.valor/valorEstoque)*100 : 0}%` }}/>
                                </div>
                                <span>{valorEstoque > 0 ? fmtPct((info.valor/valorEstoque)*100) : '0%'}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className={styles.totalRow}>
                          <td className={styles.bold}>Total</td>
                          <td className={styles.bold}>{produtos.reduce((s,p)=>s+(p.estoque||0),0)}</td>
                          <td className={styles.totalValor}>{fmt(valorEstoque)}</td>
                          <td>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* resumo de custos fixos */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💸 Resumo de custos fixos</h2>
                <div className={styles.tableWrap}>
                  {custos.length === 0 ? (
                    <div className={styles.empty}>Nenhum custo fixo cadastrado</div>
                  ) : (
                    <table className={styles.table}>
                      <thead>
                        <tr>{['Descrição','Categoria','Valor/mês'].map(h=><th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {custos.map(c => (
                          <tr key={c._id}>
                            <td className={styles.bold}>{c.nome}</td>
                            <td><span className={styles.tagCategoria}>{c.categoria}</span></td>
                            <td>{fmt(c.valor)}</td>
                          </tr>
                        ))}
                        <tr className={styles.totalRow}>
                          <td colSpan={2} className={styles.bold}>Total mensal</td>
                          <td className={styles.totalValor}>{fmt(totalCustosFixos)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* indicadores */}
                <div className={styles.indicadores}>
                  <div className={styles.indicador}>
                    <span className={styles.indicadorLabel}>Custo fixo por produto</span>
                    <span className={styles.indicadorValor}>{fmt(custoPorProduto)}</span>
                  </div>
                  <div className={styles.indicador}>
                    <span className={styles.indicadorLabel}>Volume médio/mês</span>
                    <span className={styles.indicadorValor}>{volumeMensal} un</span>
                  </div>
                  <div className={styles.indicador}>
                    <span className={styles.indicadorLabel}>Margem alvo</span>
                    <span className={styles.indicadorValor}>{margemLucro}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* nota */}
            <div className={styles.nota}>
              💡 Os valores são <strong>estimados</strong> com base no estoque atual e nos preços cadastrados. Para alterar volume mensal e margem alvo, acesse o módulo <strong>Administrativo</strong>.
            </div>
          </>
        )}
      </main>
    </div>
  )
}