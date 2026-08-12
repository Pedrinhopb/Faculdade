const jwt = require('jsonwebtoken')

// ── Verifica se o token JWT é válido ──
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Acesso negado — token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Sessão expirada — faça login novamente' })
    }
    return res.status(401).json({ mensagem: 'Token inválido' })
  }
}

// ── Bloqueia Visualizador em rotas de escrita ──
const apenasAdmin = (req, res, next) => {
  const permissao = req.usuario?.permissao

  if (permissao === 'Visualizador') {
    return res.status(403).json({
      mensagem: 'Acesso negado — Visualizadores não podem realizar esta ação'
    })
  }
  next()
}

// ── Apenas Administrador ──
const somenteAdmin = (req, res, next) => {
  if (req.usuario?.permissao !== 'Administrador') {
    return res.status(403).json({
      mensagem: 'Acesso negado — apenas Administradores podem realizar esta ação'
    })
  }
  next()
}

module.exports = auth
module.exports.apenasAdmin  = apenasAdmin
module.exports.somenteAdmin = somenteAdmin