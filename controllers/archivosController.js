const shortid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const Enlaces = require('../models/Enlace')

exports.subirArchivos = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads')
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length
        )
        cb(null, `${shortid.generate()}${extension}`)
      }
    }))
  }
  const upload = multer(configuracionMulter).single('archivo')

  upload(req, res, async error => {
    console.log(req.file)
    if (!error) {
      res.json({ archivo: req.file.filename })
    } else {
      console.log(error)
      return next()
    }
  })
}

// descargar un archivo
exports.descargar = async (req, res, next) => {
  // obtiene el enlace
  const { archivo } = req.params
  const enlace = await Enlaces.findOne({ nombre: archivo })

  const archivoDescarga = __dirname + '/../uploads/' + archivo
  res.download(archivoDescarga)

  // eliminar el archivo y registro de la base de datos
  // si las descargas son iguales a 1 /// borrar archivo y de la base de datos
  const { descargas, nombre } = enlace

  if (descargas === 1) {
    // eliminar el archivo
    req.archivo = nombre
    // eliminar el registro de la base de datos
    await Enlaces.findOneAndRemove(enlace.id)

    next()
  } else {
    // si las descargas son mayores a 1 /// restar 1
    enlace.descargas--
    await enlace.save()
  }
}

exports.eliminarArchivo = async (req, res) => {
  console.log(req.archivo)
  fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
  console.log('archivo eliminado')
  try {
  } catch (error) {
    console.log(error)
  }
}
