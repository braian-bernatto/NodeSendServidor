const express = require('express')
const {
  nuevoEnlace,
  obtenerEnlace,
  tienePassword,
  verificarPassword,
  todosEnlaces
} = require('../controllers/enlacesController')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post(
  '/',
  [
    check('nombre', 'Sube un archivo').not().isEmpty(),
    check('nombre_original', 'Sube un archivo').not().isEmpty()
  ],
  auth,
  nuevoEnlace
)

router.get('/', todosEnlaces)

router.get('/:url', tienePassword, obtenerEnlace)

router.post('/:url', verificarPassword, obtenerEnlace)

module.exports = router
