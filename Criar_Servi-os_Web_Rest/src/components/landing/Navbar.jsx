import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import styles from './Navbar.module.css'

const links = [
  { label: 'Serviços',   href: '#servicos'  },
  { label: 'Avaliações', href: '#avaliacoes' },
  { label: 'FAQ',        href: '#faq'        },
  { label: 'Contato',    href: '#contato'    },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = theme === 'dark'

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.stock}>Stock</span>
          <span className={styles.easy}>Easy</span>
        </div>

        <nav className={styles.links}>
          {links.map(link => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className={styles.actions}>
          {/* Toggle de tema */}
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
          >
            <span className={styles.themeBtnIcon}>{isDark ? '☀️' : '🌙'}</span>
            <span className={styles.themeBtnLabel}>{isDark ? 'Claro' : 'Escuro'}</span>
          </button>

          {/* Apenas botão de Entrar — cadastro só pelo admin */}
          <button className={styles.loginButton} onClick={() => navigate('/login')}>
            Entrar →
          </button>
        </div>
      </div>
    </header>
  )
}