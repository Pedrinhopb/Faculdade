import React, { useEffect, useRef, useState } from 'react'
import styles from './Services.module.css'

/* Contador animado ao entrar na viewport */
function CounterOnView({ target, prefix = '', suffix = '' }) {
  const [val, setVal]       = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const raf = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start = null
    const duration = 1600
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [started, target])

  return <span ref={ref}>{prefix}{val.toLocaleString('pt-BR')}{suffix}</span>
}

const numbers = [
  { target: 500,  prefix: '+', suffix: '',   label: 'Empresas ativas'    },
  { target: 98,   prefix: '',  suffix: '%',  label: 'Satisfação dos clientes' },
  { target: 1200, prefix: '+', suffix: '',   label: 'Produtos gerenciados / dia' },
  { target: 14,   prefix: '',  suffix: 'd',  label: 'Teste gratuito'     },
]

const items = [
  { icon: '📦', title: 'Cadastro de produtos',    desc: 'Registre produtos com categorias, preços, fornecedores e fotos.',           color: '#1a7a4a' },
  { icon: '🔄', title: 'Movimentações',           desc: 'Registre entradas e saídas com histórico completo e rastreável.',           color: '#3b82f6' },
  { icon: '📊', title: 'Relatórios em tempo real',desc: 'Dashboards e gráficos atualizados automaticamente para decisões rápidas.',  color: '#8b5cf6' },
  { icon: '🔔', title: 'Alertas de estoque',      desc: 'Seja notificado antes de ficar sem produto em alta temporada.',             color: '#f59e0b' },
  { icon: '👥', title: 'Multi-usuário',           desc: 'Gerencie permissões por nível: administrador, operador ou visualizador.',   color: '#ec4899' },
  { icon: '☁️', title: '100% na nuvem',           desc: 'Acesse de qualquer dispositivo. Backup automático diário dos seus dados.',  color: '#22a860' },
]

export default function Services() {
  return (
    <section id="servicos" className={styles.section}>

      {/* números impactantes */}
      <div className={styles.numbers}>
        {numbers.map(n => (
          <div key={n.label} className={styles.numberItem}>
            <div className={styles.numberValue}>
              <CounterOnView target={n.target} prefix={n.prefix} suffix={n.suffix}/>
            </div>
            <div className={styles.numberLabel}>{n.label}</div>
          </div>
        ))}
      </div>

      {/* cabeçalho */}
      <div className={styles.head}>
        <span className={styles.label}>O que oferecemos</span>
        <h2>Tudo que você precisa<br/>para gerir seu estoque</h2>
        <p className={styles.headSub}>Ferramentas pensadas para quem precisa de agilidade, precisão e controle total.</p>
      </div>

      {/* cards */}
      <div className={styles.grid}>
        {items.map((item, i) => (
          <article key={item.title} className={styles.card} style={{'--accent': item.color}}>
            <div className={styles.cardGlow}/>
            <div className={styles.icon}>
              <span>{item.icon}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className={styles.cardArrow}>→</div>
          </article>
        ))}
      </div>

    </section>
  )
}