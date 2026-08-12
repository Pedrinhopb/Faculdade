const mongoose = require('mongoose')

const CustoFixoSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  categoria: { type: String, required: true },
  valor:     { type: Number, required: true, min: 0 },
  criadoEm: { type: Date, default: Date.now }
})

module.exports = mongoose.model('CustoFixo', CustoFixoSchema)