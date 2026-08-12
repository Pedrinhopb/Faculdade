const Cliente = require('../models/Cliente');

// GET /api/clientes
exports.listar = async (req, res, next) => {
  try {
    const clientes = await Cliente.find()
    res.json(clientes)
  } catch (err) { next(err) }
}

// GET /api/clientes/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    res.json(cliente)
  } catch (err) { next(err) }
}

// POST /api/clientes
exports.criar = async (req, res, next) => {
  try {
    // verifica CPF/CNPJ duplicado
    const docExiste = await Cliente.findOne({ documento: req.body.documento })
    if (docExiste) {
      return res.status(400).json({ mensagem: 'Este CPF/CNPJ já está cadastrado' })
    }

    // verifica email duplicado
    if (req.body.email) {
      const emailExiste = await Cliente.findOne({ email: req.body.email })
      if (emailExiste) {
        return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado para outro cliente' })
      }
    }

    const novo  = new Cliente(req.body)
    const salvo = await novo.save()
    res.status(201).json(salvo)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'CPF/CNPJ já cadastrado' })
    }
    next(err)
  }
}

// PUT /api/clientes/:id
exports.atualizar = async (req, res, next) => {
  try {
    // verifica se CPF/CNPJ já pertence a outro cliente
    if (req.body.documento) {
      const docExiste = await Cliente.findOne({ documento: req.body.documento, _id: { $ne: req.params.id } })
      if (docExiste) {
        return res.status(400).json({ mensagem: 'Este CPF/CNPJ já está sendo usado por outro cliente' })
      }
    }

    // verifica se email já pertence a outro cliente
    if (req.body.email) {
      const emailExiste = await Cliente.findOne({ email: req.body.email, _id: { $ne: req.params.id } })
      if (emailExiste) {
        return res.status(400).json({ mensagem: 'Este e-mail já está sendo usado por outro cliente' })
      }
    }

    const atualizado = await Cliente.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!atualizado) return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    res.json(atualizado)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'CPF/CNPJ já cadastrado' })
    }
    next(err)
  }
}

// DELETE /api/clientes/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await Cliente.findByIdAndDelete(req.params.id)
    if (!apagado) return res.status(404).json({ mensagem: 'Fornecedor não encontrado' })
    res.status(204).send()
  } catch (err) { next(err) }
}