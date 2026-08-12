const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/authController')
const auth       = require('../middlewares/authMiddleware')

// POST /api/auth/login — público
router.post('/login', controller.login)

// GET /api/auth/me — protegido
router.get('/me', auth, controller.me)

module.exports = router