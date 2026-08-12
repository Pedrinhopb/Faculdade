import React from 'react'
import styles from './EmptyState.module.css'

export default function EmptyState({ icone, titulo, descricao, labelBotao, onBotao }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icone}</div>
      <h3 className={styles.title}>{titulo}</h3>
      <p className={styles.description}>{descricao}</p>
      {labelBotao && onBotao && (
        <button type="button" className={styles.button} onClick={onBotao}>{labelBotao}</button>
      )}
    </div>
  )
}
