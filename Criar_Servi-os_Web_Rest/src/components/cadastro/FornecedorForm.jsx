import React, { useState } from 'react'
import styles from '../../styles/Cadastro.module.css'

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

function formatCNPJ(value) {
  const d = value.replace(/\D/g,'').slice(0,14)
  return d.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{3})(\d)/,'$1.$2').replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/,'$1/$2').replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/,'$1-$2')
}

function formatPhone(value) {
  const d = value.replace(/\D/g,'').slice(0,11)
  return d.replace(/^(\d{2})(\d)/,'($1) $2').replace(/^(\(\d{2}\) \d{1})(\d{4})(\d)/,'$1 $2-$3')
}

export default function FornecedorForm({ initialData, onSave, onCancel }) {
  const ed = initialData || {}
  const [nome,     setNome]     = useState(ed.nome     || '')
  const [cnpj,     setCnpj]     = useState(ed.cnpj     || '')
  const [telefone, setTelefone] = useState(ed.telefone || '')
  const [email,    setEmail]    = useState(ed.email    || '')
  const [endereco, setEndereco] = useState(ed.endereco || '')
  const [cidade,   setCidade]   = useState(ed.cidade   || '')
  const [estado,   setEstado]   = useState(ed.estado   || estados[0])
  const [prazo,    setPrazo]    = useState(ed.prazoEntrega?.toString() || '')
  const [erro,     setErro]     = useState('')

  function handleSave(e) {
    e.preventDefault()
    setErro('')
    if (!nome || !cnpj || !telefone || !email) {
      setErro('Preencha todos os campos obrigatórios')
      return
    }
    onSave({ nome, cnpj, telefone, email, endereco, cidade, estado, prazoEntrega: prazo ? Number(prazo) : 7 })
  }

  return (
    <form onSubmit={handleSave}>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Nome / Razão Social *</label>
          <input className={styles.fieldInput} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: NutriMax Distribuidora" />
        </div>
        <div>
          <label className={styles.fieldLabel}>CNPJ *</label>
          <input className={styles.fieldInput} value={cnpj} onChange={e => setCnpj(formatCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
        </div>
      </div>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Telefone *</label>
          <input className={styles.fieldInput} value={telefone} onChange={e => setTelefone(formatPhone(e.target.value))} placeholder="(83) 9 9999-0000" />
        </div>
        <div>
          <label className={styles.fieldLabel}>E-mail *</label>
          <input className={styles.fieldInput} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@empresa.com" />
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
      <div className={styles.formGrid1}>
        <div>
          <label className={styles.fieldLabel}>Prazo de entrega (dias)</label>
          <input className={styles.fieldInput} type="number" min="1" value={prazo} onChange={e => setPrazo(e.target.value)} placeholder="Ex: 7" />
        </div>
      </div>
      {erro && <div className={styles.errorMessage}>{erro}</div>}
      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.saveButton}>{initialData ? 'Salvar alterações' : 'Salvar Fornecedor'}</button>
      </div>
    </form>
  )
}