const bcrypt  = require('bcryptjs')
const Usuario = require('../models/Usuario')

// GET /api/usuarios
exports.listar = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().select('-senha')
    res.json(usuarios)
  } catch (err) { next(err) }
}

// GET /api/usuarios/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha')
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.json(usuario)
  } catch (err) { next(err) }
}

// POST /api/usuarios — criptografa a senha antes de salvar
exports.criar = async (req, res, next) => {
  try {
    // verifica email duplicado
    const emailExiste = await Usuario.findOne({ email: req.body.email })
    if (emailExiste) {
      return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado' })
    }

    // criptografa a senha com BCrypt (10 rounds)
    const senhaCriptografada = await bcrypt.hash(req.body.senha, 10)

    const novo  = new Usuario({ ...req.body, senha: senhaCriptografada })
    const salvo = await novo.save()

    const { senha, ...semSenha } = salvo.toObject()
    res.status(201).json(semSenha)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado' })
    }
    next(err)
  }
}

// PUT /api/usuarios/:id
exports.atualizar = async (req, res, next) => {
  try {
    // verifica email duplicado em outro usuário
    if (req.body.email) {
      const emailExiste = await Usuario.findOne({ email: req.body.email, _id: { $ne: req.params.id } })
      if (emailExiste) {
        return res.status(400).json({ mensagem: 'Este e-mail já está sendo usado por outro usuário' })
      }
    }

    // se veio nova senha, criptografa antes de salvar
    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10)
    }

    const atualizado = await Usuario.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    ).select('-senha')

    if (!atualizado) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.json(atualizado)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Este e-mail já está sendo usado' })
    }
    next(err)
  }
}

// DELETE /api/usuarios/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await Usuario.findByIdAndDelete(req.params.id)
    if (!apagado) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.status(204).send()
  } catch (err) { next(err) }
}