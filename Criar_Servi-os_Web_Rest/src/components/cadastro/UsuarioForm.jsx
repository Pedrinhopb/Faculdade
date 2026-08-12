import React, { useState } from 'react'
import styles from '../../styles/Cadastro.module.css'

export default function UsuarioForm({ initialData, onSave, onCancel }) {
  const ed = initialData || {}
  const isEdit = !!initialData

  const [nome,      setNome]      = useState(ed.nome      || '')
  const [email,     setEmail]     = useState(ed.email     || '')
  const [cargo,     setCargo]     = useState(ed.cargo     || '')
  const [permissao, setPermissao] = useState(ed.permissao || 'Operador')
  const [senha,     setSenha]     = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [ativo,     setAtivo]     = useState(ed.status ? ed.status === 'Ativo' : true)
  const [showPwd,   setShowPwd]   = useState(false)
  const [erro,      setErro]      = useState('')

  function handleSave(e) {
    e.preventDefault()
    setErro('')
    if (!nome || !email) { setErro('Preencha nome e e-mail'); return }

    // senha só obrigatória ao criar
    if (!isEdit) {
      if (!senha || !confirm) { setErro('Preencha os campos de senha'); return }
      if (senha.length < 6)   { setErro('Senha deve ter ao menos 6 caracteres'); return }
      if (senha !== confirm)   { setErro('As senhas precisam ser iguais'); return }
    }

    const dados = { nome, email, cargo, permissao, status: ativo ? 'Ativo' : 'Inativo' }
    if (!isEdit) dados.senha = senha  // só envia senha ao criar
    onSave(dados)
  }

  return (
    <form onSubmit={handleSave}>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Nome completo *</label>
          <input className={styles.fieldInput} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" />
        </div>
        <div>
          <label className={styles.fieldLabel}>E-mail *</label>
          <input className={styles.fieldInput} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@stockeasy.com" />
        </div>
      </div>
      <div className={styles.formGrid2}>
        <div>
          <label className={styles.fieldLabel}>Cargo</label>
          <input className={styles.fieldInput} value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Operador de Estoque" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Permissão</label>
          <select className={styles.fieldInput} value={permissao} onChange={e => setPermissao(e.target.value)}>
            <option value="Administrador">Administrador</option>
            <option value="Operador">Operador</option>
            <option value="Visualizador">Visualizador</option>
          </select>
        </div>
      </div>

      {/* senha só aparece ao criar */}
      {!isEdit && (
        <div className={styles.formGrid2}>
          <div style={{ position:'relative' }}>
            <label className={styles.fieldLabel}>Senha * (mín. 6 caracteres)</label>
            <input className={styles.fieldInput} type={showPwd?'text':'password'} value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPwd(v=>!v)} style={{position:'absolute',right:10,top:34,background:'none',border:'none',cursor:'pointer',fontSize:16}}>
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>
          <div>
            <label className={styles.fieldLabel}>Confirmar senha *</label>
            <input className={styles.fieldInput} type={showPwd?'text':'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
          </div>
        </div>
      )}

      {isEdit && (
        <div className={styles.formGrid1}>
          <p style={{ fontSize:13, color:'var(--text-muted)', padding:'8px 0' }}>
            🔒 Para alterar a senha, entre em contato com o administrador.
          </p>
        </div>
      )}

      <div className={styles.formGrid1}>
        <div>
          <label className={styles.fieldLabel}>Status</label>
          <div className={styles.toggleRow}>
            <div className={styles.toggleTrack} style={{ background: ativo ? 'var(--verde)' : 'var(--borda)' }} onClick={() => setAtivo(v => !v)}>
              <div className={`${styles.toggleThumb} ${ativo ? styles.toggleOn : ''}`} />
            </div>
            <span className={styles.toggleLabel}>{ativo ? '✅ Ativo' : '⛔ Inativo'}</span>
          </div>
        </div>
      </div>

      {erro && <div className={styles.errorMessage}>{erro}</div>}
      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.saveButton}>{isEdit ? 'Salvar alterações' : 'Salvar Usuário'}</button>
      </div>
    </form>
  )
}