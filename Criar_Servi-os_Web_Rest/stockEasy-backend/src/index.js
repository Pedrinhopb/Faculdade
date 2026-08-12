require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const express           = require('express')
const cors              = require('cors')
const connectDB         = require('./config/db')
const logMiddleware     = require('./middlewares/logMiddleware')
const auth              = require('./middlewares/authMiddleware')

// rotas
const authRouter          = require('./routes/auth')
const usuariosRouter      = require('./routes/usuarios')
const produtosRouter      = require('./routes/produtos')
const fornecedoresRouter  = require('./routes/fornecedores')
const clientesRouter      = require('./routes/clientes')
const custosRouter        = require('./routes/custos')
const configuracoesRouter = require('./routes/configuracoes')

const app  = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors())
app.use(express.json())
app.use(logMiddleware)

// ── rotas públicas (sem token) ──
app.use('/api/auth', authRouter)

// ── rotas protegidas (exigem token JWT) ──
app.use('/api/usuarios',      auth, usuariosRouter)
app.use('/api/produtos',      auth, produtosRouter)
app.use('/api/fornecedores',  auth, fornecedoresRouter)
app.use('/api/clientes',      auth, clientesRouter)
app.use('/api/custos',        auth, custosRouter)
app.use('/api/configuracoes', auth, configuracoesRouter)

app.get('/', (req, res) => {
  res.json({ mensagem: '🚀 API StockEasy funcionando!' })
})

// middleware de erro genérico
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ erro: 'Algo deu errado no servidor' })
})

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`)
})