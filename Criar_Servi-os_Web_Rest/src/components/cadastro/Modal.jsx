import React from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose && onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
