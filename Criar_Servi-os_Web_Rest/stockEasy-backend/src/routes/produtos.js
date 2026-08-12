const express        = require('express')
const router         = express.Router()
const controller     = require('../controllers/produtoController')
const { apenasAdmin } = require('../middlewares/authMiddleware')

// GET — todos podem ver
router.get('/',    controller.listar)
router.get('/:id', controller.buscarPorId)

// POST, PUT, DELETE — Visualizador bloqueado
router.post('/',      apenasAdmin, controller.criar)
router.put('/:id',    apenasAdmin, controller.atualizar)
router.delete('/:id', apenasAdmin, controller.remover)

module.exports = router