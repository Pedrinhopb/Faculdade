import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Hero.module.css'

/* ── contador animado com easing ── */
function Counter({ target, prefix = '', suffix = '', duration = 1800, decimals = 0 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(parseFloat((ease * target).toFixed(decimals)))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, decimals])
  return <>{prefix}{val.toLocaleString('pt-BR')}{suffix}</>
}

/* ── barra animada ── */
function Bar({ h, delay, highlight }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{
      flex: 1, minWidth: 0,
      height: on ? `${h}%` : '3px',
      background: highlight ? 'var(--verde-claro)' : 'var(--verde)',
      borderRadius: '4px 4px 0 0',
      opacity: highlight ? 1 : 0.75,
      transition: `height 0.8s cubic-bezier(0.34,1.4,0.64,1) ${delay}ms`,
      cursor: 'default',
    }}/>
  )
}

/* ── linha do gráfico SVG animada ── */
function LineChart() {
  const points = [20,45,32,60,48,72,55,80,65,90,75,95]
  const w = 300, h = 80
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const ys = points.map(v => h - (v / 100) * h)
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const area = path + ` L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 64, display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a7a4a" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#1a7a4a" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a7a4a"/>
          <stop offset="100%" stopColor="#22a860"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)"/>
      <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="4" fill="#22a860"/>
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="8" fill="#22a860" opacity="0.2"/>
    </svg>
  )
}

const barData   = [36,52,68,44,74,58,82]
const statsData = [
  { value:45,  prefix:'+', suffix:'%', label:'Estoque otimizado',    desc:'Menos perdas e mais precisão.'      },
  { fixed:'24/7',                      label:'Alertas inteligentes', desc:'Notificações em tempo real.'        },
  { value:8,   prefix:'',  suffix:'s', label:'Decisões mais rápidas',desc:'Relatórios claros e instantâneos.' },
]
const metrics = [
  { label:'Produtos',   value:1284, prefix:'',   suffix:''  },
  { label:'Est. baixo', value:7,    prefix:'',   suffix:''  },
  { label:'Entradas',   value:48,   prefix:'R$', suffix:'k' },
  { label:'Saídas',     value:31,   prefix:'R$', suffix:'k' },
]

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className={styles.hero}>
      <div className={styles.radial}/>

      {/* partículas flutuantes */}
      <div className={styles.particles} aria-hidden>
        {[
          {x:8,  y:18, s:6,  d:4.2, dl:0,   o:0.13},
          {x:88, y:12, s:4,  d:5.1, dl:1.2, o:0.09},
          {x:72, y:68, s:8,  d:6.3, dl:0.6, o:0.07},
          {x:18, y:78, s:5,  d:4.8, dl:2.1, o:0.11},
          {x:92, y:52, s:3,  d:7.0, dl:1.8, o:0.08},
          {x:48, y:8,  s:4,  d:5.5, dl:0.9, o:0.07},
          {x:32, y:55, s:3,  d:3.8, dl:3.0, o:0.06},
          {x:62, y:35, s:5,  d:4.5, dl:1.5, o:0.09},
        ].map((p,i) => (
          <div key={i} className={styles.particle} style={{
            left:`${p.x}%`, top:`${p.y}%`,
            width:p.s, height:p.s,
            animationDuration:`${p.d}s`,
            animationDelay:`${p.dl}s`,
            opacity:p.o,
          }}/>
        ))}
      </div>

      <div className={styles.inner}>
        {/* COPY */}
        <div className={styles.copy}>
          <div className={styles.badge}>
            <span className={styles.badgePulse}/>
            <span>Gestão de estoque inteligente</span>
          </div>

          <h1 className={styles.title}>
            Transforme seu estoque<br/>
            <span className={styles.titleAccent}>em vantagem competitiva</span>
          </h1>

          <p className={styles.subtitle}>
            A StockEasy é a plataforma ideal para pequenas e médias empresas
            gerenciarem produtos, movimentações e relatórios em tempo real.
          </p>

          <div className={styles.cta}>
            <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Começar agora
              <span className={styles.btnArrow}>→</span>
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/register')}>
              Criar conta grátis
            </button>
          </div>

          <div className={styles.trust}>
            <span className={styles.trustAvatars}>
              {['MR','PS','LO','AC','RB'].map(i => (
                <span key={i} className={styles.trustAvatar}>{i}</span>
              ))}
            </span>
            <span className={styles.trustText}>
              <strong>+500 empresas</strong> já usam o StockEasy
            </span>
          </div>

          {/* stat cards com contador */}
          <div className={styles.stats}>
            {statsData.map((s,i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>
                  {s.fixed
                    ? s.fixed
                    : <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} duration={1600+i*200}/>
                  }
                </div>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className={styles.preview}>
          {/* janela do browser */}
          <div className={styles.browserBar}>
            <span className={styles.dot} style={{background:'#ff5f56'}}/>
            <span className={styles.dot} style={{background:'#ffbd2e'}}/>
            <span className={styles.dot} style={{background:'#27c93f'}}/>
            <span className={styles.browserUrl}>stockeasy.app/dashboard</span>
          </div>

          <div className={styles.previewBody}>
            {/* métricas */}
            <div className={styles.metricsRow}>
              {metrics.map((m,i) => (
                <div key={m.label} className={styles.metricBox}>
                  <div className={styles.metricLabel}>{m.label}</div>
                  <div className={styles.metricValue}>
                    <Counter target={m.value} prefix={m.prefix} suffix={m.suffix} duration={1400+i*150}/>
                  </div>
                </div>
              ))}
            </div>

            {/* gráfico de linha */}
            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Faturamento mensal</span>
                <span className={styles.chartBadge}>↑ +18%</span>
              </div>
              <LineChart/>
            </div>

            {/* barras + mini lista */}
            <div className={styles.bottomRow}>
              <div className={styles.barsBox}>
                <div className={styles.barsLabel}>Movimentações — 7 dias</div>
                <div className={styles.bars}>
                  {barData.map((h,i) => <Bar key={i} h={h} delay={i*90} highlight={i===4}/>)}
                </div>
              </div>
              <div className={styles.alertsBox}>
                <div className={styles.alertsLabel}>⚠️ Estoque baixo</div>
                {['Whey 1kg','Cabo USB','Caneta'].map((p,i) => (
                  <div key={i} className={styles.alertRow}>
                    <span className={styles.alertDot}/>
                    <span className={styles.alertName}>{p}</span>
                    <span className={styles.alertTag}>Crítico</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(1);   }
          100% { transform: translateY(-20px) scale(1.15); }
        }
      `}</style>
    </section>
  )
}