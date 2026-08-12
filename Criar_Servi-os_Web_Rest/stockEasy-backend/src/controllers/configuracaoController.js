const Configuracao = require('../models/Configuracao')

// GET /api/configuracoes — retorna todas as configs
exports.listar = async (req, res, next) => {
  try {
    const configs = await Configuracao.find()
    // transforma em objeto { chave: valor }
    const resultado = {}
    configs.forEach(c => { resultado[c.chave] = c.valor })
    res.json(resultado)
  } catch (err) { next(err) }
}

// PUT /api/configuracoes — salva/atualiza uma config pelo body { chave, valor }
exports.salvar = async (req, res, next) => {
  try {
    const { chave, valor } = req.body
    if (!chave || valor === undefined) {
      return res.status(400).json({ mensagem: 'Informe chave e valor' })
    }

    // upsert — cria se não existir, atualiza se já existir
    const config = await Configuracao.findOneAndUpdate(
      { chave },
      { chave, valor, atualizadoEm: new Date() },
      { upsert: true, new: true }
    )
    res.json(config)
  } catch (err) { next(err) }
}