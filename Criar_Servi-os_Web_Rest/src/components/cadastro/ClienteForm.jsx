import React, { useMemo, useState } from 'react'
import styles from '../../styles/Cadastro.module.css'

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

function formatCPF(v)  { const d=v.replace(/\D/g,'').slice(0,11); return d.replace(/^(\d{3})(\d)/,'$1.$2').replace(/^(\d{3}\.\d{3})(\d)/,'$1.$2').replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/,'$1-$2') }
function formatCNPJ(v) { const d=v.replace(/\D/g,'').slice(0,14); return d.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{3})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/,'$1/$2').replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/,'$1-$2') }
function formatPhone(v){ const d=v.replace(/\D/g,'').slice(0,11); return d.replace(/^(\d{2})(\d)/,'($1) $2').replace(/^(\(\d{2}\) \d{1})(\d{4})(\d)/,'$1 $2-$3') }

export default function ClienteForm({ initialData, onSave, onCancel }) {
  const ed = initialData || {}
  const [nome,      setNome]      = useState(ed.nome      || '')
  const [tipo,      setTipo]      = useState(ed.tipo      || 'Pessoa Física')
  const [documento, setDocumento] = useState(ed.documento || '')
  const [telefone,  setTelefone]  = useState(ed.telefone  || '')
  const [email,     setEmail]     = useState(ed.email     || '')
  const [endereco,  setEndereco]  = useState(ed.endereco  || '')
  const [cidade,    setCidade]    = useState(ed.cidade    || '')
  const [estado,    setEstado]    = useState(ed.estado    || estados[0])
  const [erro,      setErro]      = useState('')

  const documentoFormatado = useMemo(() => tipo === 'Pessoa Física' ? formatCPF(documento) : formatCNPJ(documento), [documento, tipo])

  function handleSave(e) {
    e.preventDefault()
    setErro('')
    if (!nome || !documento || !telefone || !email) { setErro('Preencha todos os campos obrigatórios'); return }
    onSave({ nome, tipo, documento: documentoFormatado, telefone, email, endereco, cidade, estado, totalCompras: ed.totalCompras || 0 })
  }

  return (
    <form onSubmit={handleSave}>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Nome completo *</label>
          <input className={styles.fieldInput} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Tipo</label>
          <select className={styles.fieldInput} value={tipo} onChange={e => { setTipo(e.target.value); setDocumento('') }}>
            <option>Pessoa Física</option>
            <option>Pessoa Jurídica</option>
          </select>
        </div>
      </div>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>{tipo === 'Pessoa Física' ? 'CPF' : 'CNPJ'} *</label>
          <input className={styles.fieldInput} value={documentoFormatado} onChange={e => setDocumento(e.target.value)} placeholder={tipo === 'Pessoa Física' ? '000.000.000-00' : '00.000.000/0000-00'} />
        </div>
        <div>
          <label className={styles.fieldLabel}>Telefone *</label>
          <input className={styles.fieldInput} value={telefone} onChange={e => setTelefone(formatPhone(e.target.value))} placeholder="(83) 9 9999-0000" />
        </div>
      </div>
      <div className={styles.formGrid1}>
        <div>
          <label className={styles.fieldLabel}>E-mail *</label>
          <input className={styles.fieldInput} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@email.com" />
        </div>
      </div>
      <div className={styles.formGrid1}>
        <div>
          <label className={styles.fieldLabel}>Endereço completo</label>
          <input className={styles.fieldInput} value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua, número, bairro" />
        </div>
      </div>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Cidade</label>
          <input className={styles.fieldInput} value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: Campina Grande" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Estado</label>
          <select className={styles.fieldInput} value={estado} onChange={e => setEstado(e.target.value)}>
            {estados.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      {erro && <div className={styles.errorMessage}>{erro}</div>}
      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.saveButton}>{initialData ? 'Salvar alterações' : 'Salvar Cliente'}</button>
      </div>
    </form>
  )
}