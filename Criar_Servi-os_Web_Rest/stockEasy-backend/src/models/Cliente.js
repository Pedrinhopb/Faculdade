const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome:         { type: String, required: true },
  tipo:         { type: String, enum: ['Pessoa Física', 'Pessoa Jurídica'], default: 'Pessoa Física' },
  documento:    { type: String, required: true, unique: true }, // CPF ou CNPJ
  telefone:     { type: String },
  email:        { type: String },
  endereco:     { type: String },
  cidade:       { type: String },
  estado:       { type: String },
  totalCompras: { type: Number, default: 0 },
  criadoEm:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);