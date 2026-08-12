import React, { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('✓ Mensagem enviada com sucesso!')
    setTimeout(() => setStatus(''), 3000)
    setForm({ name:'', email:'', phone:'', message:'' })
  }

  return (
    <section id="contato" className={styles.section}>
      <div className={styles.content}>
        <span className={styles.label}>Entre em contato</span>
        <h2 className={styles.title}>Pronto para começar?</h2>
        <p className={styles.subtitle}>Entre em contato hoje e veja como a StockEasy pode modernizar sua gestão de estoque.</p>

        <div className={styles.grid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div>
              <label className={styles.fieldLabel}>Nome</label>
              <input className={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="João Silva" required />
            </div>
            <div>
              <label className={styles.fieldLabel}>E-mail</label>
              <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="joao@email.com" required />
            </div>
            <div>
              <label className={styles.fieldLabel}>Telefone (opcional)</label>
              <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="(83) 9 9999-0000" />
            </div>
            <div>
              <label className={styles.fieldLabel}>Mensagem</label>
              <textarea className={styles.textarea} name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Como podemos ajudar?" required />
            </div>
            <button type="submit" className={styles.submit}>Enviar mensagem →</button>
            {status && <div className={styles.toast}>{status}</div>}
          </form>

          <div className={styles.infoBox}>
            <h3>Fale com nossa equipe</h3>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📧</div>
              <div className={styles.infoText}><strong>E-mail</strong><p>contato@stockeasy.com.br</p></div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>💬</div>
              <div className={styles.infoText}><strong>WhatsApp</strong><p>(83) 9 9999-0000</p></div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>🕐</div>
              <div className={styles.infoText}><strong>Horário</strong><p>Seg a Sex, 8h às 18h</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}