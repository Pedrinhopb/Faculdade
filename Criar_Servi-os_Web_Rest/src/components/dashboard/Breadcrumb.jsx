import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export default function Breadcrumb({ abaAtiva }) {
  const location = useLocation()
  return (
    <div className={styles.breadcrumb}>
      <Link to="/cadastro" className={styles.home}>Início</Link>
      <span className={styles.separator}>›</span>
      <span className={styles.page}>Cadastro</span>
      <span className={styles.separator}>›</span>
      <span className={styles.active}>{abaAtiva}</span>
    </div>
  )
}
