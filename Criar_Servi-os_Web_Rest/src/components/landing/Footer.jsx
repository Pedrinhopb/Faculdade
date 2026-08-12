import React from 'react'
import styles from './Footer.module.css'

const nav  = [{l:'Serviços',h:'#servicos'},{l:'Avaliações',h:'#avaliacoes'},{l:'FAQ',h:'#faq'},{l:'Contato',h:'#contato'}]
const leg  = [{l:'Privacidade',h:'#'},{l:'Termos de uso',h:'#'},{l:'Suporte',h:'#'}]
const soc  = [{l:'Instagram',i:'📷',h:'#'},{l:'LinkedIn',i:'💼',h:'#'},{l:'WhatsApp',i:'💬',h:'#'}]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}><span className={styles.stock}>Stock</span><span className={styles.easy}>Easy</span></div>
          <p className={styles.tagline}>Gestão de estoque inteligente para pequenas e médias empresas.</p>
          <div className={styles.socials}>
            {soc.map(s => <a key={s.l} href={s.h} className={styles.socialBtn} title={s.l}>{s.i}</a>)}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navegação</h4>
          <ul className={styles.colLinks}>{nav.map(l => <li key={l.l}><a href={l.h}>{l.l}</a></li>)}</ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Legal</h4>
          <ul className={styles.colLinks}>{leg.map(l => <li key={l.l}><a href={l.h}>{l.l}</a></li>)}</ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contato</h4>
          <ul className={styles.colLinks}>
            <li><a href="mailto:contato@stockeasy.com.br">contato@stockeasy.com.br</a></li>
            <li><a href="#">(83) 9 9999-0000</a></li>
            <li><span className={styles.hours}>Seg a Sex, 8h às 18h</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>© 2025 StockEasy. Todos os direitos reservados.</span>
        <span className={styles.made}>Feito com 💚 no Brasil</span>
      </div>
    </footer>
  )
}