const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha' })
    }

    // busca usuário pelo email
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos' })
    }

    // verifica se está ativo
    if (usuario.status === 'Inativo') {
      return res.status(403).json({ mensagem: 'Usuário inativo — contate o administrador' })
    }

    // compara senha com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos' })
    }

    // gera o token JWT válido por 8 horas
    const token = jwt.sign(
      {
        id:        usuario._id,
        nome:      usuario.nome,
        email:     usuario.email,
        permissao: usuario.permissao,
        cargo:     usuario.cargo,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: {
        id:        usuario._id,
        nome:      usuario.nome,
        email:     usuario.email,
        cargo:     usuario.cargo,
        permissao: usuario.permissao,
        status:    usuario.status,
      }
    })
  } catch (err) { next(err) }
}

// GET /api/auth/me — retorna dados do usuário logado
exports.me = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-senha')
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.json(usuario)
  } catch (err) { next(err) }
}