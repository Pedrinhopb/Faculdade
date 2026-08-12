import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header  from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import styles  from '../styles/WorkInProgress.module.css'

export default function WorkInProgress({ title, user, onLogout, sidebarAberta, onToggleSidebar, onFecharSidebar }) {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <Header user={user} onLogout={onLogout} onToggleSidebar={onToggleSidebar} />
      <Sidebar aberta={sidebarAberta} onFechar={onFecharSidebar} onLogout={onLogout} onToggle={onToggleSidebar} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>🚧</div>
          <p className={styles.label}>Em desenvolvimento</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>Estamos trabalhando nesta página. Em breve ela estará disponível com todas as funcionalidades.</p>
          <div className={styles.progress}><div className={styles.progressBar}/></div>
          <p className={styles.progressLabel}>Em breve...</p>
          <button className={styles.backBtn} onClick={() => navigate('/cadastro')}>← Voltar ao Cadastro</button>
        </div>
      </main>
    </div>
  )
}