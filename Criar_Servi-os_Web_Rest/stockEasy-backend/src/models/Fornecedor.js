const mongoose = require('mongoose');

const FornecedorSchema = new mongoose.Schema({
  nome:          { type: String, required: true },
  cnpj:          { type: String, required: true, unique: true },
  telefone:      { type: String },
  email:         { type: String },
  endereco:      { type: String },
  cidade:        { type: String },
  estado:        { type: String },
  prazoEntrega:  { type: Number, default: 7 }, // em dias
  criadoEm:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fornecedor', FornecedorSchema);