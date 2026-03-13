const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send({ message: "No autenticado." });
    }

    const secret = process.env.SECRET;
    if (!secret) {
      return res.status(500).send({ message: "Configuración del servidor inválida." });
    }

    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Token inválido o expirado." });
    }

    return res.status(500).send({ message: "Error interno al autenticar usuario." });
  }
};

module.exports = authMiddleware;