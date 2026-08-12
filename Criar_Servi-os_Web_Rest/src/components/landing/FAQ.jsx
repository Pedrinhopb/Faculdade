import React, { useRef, useState } from 'react'
import styles from './FAQ.module.css'

const faqs = [
  { q:'Preciso instalar algum programa?',  a:'Não! A StockEasy é 100% online. Basta ter um navegador e conexão com internet. Funciona perfeitamente no computador, tablet e celular.' },
  { q:'Posso testar antes de contratar?',  a:'Sim! Oferecemos 14 dias de teste gratuito, sem precisar de cartão de crédito. Você terá acesso a todas as funcionalidades durante o período.' },
  { q:'Quantos usuários posso cadastrar?', a:'Depende do plano: básico permite até 3 usuários, profissional até 10 e empresarial é ilimitado. Você pode mudar de plano a qualquer momento.' },
  { q:'Meus dados ficam seguros?',         a:'Absolutamente. Usamos criptografia de ponta a ponta e backups automáticos diários. Seus dados são somente seus — nunca compartilhamos com terceiros.' },
  { q:'Posso cancelar quando quiser?',     a:'Sim, sem multas nem burocracia. Você cancela a qualquer momento direto pelo painel da sua conta, sem precisar entrar em contato.' },
  { q:'Tem integração com outros sistemas?',a:'Estamos desenvolvendo integrações com os principais ERPs e plataformas de e-commerce do mercado. Fique atento às novidades!' },
]

function Item({ item, open, onToggle }) {
  const bodyRef = useRef(null)
  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button className={styles.question} onClick={onToggle}>
        <span>{item.q}</span>
        <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`}>+</span>
      </button>
      <div
        className={styles.answerWrap}
        style={{ maxHeight: open ? (bodyRef.current?.scrollHeight ?? 200) + 'px' : '0px' }}
      >
        <div ref={bodyRef} className={styles.answer}>{item.a}</div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [active, setActive] = useState(null)
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.label}>FAQ</span>
        <h2>Perguntas mais frequentes</h2>
        <p className={styles.sub}>Respondemos as dúvidas mais comuns sobre a plataforma.</p>
      </div>
      <div className={styles.list}>
        {faqs.map((item, i) => (
          <Item
            key={item.q}
            item={item}
            open={i === active}
            onToggle={() => setActive(i === active ? null : i)}
          />
        ))}
      </div>
    </section>
  )
}