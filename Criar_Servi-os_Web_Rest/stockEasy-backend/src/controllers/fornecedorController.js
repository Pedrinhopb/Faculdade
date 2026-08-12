const Fornecedor = require('../models/Fornecedor');

// GET /api/fornecedores
exports.listar = async (req, res, next) => {
  try {
    const fornecedores = await Fornecedor.find()
    res.json(fornecedores)
  } catch (err) { next(err) }
}

// GET /api/fornecedores/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id)
    if (!fornecedor) return res.status(404).json({ mensagem: 'Fornecedor não encontrado' })
    res.json(fornecedor)
  } catch (err) { next(err) }
}

// POST /api/fornecedores
exports.criar = async (req, res, next) => {
  try {
    // verifica CNPJ duplicado
    const cnpjExiste = await Fornecedor.findOne({ cnpj: req.body.cnpj })
    if (cnpjExiste) {
      return res.status(400).json({ mensagem: 'Este CNPJ já está cadastrado' })
    }

    // verifica email duplicado
    if (req.body.email) {
      const emailExiste = await Fornecedor.findOne({ email: req.body.email })
      if (emailExiste) {
        return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado para outro fornecedor' })
      }
    }

    const novo  = new Fornecedor(req.body)
    const salvo = await novo.save()
    res.status(201).json(salvo)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'CNPJ já cadastrado' })
    }
    next(err)
  }
}

// PUT /api/fornecedores/:id
exports.atualizar = async (req, res, next) => {
  try {
    // verifica se CNPJ já pertence a outro fornecedor
    if (req.body.cnpj) {
      const cnpjExiste = await Fornecedor.findOne({ cnpj: req.body.cnpj, _id: { $ne: req.params.id } })
      if (cnpjExiste) {
        return res.status(400).json({ mensagem: 'Este CNPJ já está sendo usado por outro fornecedor' })
      }
    }

    // verifica se email já pertence a outro fornecedor
    if (req.body.email) {
      const emailExiste = await Fornecedor.findOne({ email: req.body.email, _id: { $ne: req.params.id } })
      if (emailExiste) {
        return res.status(400).json({ mensagem: 'Este e-mail já está sendo usado por outro fornecedor' })
      }
    }

    const atualizado = await Fornecedor.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!atualizado) return res.status(404).json({ mensagem: 'Fornecedor não encontrado' })
    res.json(atualizado)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'CNPJ já cadastrado' })
    }
    next(err)
  }
}

// DELETE /api/fornecedores/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await Fornecedor.findByIdAndDelete(req.params.id)
    if (!apagado) return res.status(404).json({ mensagem: 'Fornecedor não encontrado' })
    res.status(204).send()
  } catch (err) { next(err) }
}