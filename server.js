const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

// Usamos variables de entorno para ocultar información sensible
const dotenv = require("dotenv");
dotenv.config();

// Guardamos en constantes las variables de entorno para poder utilizarlas
const PORT = process.env.PORT || 3000;
const dbUser = process.env.USER_MONGO;
const password = process.env.PASSWORD_MONGO;

// Guardamos en una constante los datos que necesitamos para conectarnos luego a la base de datos de Mongo DB Atlas.
const url = `mongodb+srv://${dbUser}:${password}@curso-intro.ee1ghra.mongodb.net/?retryWrites=true&w=majority&appName=Curso-Intro`;

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

// Petición de Render para chequear la App.
app.use("/health", (req, res) => res.sendStatus(200));

// Nos lleva a las rutas
app.use("/", routes);

// Middlewares globales de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Conectamos con la Base de Datos.
const connectMongo = async () => {
  try {
    if (!dbUser || !password) {
      throw new Error(
        "Faltan variables de entorno USER_MONGO y/o PASSWORD_MONGO para conectar MongoDB.",
      );
    }

    if (!process.env.SECRET) {
      throw new Error("Falta la variable de entorno SECRET para JWT.");
    }

    await mongoose.connect(url);
    app.listen(PORT, () => {
      console.log(
        `Server listening on port ${PORT} and database connected`);
    });
  } catch (error) {
    console.log(error);
  }
};
// Invocamos a la función para conectarnos a la Base de Datos.
connectMongo();
