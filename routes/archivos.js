const express = require('express')
const {
  subirArchivos,
  descargar,
  eliminarArchivo
} = require('../controllers/archivosController')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/', auth, subirArchivos)

router.get('/:archivo', descargar, eliminarArchivo)

module.exports = router
