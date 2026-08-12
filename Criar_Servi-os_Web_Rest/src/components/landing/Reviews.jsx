import React from 'react'
import styles from './Reviews.module.css'

const reviews = [
  { name:'Marcos Ribeiro', title:'Dono, Mercearia Central',  stars:5, quote:'Antes perdíamos produtos por falta de controle. Hoje sabemos exatamente o que temos e quando repor. A StockEasy transformou nossa operação.' },
  { name:'Patrícia Souza',  title:'Gerente, Farmácia Vida',   stars:5, quote:'Interface super simples. Minha equipe aprendeu em menos de uma hora. Os relatórios nos ajudam muito na hora de fazer pedidos.' },
  { name:'Lucas Oliveira',  title:'Diretor, Papelaria Mix',   stars:4, quote:'Ótimo custo-benefício. O alerta de estoque mínimo sozinho já valeu o investimento. Nunca mais fiquei sem produto.' },
]

function initials(name) { return name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() }

function Stars({ count, max = 5 }) {
  return (
    <div className={styles.stars}>
      {Array.from({length: max}).map((_,i) => (
        <span key={i} className={i < count ? styles.starOn : styles.starOff}>★</span>
      ))}
      <span className={styles.starsCount}>{count}.0</span>
    </div>
  )
}

export default function Reviews() {
  const avg = (reviews.reduce((s,r) => s + r.stars, 0) / reviews.length).toFixed(1)
  return (
    <section id="avaliacoes" className={styles.section}>

      <div className={styles.head}>
        <span className={styles.label}>Depoimentos</span>
        <h2>O que os clientes dizem</h2>
        <div className={styles.rating}>
          <div className={styles.ratingScore}>{avg}</div>
          <div>
            <div className={styles.ratingStars}>{'★'.repeat(5)}</div>
            <div className={styles.ratingCount}>Baseado em {reviews.length} avaliações</div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {reviews.map(r => (
          <article key={r.name} className={styles.card}>
            <Stars count={r.stars}/>
            <p className={styles.quote}>"{r.quote}"</p>
            <div className={styles.reviewer}>
              <div className={styles.avatar}>{initials(r.name)}</div>
              <div>
                <div className={styles.name}>{r.name}</div>
                <div className={styles.role}>{r.title}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

    </section>
  )
}