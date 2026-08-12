const express        = require('express')
const router         = express.Router()
const controller     = require('../controllers/clienteController')
const { apenasAdmin } = require('../middlewares/authMiddleware')

router.get('/',    controller.listar)
router.get('/:id', controller.buscarPorId)

router.post('/',      apenasAdmin, controller.criar)
router.put('/:id',    apenasAdmin, controller.atualizar)
router.delete('/:id', apenasAdmin, controller.remover)

module.exports = router