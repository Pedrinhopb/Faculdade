import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Sidebar.module.css'

const sections = [
  {
    title: 'PRINCIPAL',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    ],
  },
  {
    title: 'GESTÃO',
    items: [
      { key: 'administrativo', label: 'Administrativo', icon: '🏭', path: '/administrativo' },
      { key: 'cadastro',       label: 'Cadastro',       icon: '📋', path: '/cadastro'       },
      { key: 'estoque',        label: 'Estoque',        icon: '📦', path: '/estoque'        },
      { key: 'financeiro',     label: 'Financeiro',     icon: '💰', path: '/financeiro'     },
    ],
  },
  {
    title: 'SUPORTE',
    items: [
      { key: 'ajuda', label: 'Ajuda', icon: '❓', path: '/ajuda' },
    ],
  },
]

export default function Sidebar({ aberta, onFechar, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    onLogout && onLogout()
    navigate('/')
  }

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${aberta ? styles.expanded : ''}`}>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(v => !v)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <div className={styles.collapseBtnInner}>
            <span className={`${styles.collapseArrow} ${collapsed ? styles.collapseArrowRight : ''}`}>‹</span>
            {!collapsed && <span className={styles.collapseBtnText}>Recolher</span>}
          </div>
        </button>

        <nav className={styles.menu}>
          {sections.map(section => (
            <div key={section.title} className={styles.section}>
              {!collapsed && <div className={styles.sectionTitle}>{section.title}</div>}
              {section.items.map(item => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onFechar}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.linkIcon}>{item.icon}</span>
                  {!collapsed && <span className={styles.linkLabel}>{item.label}</span>}
                  {collapsed  && <span className={styles.tooltip}>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className={styles.logout} onClick={handleLogout}>
          <span className={styles.linkIcon}>🚪</span>
          {!collapsed && <span className={styles.linkLabel}>Sair</span>}
          {collapsed  && <span className={styles.tooltip}>Sair</span>}
        </button>

      </aside>

      {aberta && <div className={styles.overlay} onClick={onFechar} />}
    </>
  )
}