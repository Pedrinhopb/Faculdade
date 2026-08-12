const Produto = require('../models/Produto');

// GET /api/produtos
exports.listar = async (req, res, next) => {
  try {
    const produtos = await Produto.find()
    res.json(produtos)
  } catch (err) { next(err) }
}

// GET /api/produtos/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const produto = await Produto.findById(req.params.id)
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' })
    res.json(produto)
  } catch (err) { next(err) }
}

// POST /api/produtos
exports.criar = async (req, res, next) => {
  try {
    // verifica código de barras duplicado
    const codExiste = await Produto.findOne({ codigoBarras: req.body.codigoBarras })
    if (codExiste) {
      return res.status(400).json({ mensagem: 'Este código de barras já está cadastrado' })
    }

    const novo  = new Produto(req.body)
    const salvo = await novo.save()
    res.status(201).json(salvo)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Este código de barras já está cadastrado' })
    }
    next(err)
  }
}

// PUT /api/produtos/:id
exports.atualizar = async (req, res, next) => {
  try {
    // verifica se código já pertence a outro produto
    if (req.body.codigoBarras) {
      const codExiste = await Produto.findOne({ codigoBarras: req.body.codigoBarras, _id: { $ne: req.params.id } })
      if (codExiste) {
        return res.status(400).json({ mensagem: 'Este código de barras já está sendo usado por outro produto' })
      }
    }

    const atualizado = await Produto.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!atualizado) return res.status(404).json({ mensagem: 'Produto não encontrado' })
    res.json(atualizado)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Este código de barras já está sendo usado' })
    }
    next(err)
  }
}

// DELETE /api/produtos/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await Produto.findByIdAndDelete(req.params.id)
    if (!apagado) return res.status(404).json({ mensagem: 'Produto não encontrado' })
    res.status(204).send()
  } catch (err) { next(err) }
}