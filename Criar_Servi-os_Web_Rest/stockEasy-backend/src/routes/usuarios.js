const express         = require('express')
const router          = express.Router()
const controller      = require('../controllers/usuarioController')
const { somenteAdmin } = require('../middlewares/authMiddleware')

// GET — todos podem ver a lista (para o login verificar)
router.get('/',    controller.listar)
router.get('/:id', controller.buscarPorId)

// POST, PUT, DELETE — só Administrador
router.post('/',      somenteAdmin, controller.criar)
router.put('/:id',    somenteAdmin, controller.atualizar)
router.delete('/:id', somenteAdmin, controller.remover)

module.exports = router