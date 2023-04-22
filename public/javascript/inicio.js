// inicio.js
exports.login = async (req, res, next) => {
  const { gamertag, password } = req.body
  // Comprobar si se proporciona el nombre de usuario y la contraseña
  if (!gamertag || !password) {
    return res.status(400).json({
      message: "Nombre de usuario o contraseña no ingresados",
    })
  }
  try {
    const gamertag = await gamertag.findOne({ gamertag, password })
    if (!gamertag) {
      res.status(401).json({
        message: "No se pudo iniciar sesión",
        error: "Usuario no encontrado",
      })
    } else {
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        gamertag,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Ocurrió un error",
      error: error.message,
    })
  }
}