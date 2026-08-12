import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import styles from './Header.module.css'

function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

/* ── Modal genérico ── */
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
  if (!isOpen) return null
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

export default function Header({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [notifOpen,  setNotifOpen]  = useState(false)
  const [profileOpen,setProfileOpen]= useState(false)
  const [notifs,     setNotifs]     = useState([])
  const [loadingNotif, setLoadingNotif] = useState(true)

  /* modais */
  const [showEditPerfil, setShowEditPerfil] = useState(false)
  const [showSenha,      setShowSenha]      = useState(false)

  /* form editar perfil */
  const [editNome,  setEditNome]  = useState(user?.name  || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editOk,    setEditOk]    = useState('')
  const [editErro,  setEditErro]  = useState('')

  /* form alterar senha */
  const [senhaAtual,   setSenhaAtual]   = useState('')
  const [senhaNova,    setSenhaNova]    = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [senhaErro,    setSenhaErro]    = useState('')
  const [senhaOk,      setSenhaOk]      = useState('')
  const [showPwd,      setShowPwd]      = useState(false)

  const notifRef   = useRef(null)
  const profileRef = useRef(null)

  const unread = notifs.filter(n => n.unread).length

  /* ── Notificações reais da API ── */
  async function carregarNotificacoes() {
    try {
      const res      = await fetch('http://localhost:3000/api/produtos')
      const produtos = await res.json()
      const lista    = []

      produtos.filter(p => p.estoque === 0).forEach(p => {
        lista.push({ id: p._id+'_zero', icon:'🚨', text:`${p.nome} está SEM estoque!`, detail:`Estoque: 0 ${p.unidade||'un'}`, time:'Agora', unread:true })
      })
      produtos.filter(p => p.estoqueMinimo > 0 && p.estoque > 0 && p.estoque <= p.estoqueMinimo).forEach(p => {
        lista.push({ id: p._id+'_baixo', icon:'⚠️', text:`${p.nome} com estoque baixo`, detail:`${p.estoque} ${p.unidade||'un'} — mín: ${p.estoqueMinimo}`, time:'Verificar', unread:true })
      })
      if (lista.length === 0 && produtos.length > 0) {
        lista.push({ id:'ok', icon:'✅', text:'Todos os produtos com estoque ok!', detail:`${produtos.length} produto(s) verificado(s)`, time:'', unread:false })
      }
      if (produtos.length === 0) {
        lista.push({ id:'vazio', icon:'📦', text:'Nenhum produto cadastrado ainda', detail:'Cadastre produtos para monitorar o estoque', time:'', unread:false })
      }
      setNotifs(lista)
    } catch {
      setNotifs([{ id:'offline', icon:'🔌', text:'Backend offline', detail:'Não foi possível carregar as notificações', time:'', unread:false }])
    } finally {
      setLoadingNotif(false)
    }
  }

  useEffect(() => {
    carregarNotificacoes()
    const interval = setInterval(carregarNotificacoes, 60000)
    return () => clearInterval(interval)
  }, [])

  /* fechar ao clicar fora */
  useEffect(() => {
    function onOut(e) {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [])

  function close() { setNotifOpen(false); setProfileOpen(false) }

  /* editar perfil */
  function handleEditPerfil(e) {
    e.preventDefault()
    setEditErro(''); setEditOk('')
    if (!editNome || !editEmail) { setEditErro('Preencha todos os campos'); return }
    // aqui chamaria a API quando tiver JWT
    setEditOk('Perfil atualizado com sucesso! ✅')
    setTimeout(() => { setEditOk(''); setShowEditPerfil(false) }, 2000)
  }

  /* alterar senha */
  function handleAlterarSenha(e) {
    e.preventDefault()
    setSenhaErro(''); setSenhaOk('')
    if (!senhaAtual || !senhaNova || !senhaConfirm) { setSenhaErro('Preencha todos os campos'); return }
    if (senhaNova.length < 6) { setSenhaErro('A nova senha deve ter ao menos 6 caracteres'); return }
    if (senhaNova !== senhaConfirm) { setSenhaErro('As senhas não coincidem'); return }
    setSenhaOk('Senha alterada com sucesso! ✅')
    setSenhaAtual(''); setSenhaNova(''); setSenhaConfirm('')
    setTimeout(() => { setSenhaOk(''); setShowSenha(false) }, 2000)
  }

  /* força da senha */
  function getForca(s) {
    if (!s) return { nivel: 0, label: '' }
    if (s.length < 6) return { nivel: 1, label: 'Muito curta' }
    if (s.length < 8) return { nivel: 2, label: 'Fraca' }
    const temMaiuscula = /[A-Z]/.test(s)
    const temNumero    = /[0-9]/.test(s)
    const temEspecial  = /[^a-zA-Z0-9]/.test(s)
    if (s.length >= 12 && temMaiuscula && temNumero && temEspecial) return { nivel: 4, label: 'Forte' }
    if (s.length >= 10 && temMaiuscula && temNumero) return { nivel: 3, label: 'Boa' }
    return { nivel: 2, label: 'Fraca' }
  }
  const forca = getForca(senhaNova)

  return (
    <>
      <header className={styles.header}>

        {/* ESQUERDA */}
        <div className={styles.left}>
          <button className={styles.hamburger} onClick={onToggleSidebar} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <div className={styles.logo} onClick={() => navigate('/cadastro')} style={{cursor:'pointer'}}>
            <span className={styles.stock}>Stock</span>
            <span className={styles.easy}>Easy</span>
          </div>
          <div className={styles.divider}/>
          <span className={styles.pageTag}>Painel</span>
        </div>

        {/* DIREITA */}
        <div className={styles.right}>

          {/* 🔔 Notificações */}
          <div className={styles.wrap} ref={notifRef}>
            <button
              className={`${styles.iconBtn} ${notifOpen ? styles.active : ''}`}
              onClick={() => { close(); setNotifOpen(v => !v) }}
              title="Notificações"
            >
              🔔
              {unread > 0 && <span className={styles.badge}>{unread}</span>}
            </button>

            {notifOpen && (
              <div className={`${styles.drop} ${styles.dropWide}`}>
                <div className={styles.dropHead}>
                  <span className={styles.dropTitle}>Notificações</span>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    {unread > 0 && (
                      <button className={styles.dropLink} onClick={() => setNotifs(p => p.map(n => ({...n, unread:false})))}>
                        Marcar como lidas
                      </button>
                    )}
                    <button className={styles.dropLink} onClick={carregarNotificacoes} title="Atualizar">🔄</button>
                  </div>
                </div>

                <div className={styles.notifScroll}>
                  {loadingNotif ? (
                    <div style={{padding:'20px', textAlign:'center', color:'var(--text-muted)', fontSize:14}}>⏳ Carregando...</div>
                  ) : notifs.map(n => (
                    <div key={n.id} className={`${styles.notifRow} ${n.unread ? styles.notifNew : ''}`}>
                      <span className={styles.notifEmoji}>{n.icon}</span>
                      <div className={styles.notifContent}>
                        <span className={styles.notifText}>{n.text}</span>
                        {n.detail && <span className={styles.notifDetail}>{n.detail}</span>}
                        {n.time   && <span className={styles.notifTime}>{n.time}</span>}
                      </div>
                      {n.unread && <span className={styles.notifDot}/>}
                    </div>
                  ))}
                </div>

                <div className={styles.dropFoot}>
                  <button className={styles.dropLink} onClick={() => { close(); navigate('/estoque') }}>
                    Ver módulo de estoque
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👤 Perfil */}
          <div className={styles.wrap} ref={profileRef}>
            <button
              className={`${styles.profileBtn} ${profileOpen ? styles.active : ''}`}
              onClick={() => { close(); setProfileOpen(v => !v) }}
            >
              <div className={styles.avatar}>{getInitials(user?.name)}</div>
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user?.name || 'Usuário'}</span>
                <span className={styles.userRole}>{user?.role || 'Administrador'}</span>
              </div>
              <span className={`${styles.chevron} ${profileOpen ? styles.chevronUp : ''}`}>▾</span>
            </button>

            {profileOpen && (
              <div className={styles.drop}>

                {/* card do perfil */}
                <div className={styles.profileCard}>
                  <div className={styles.avatarLg}>{getInitials(user?.name)}</div>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileName}>{user?.name || 'Usuário'}</div>
                    <div className={styles.profileEmail}>{user?.email || 'admin@stockeasy.com'}</div>
                    <span className={styles.profileBadge}>{user?.role || 'Administrador'}</span>
                  </div>
                </div>

                {/* toggle de tema */}
                <div className={styles.themeRow}>
                  <div className={styles.themeInfo}>
                    <span className={styles.themeEmoji}>{isDark ? '☀️' : '🌙'}</span>
                    <div>
                      <div className={styles.themeLabel}>Tema {isDark ? 'Claro' : 'Escuro'}</div>
                      <div className={styles.themeDesc}>Alternar aparência</div>
                    </div>
                  </div>
                  <button
                    className={`${styles.toggleTrack} ${isDark ? styles.toggleOn : ''}`}
                    onClick={toggleTheme}
                  >
                    <span className={styles.toggleThumb}/>
                  </button>
                </div>

                <div className={styles.sep}/>

                <button className={styles.dropItem} onClick={() => { close(); setShowEditPerfil(true) }}>
                  <span>✏️</span> Editar perfil
                </button>
                <button className={styles.dropItem} onClick={() => { close(); setShowSenha(true) }}>
                  <span>🔑</span> Alterar senha
                </button>

                <div className={styles.sep}/>

                <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={() => { close(); onLogout && onLogout(); navigate('/') }}>
                  <span>🚪</span> Sair da conta
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Modal Editar Perfil ── */}
      <Modal isOpen={showEditPerfil} onClose={() => { setShowEditPerfil(false); setEditErro(''); setEditOk('') }} title="Editar Perfil">
        <form onSubmit={handleEditPerfil} className={styles.formCol}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Nome completo</label>
            <input className={styles.formInput} value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Seu nome" />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>E-mail</label>
            <input className={styles.formInput} type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Permissão</label>
            <input className={styles.formInput} value={user?.role || 'Administrador'} readOnly style={{opacity:0.6, cursor:'not-allowed'}} />
          </div>
          {editErro && <div className={styles.alertErro}>✗ {editErro}</div>}
          {editOk   && <div className={styles.alertOk}>{editOk}</div>}
          <div className={styles.formFooter}>
            <button type="button" className={styles.btnSecondary} onClick={() => setShowEditPerfil(false)}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>Salvar alterações</button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Alterar Senha ── */}
      <Modal isOpen={showSenha} onClose={() => { setShowSenha(false); setSenhaErro(''); setSenhaOk('') }} title="Alterar Senha">
        <form onSubmit={handleAlterarSenha} className={styles.formCol}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Senha atual</label>
            <div className={styles.inputWrap}>
              <input className={styles.formInput} type={showPwd ? 'text' : 'password'} value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)}>{showPwd ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Nova senha</label>
            <input className={styles.formInput} type={showPwd ? 'text' : 'password'} value={senhaNova} onChange={e => setSenhaNova(e.target.value)} placeholder="Mínimo 6 caracteres" />
            {senhaNova && (
              <div className={styles.forcaWrap}>
                <div className={styles.forcaBarra}>
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`${styles.forcaSeg} ${i <= forca.nivel ? (
                      forca.nivel === 1 ? styles.forcaCurta :
                      forca.nivel === 2 ? styles.forcaFraca :
                      forca.nivel === 3 ? styles.forcaBoa   :
                      styles.forcaForte
                    ) : ''}`}/>
                  ))}
                </div>
                <span className={styles.forcaLabel}>{forca.label}</span>
              </div>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Confirmar nova senha</label>
            <input className={styles.formInput} type={showPwd ? 'text' : 'password'} value={senhaConfirm} onChange={e => setSenhaConfirm(e.target.value)} placeholder="Repita a nova senha" />
          </div>

          {senhaErro && <div className={styles.alertErro}>✗ {senhaErro}</div>}
          {senhaOk   && <div className={styles.alertOk}>{senhaOk}</div>}

          <div className={styles.formFooter}>
            <button type="button" className={styles.btnSecondary} onClick={() => setShowSenha(false)}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>Salvar senha</button>
          </div>
        </form>
      </Modal>
    </>
  )
}