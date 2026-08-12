import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from '../styles/Auth.module.css'

export default function RegisterPage({ onRegister }){
  const [nome,setNome] = useState('Administrador')
  const [email,setEmail] = useState('admin@hotmail.com')
  const [senha,setSenha] = useState('admin')
  const [confirm,setConfirm] = useState('admin')
  const [agree,setAgree] = useState(true)
  const [erro,setErro] = useState('')
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const strength = useMemo(()=>{
    const len = senha.length
    const hasNum = /\d/.test(senha)
    if(len >= 8 && hasNum) return 4
    if(len >= 6) return 3
    if(len >= 3) return 2
    if(len >= 1) return 1
    return 0
  },[senha])

  function submit(e){
    e.preventDefault()
    setErro('')
    if(nome.length < 3) return setErro('Nome deve ter ao menos 3 caracteres')
    if(!email.includes('@')) return setErro('E-mail inválido')
    if(senha.length < 6) return setErro('Senha deve ter ao menos 6 caracteres')
    if(senha !== confirm) return setErro('Senhas não conferem')
    if(!agree) return setErro('Você deve concordar com os termos')

    setLoading(true)
    const user = { name: nome, email }
    setTimeout(()=>{
      onRegister && onRegister(user)
      setLoading(false)
      navigate('/cadastro')
    },1000)
  }

  const strengthLabel = ['','Fraca','Média','Forte','Muito forte'][strength]

  return (
    <div className={styles.page}>
      <div className={styles.decorCircleTop}></div>
      <div className={styles.decorCircleBottom}></div>
      <form onSubmit={submit} className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandStrong}><span className={styles.brandStock}>Stock</span><span className={styles.brandEasy}>Easy</span></div>
        </div>
        <p className={styles.subtitle}>Preencha os dados para começar</p>
        {erro && <div className={styles.error}>{erro}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Nome completo</label>
          <input className={styles.input} value={nome} onChange={e=>setNome(e.target.value)} type="text" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>E-mail</label>
          <input className={styles.input} value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Senha</label>
          <input className={styles.input} value={senha} onChange={e=>setSenha(e.target.value)} type="password" />
          <div className={styles.strength}>
            <div className={styles.strengthBar} aria-hidden>
              <div className={`${styles.seg} ${strength>=1 ? 'on red' : ''}`}></div>
              <div className={`${styles.seg} ${strength>=2 ? 'on amber' : ''}`}></div>
              <div className={`${styles.seg} ${strength>=3 ? 'on green' : ''}`}></div>
              <div className={`${styles.seg} ${strength>=4 ? 'on greenDark' : ''}`}></div>
            </div>
            <div className={styles.strengthLabel}>{strengthLabel}</div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirmar senha</label>
          <input className={styles.input} value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" />
        </div>

        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <input id="agree" type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{accentColor:'#1a7a4a'}} />
          <label htmlFor="agree" style={{color:'rgba(255,255,255,0.8)',fontSize:14}}>Concordo com os Termos de uso e Política de privacidade</label>
        </div>

        <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.disabled : ''}`} disabled={loading}>{loading ? 'Criando conta...' : 'Criar conta'}</button>

        <div className={styles.footerText}>Já tem uma conta? <Link to="/login" className={styles.link}>Entrar agora</Link></div>
      </form>
    </div>
  )
}
