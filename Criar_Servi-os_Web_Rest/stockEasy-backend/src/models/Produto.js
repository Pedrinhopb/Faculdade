const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome:          { type: String, required: true },
  codigoBarras:  { type: String, required: true, unique: true },
  categoria:     { type: String, required: true },
  unidade:       { type: String, default: 'un' },
  fornecedor:    { type: String },
  custo:         { type: Number, required: true, min: 0 },
  margem:        { type: Number, required: true, min: 0, max: 99 },
  venda:         { type: Number },
  estoque:       { type: Number, default: 0, min: 0 },
  estoqueMinimo: { type: Number, default: 0, min: 0 },
  criadoEm:      { type: Date, default: Date.now }
});

// Calcula o preço de venda automaticamente antes de salvar
ProdutoSchema.pre('save', function (next) {
  if (this.custo && this.margem) {
    this.venda = parseFloat((this.custo / (1 - this.margem / 100)).toFixed(2));
  }
  next();
});

module.exports = mongoose.model('Produto', ProdutoSchema);