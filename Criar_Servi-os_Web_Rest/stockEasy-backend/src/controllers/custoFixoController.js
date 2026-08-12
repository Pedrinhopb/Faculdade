const CustoFixo = require('../models/CustoFixo')

// GET /api/custos
exports.listar = async (req, res, next) => {
  try {
    const custos = await CustoFixo.find().sort({ criadoEm: -1 })
    res.json(custos)
  } catch (err) { next(err) }
}

// GET /api/custos/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const custo = await CustoFixo.findById(req.params.id)
    if (!custo) return res.status(404).json({ mensagem: 'Custo não encontrado' })
    res.json(custo)
  } catch (err) { next(err) }
}

// POST /api/custos
exports.criar = async (req, res, next) => {
  try {
    const novo  = new CustoFixo(req.body)
    const salvo = await novo.save()
    res.status(201).json(salvo)
  } catch (err) { next(err) }
}

// PUT /api/custos/:id
exports.atualizar = async (req, res, next) => {
  try {
    const atualizado = await CustoFixo.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!atualizado) return res.status(404).json({ mensagem: 'Custo não encontrado' })
    res.json(atualizado)
  } catch (err) { next(err) }
}

// DELETE /api/custos/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await CustoFixo.findByIdAndDelete(req.params.id)
    if (!apagado) return res.status(404).json({ mensagem: 'Custo não encontrado' })
    res.status(204).send()
  } catch (err) { next(err) }
}