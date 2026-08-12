import React, { useMemo, useState } from 'react'
import styles from '../../styles/Cadastro.module.css'

const categorias = ['Suplementos','Eletrônicos','Papelaria','Calçados','Acessórios','Outros']
const unidades   = ['un','kg','g','L','ml','cx','par','m']

export default function ProdutoForm({ fornecedores, initialData, onSave, onCancel }) {
  const ed = initialData || {}
  const [nome,          setNome]          = useState(ed.nome            || '')
  const [codigo,        setCodigo]        = useState(ed.codigoBarras     || '')
  const [categoria,     setCategoria]     = useState(ed.categoria        || categorias[0])
  const [unidade,       setUnidade]       = useState(ed.unidade          || unidades[0])
  const [fornecedor,    setFornecedor]    = useState(ed.fornecedor       || '')
  const [custo,         setCusto]         = useState(ed.custo?.toString().replace('.',',') || '')
  const [margem,        setMargem]        = useState(ed.margem?.toString() || '')
  const [estoque,       setEstoque]       = useState(ed.estoque?.toString()       || '')
  const [estoqueMinimo, setEstoqueMinimo] = useState(ed.estoqueMinimo?.toString() || '')
  const [erro,          setErro]          = useState('')

  // ── Markup simples: Venda = Custo × (1 + Margem / 100) ──
  const precoVenda = useMemo(() => {
    const c = Number(custo.replace(',', '.'))
    const m = Number(margem)
    if (!c || isNaN(m) || m < 0) return 0
    return c * (1 + m / 100)
  }, [custo, margem])

  // lucro em reais
  const lucroReais = useMemo(() => {
    const c = Number(custo.replace(',', '.'))
    return precoVenda - c
  }, [precoVenda, custo])

  function handleSave(e) {
    e.preventDefault()
    setErro('')
    if (!nome || !codigo || !custo || !margem) {
      setErro('Preencha todos os campos obrigatórios')
      return
    }
    onSave({
      nome,
      codigoBarras:  codigo,
      categoria,
      fornecedor,
      custo:         Number(custo.replace(',', '.')),
      margem:        Number(margem),
      venda:         parseFloat(precoVenda.toFixed(2)),
      estoque:       Number(estoque)       || 0,
      estoqueMinimo: Number(estoqueMinimo) || 0,
      unidade,
    })
  }

  const fmtBRL = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)

  return (
    <form onSubmit={handleSave}>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Nome do produto *</label>
          <input className={styles.fieldInput} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Whey Protein 1kg" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Código de barras *</label>
          <input className={styles.fieldInput} value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: 7891234560001" />
        </div>
      </div>

      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Categoria</label>
          <select className={styles.fieldInput} value={categoria} onChange={e => setCategoria(e.target.value)}>
            {categorias.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Unidade</label>
          <select className={styles.fieldInput} value={unidade} onChange={e => setUnidade(e.target.value)}>
            {unidades.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.formGrid1}>
        <div>
          <label className={styles.fieldLabel}>Fornecedor vinculado</label>
          <select className={styles.fieldInput} value={fornecedor} onChange={e => setFornecedor(e.target.value)}>
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map(item => <option key={item._id || item.nome} value={item.nome}>{item.nome}</option>)}
          </select>
        </div>
      </div>

      {/* ── Precificação com Markup ── */}
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Custo (R$) *</label>
          <input
            className={styles.fieldInput}
            value={custo}
            onChange={e => setCusto(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>Markup % *</label>
          <input
            className={styles.fieldInput}
            value={margem}
            onChange={e => setMargem(e.target.value)}
            placeholder="Ex: 50"
          />
        </div>
      </div>

      {/* preview do cálculo */}
      {precoVenda > 0 && (
        <div style={{
          background: 'var(--verde-palido)',
          border: '1px solid var(--borda)',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
        }}>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <span style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)', fontFamily:'DM Sans,sans-serif' }}>
              Preço de venda
            </span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--verde)', fontFamily:'Syne,sans-serif', lineHeight:1 }}>
              {fmtBRL(precoVenda)}
            </span>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'DM Sans,sans-serif' }}>Custo</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--text-body)', fontFamily:'DM Sans,sans-serif' }}>{fmtBRL(Number(custo.replace(',','.')))}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'DM Sans,sans-serif' }}>Lucro</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--verde)', fontFamily:'DM Sans,sans-serif' }}>+{fmtBRL(lucroReais)}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'DM Sans,sans-serif' }}>Markup</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--text-body)', fontFamily:'DM Sans,sans-serif' }}>{margem}%</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Estoque atual</label>
          <input className={styles.fieldInput} type="number" min="0" value={estoque} onChange={e => setEstoque(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Estoque mínimo</label>
          <input className={styles.fieldInput} type="number" min="0" value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)} placeholder="0" />
        </div>
      </div>

      {erro && <div className={styles.errorMessage}>{erro}</div>}

      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.saveButton}>{initialData ? 'Salvar alterações' : 'Salvar Produto'}</button>
      </div>
    </form>
  )
}