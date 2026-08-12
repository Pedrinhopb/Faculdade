const express        = require('express')
const router         = express.Router()
const controller     = require('../controllers/configuracaoController')
const { apenasAdmin } = require('../middlewares/authMiddleware')

router.get('/', controller.listar)

// só admin salva configurações
router.put('/', apenasAdmin, controller.salvar)

module.exports = router