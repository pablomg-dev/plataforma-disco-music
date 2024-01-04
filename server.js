const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

// Usamos variables de entorno para ocultar información sensible
const dotenv = require("dotenv");
dotenv.config();

// Guardamos en constantes las variables de entorno para poder utilizarlas
const PORT = process.env.PORT;
const dbUser = process.env.USER_MONGO;
const password = process.env.PASSWORD_MONGO;

const url = `mongodb+srv://${dbUser}:${password}@curso-intro.ee1ghra.mongodb.net/?retryWrites=true&w=majority`;

// Requerimos las rutas de la carpeta routes
const routes = require("./routes/index");

app.use(express.json());
app.use(cookieParser());

app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  }),
);

// Nos pide Render para chequear la app
app.use("/health", (req, res) => res.sendStatus(200));

// Nos lleva a las rutas
app.use("/", routes);

// Conectamos con la Base de Datos
const connectMongo = async () => {
  try {
    await mongoose.connect(url);
    app.listen(PORT, () => {
      console.log(
        `Server listening on port ${PORT} and database connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

connectMongo();
