import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import styles from '../styles/Auth.module.css'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', senha: '' })
  const [erro,    setErro]    = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErro('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.senha) {
      setErro('Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    setErro('')

    try {
      // autenticação real com JWT
      const res = await authAPI.login(form.email, form.senha)

      // salva o token e os dados do usuário
      localStorage.setItem('stockeasy_token', res.token)

      onLogin({
        name:  res.usuario.nome,
        email: res.usuario.email,
        role:  res.usuario.permissao,
        cargo: res.usuario.cargo,
        id:    res.usuario.id,
      })

      navigate('/cadastro')
    } catch (err) {
      // mensagem de erro do backend ou fallback genérico
      setErro(err.message || 'E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.decorCircleTop}/>
      <div className={styles.decorCircleBottom}/>

      <div className={styles.card}>
        <div className={styles.brand}>
          <strong className={styles.brandStrong}>
            <span className={styles.brandStock}>Stock</span>
            <span className={styles.brandEasy}>Easy</span>
          </strong>
        </div>

        <h1 className={styles.title}>Entrar na conta</h1>
        <p className={styles.subtitle}>Acesse o painel de controle</p>

        {erro && <div className={styles.error}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <div style={{ position:'relative' }}>
              <input
                className={styles.input}
                type={showPwd ? 'text' : 'password'}
                name="senha"
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPwd(v => !v)}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <div className={styles.forgot}>
              <a href="#">Esqueceu a senha?</a>
            </div>
          </div>

          <button
            type="submit"
            className={`${styles.btnPrimary} ${loading ? styles.disabled : ''}`}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  )
}