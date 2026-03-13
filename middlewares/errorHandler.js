const notFoundHandler = (req, res) => {
  res.status(404).send({ message: "Ruta no encontrada." });
};

const errorHandler = (error, req, res, next) => {
  console.error("[ERROR]", error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
    return res.status(401).send({ message: "Token inválido o expirado." });
  }

  if (error.name === "CastError") {
    return res.status(400).send({ message: "ID inválido." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({ message: "Datos inválidos." });
  }

  if (error.code === 11000) {
    return res.status(409).send({ message: "Ya existe un registro con esos datos únicos." });
  }

  const status = error.status || 500;
  const message = error.message || "Error interno del servidor.";

  return res.status(status).send({ message });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};