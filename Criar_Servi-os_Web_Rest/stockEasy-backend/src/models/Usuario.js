const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  senha:     { type: String, required: true },
  cargo:     { type: String, default: 'Operador' },
  permissao: { type: String, enum: ['Administrador', 'Operador', 'Visualizador'], default: 'Operador' },
  status:    { type: String, enum: ['Ativo', 'Inativo'], default: 'Ativo' },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);