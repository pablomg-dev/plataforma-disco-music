const express = require("express");
const router = express.Router();
// Requerimos los models.
const User = require("../models/User");
const Album = require("../models/Album");
// Requerimos bcrypt y jsonwebtoken
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Se usa para generar mas seguridad en el hasheo de la password.
const saltRounds = 10;
// Se usa en la función de crear el token.
const secret = "audioslave";

// Hasheo de password.
const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

// RUTAS

// Rutap para el Login del usuario.
router.post("/login", async(req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email});
    const match = await bcrypt.compare(password, user.password);
    const payload = {email: user.email, name: user.name, lastName: user.lastName};
    if (match) {
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        res.cookie("token",token);
        res.status(200).send(payload);
    } else {
      res.status(401).send({message:"Wrong email or password"});
    }
  } catch (error) {
    res.status(401).send({message:error.message});
  }
})

// Ruta para el logout.
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Ruta para restringir el acceso a quienes no se loguean.
router.get("/me", (req, res) => {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, secret);
    res.status(200).send(payload);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Ruta para crear un usuario.
router.post("/createuser", async (req, res) => {
  const { name, lastName, email, password } = req.body;
  const hashed = await hashPassword(password);
  const user = {
    password: hashed,
    email,
    name,
    lastName,
  };
  try {
    await User.create(user);
    res.status(201).send("Successfully created user");
  } catch (error) {
    res.status(500).send({ "Error creating user": error });
  }
});

// Ruta para recibir un id por params y retorne la data del usuario nuevamente, excluyendo la contraseña.
router.get("/user/:id", async (req, res) => {
  try {
    let response = await User.findById(req.params.id);
    res.status(200).send({
      User: {
        name: response.name,
        lastName: response.lastName,
        email: response.email,
      },
    });
  } catch (error) {
    res.status(500).send({ "Error when requesting user": error });
  }
});

// Ruta para editar los datos de un usuario.
router.put("/user/edit/:id", async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send({ "error al editar el usuario": error });
  }
});

// Ruta que devuelve todos los albums.
router.get("/album/all", async (req, res) => {
  try {
    let albums = await Album.find();
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send({ "error request all albums": error });
  }
});

// Ruta que devuelve la información de un album especifíco.
router.get("/album/:id", async (req, res) => {
  try {
    let album = await Album.findById(req.params.id);
    res.status(200).send(album);
  } catch (error) {
    res.status(500).send({ "error when requesting specific album": error });
  }
});

// Ruta para agregar un album.
router.post("/album/add", async (req, res) => {
  try {
    let album = await Album.create(req.body);
    res.status(200).send(album);
  } catch (error) {
    res.status(500).send({ "error when adding an album": error });
  }
});

// Ruta para editar un album.
router.put("/album/:id", async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(album);
  } catch (error) {
    res.status(500).send({ "error when editing an album": error });
  }
});

// Ruta para eliminar un album.
router.delete("/album/:idAlbum", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.idAlbum);
    res.status(200).send("Album deleted successfully");
  } catch (error) {
    res.status(500).send({ "Error deleting album": error });
  }
});

// Ruta para agregar una canción al album.
router.put("/song/:idAlbum", async (req, res) => {
  try {
    let album = await Album.findById(req.params.idAlbum);
    album.songs.push(req.body);
    await Album.findByIdAndUpdate(req.params.idAlbum, album, {
      new: true,
    });
    res.status(200).send(album);
  } catch (error) {
    res.status(500).send({ "Error when adding a song": error });
  }
});

// Ruta para eliminar una canción del album.
router.put("/song/delete/:idAlbum", async (req, res) => {
  let idSong = req.query.idSong;
  try {
    let album = await Album.findById(req.params.idAlbum);
    let albumUpdated = album.songs.filter(
      (cancion) => cancion._id != idSong
    );
    album.songs = albumUpdated;
    await Album.findByIdAndUpdate(req.params.idAlbum, album, {
      new: true,
    });
    res.status(200).send({ message: "Song deleted correctly" });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;