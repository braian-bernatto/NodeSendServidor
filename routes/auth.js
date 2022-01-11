const express = require('express')
const {
  autenticarUsuario,
  usuarioAutenticado
} = require('../controllers/authController')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post(
  '/',
  [
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty()
  ],
  autenticarUsuario
)

router.get('/', auth, usuarioAutenticado)

module.exports = router
