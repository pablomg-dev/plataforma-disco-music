const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const url = "mongodb+srv://pablomarting19:WOJ8m8sAzJw9kTmx@curso-intro.ee1ghra.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3000;

// requerimos las rutas de la carpeta routes
const routes = require("./routes/index");

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// nos lleva a las rutas
app.use("/", routes);

const connectMongo = async () => {
  try {
    await mongoose.connect(url);
    app.listen(PORT, () => {
      console.log(
        "Server listening on port 3000 and database connected");
    });
  } catch (error) {
    console.log(error);
  }
};

connectMongo();