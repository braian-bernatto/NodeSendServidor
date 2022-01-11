const express = require('express')
const { nuevoUsuario } = require('../controllers/usuarioController')
const router = express.Router()
const { check } = require('express-validator')

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password debe ser de al menos 5 caracteres').isLength(
      { min: 5 }
    )
  ],
  nuevoUsuario
)

module.exports = router
