const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })
const { validationResult } = require('express-validator')

exports.autenticarUsuario = async (req, res, next) => {
  // mostrar mensajes de error
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  // revisar que usuario este registrado
  const { email, password } = req.body
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    res.status(401).json({ msg: 'El usuario no existe' })
    return next()
  }

  // verificar  el password y autenticar al usuario
  if (bcrypt.compareSync(password, usuario.password)) {
    // crear JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre
      },
      process.env.SECRETA,
      {
        expiresIn: '8h'
      }
    )
    res.json({ token })
  } else {
    res.status(401).json({ msg: 'El password es incorrecto' })
    return next()
  }
}

exports.usuarioAutenticado = async (req, res, next) => {
  res.json({ usuario: req.usuario })
}
