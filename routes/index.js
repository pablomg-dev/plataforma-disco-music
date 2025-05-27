const express = require("express");
const router = express.Router();

// Requerimos los models.
const User = require("../models/User");
const Album = require("../models/Album");

// Requerimos bcrypt y jsonwebtoken.
const bcrypt = require("bcrypt"); // <-- Descomentado
const jwt = require("jsonwebtoken");

// Guardamos la secret en una variable de entorno para ocultarla.
const secret = process.env.SECRET;

// Cantidad de veces que queremos que aplique el hash.
const saltRounds = 10; // Un buen valor, puedes ajustarlo si es necesario.

// Hasheo de password.
const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

// --- RUTAS ---

// Ruta para el Login del usuario.
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password; // Contraseña en texto plano del formulario

        // 1. Buscar el usuario por email
        const user = await User.findOne({ email: email });

        // Si el usuario no existe
        if (!user) {
            console.log('Intento de login fallido: Usuario no encontrado para email', email);
            return res.status(401).send({ message: "Email o contraseña incorrectos." });
        }

        // 2. Comparar la contraseña ingresada (texto plano) con la hasheada en la DB
        const match = await bcrypt.compare(password, user.password); // <-- bcrypt.compare

        if (match) { // Si las contraseñas coinciden (después del hash)
            const payload = { email: user.email, name: user.name, lastName: user.lastName, id: user._id };
            const token = jwt.sign(payload, secret, { expiresIn: "1h" });

            // Configuración de la cookie más segura
            res.cookie("token", token, {
                httpOnly: true, // Evita que JavaScript acceda a la cookie
                secure: process.env.NODE_ENV === 'production', // Solo envía la cookie sobre HTTPS en producción
                sameSite: 'Lax', // Protección contra CSRF (puedes necesitar 'None' si frontend y backend están en dominios diferentes y secure: true)
                maxAge: 3600000 // 1 hora en milisegundos (coincide con expiresIn del token)
            });
            
            console.log('Login exitoso para:', email);
            res.status(200).send(payload); // Envía los datos del usuario logueado
        } else {
            // Si la contraseña no coincide
            console.log('Intento de login fallido: Contraseña incorrecta para email', email);
            res.status(401).send({ message: "Email o contraseña incorrectos." });
        }
    } catch (error) {
        console.error('Error en la ruta /login:', error); // Mensaje de error detallado en la consola del servidor
        res.status(500).send({ message: "Error interno del servidor al intentar iniciar sesión." }); // Mensaje genérico para el cliente
    }
});

// Ruta para el logout.
router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.sendStatus(204); // 204 No Content - Indica éxito sin contenido a devolver
    } catch (error) {
        console.error('Error en la ruta /logout:', error);
        res.status(500).send({ message: "Error interno del servidor al cerrar sesión." });
    }
});

// Ruta para restringir el acceso a quienes no se loguean.
router.get("/me", (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("No hay token de autenticación.");
        }
        const payload = jwt.verify(token, secret);
        res.status(200).send(payload);
    } catch (error) {
        console.error('Error en la ruta /me (autenticación JWT):', error);
        // Si el token no es válido o expiró
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).send("Token inválido o expirado.");
        }
        res.status(500).send("Error interno del servidor al verificar la sesión.");
    }
});

// Ruta para crear un usuario.
router.post("/createuser", async (req, res) => {
    const { name, lastName, email, password } = req.body;
    
    try {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await hashPassword(password); // <-- Aquí se hashea

        const newUser = {
            name,
            lastName,
            email,
            password: hashedPassword, // <-- Guardamos la contraseña hasheada
        };
        
        await User.create(newUser);
        res.status(201).send("Usuario creado exitosamente.");
    } catch (error) {
        console.error('Error al crear usuario:', error);
        // Manejo específico para el error de email duplicado (código 11000 de MongoDB)
        if (error.code === 11000) {
            return res.status(409).send({ message: "El email ya está registrado. Por favor, usa otro." });
        }
        res.status(500).send({ message: "Error interno del servidor al crear usuario.", error: error.message });
    }
});

// Ruta para recibir un id por params y retorne la data del usuario nuevamente, excluyendo la contraseña.
router.get("/user/:id", async (req, res) => {
    try {
        let response = await User.findById(req.params.id);
        if (!response) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        // Excluir la contraseña explícitamente en la respuesta
        const { password, ...userData } = response.toObject(); // toObject() para manipular el objeto Mongoose
        res.status(200).send({ User: userData });
    } catch (error) {
        console.error('Error al solicitar usuario por ID:', error);
        res.status(500).send({ message: "Error interno del servidor al solicitar usuario.", error: error.message });
    }
});

// Ruta para editar los datos de un usuario.
router.put("/user/edit/:id", async (req, res) => {
    try {
        const { password, ...updateData } = req.body; // Evitar que la contraseña se actualice directamente si no está hasheada
        
        // Si se intenta actualizar la contraseña, hashearla primero
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const usuario = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true, // Devuelve el documento actualizado
        });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado para editar." });
        }
        res.status(200).send(usuario);
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).send({ message: "Error interno del servidor al editar el usuario.", error: error.message });
    }
});

// Ruta que devuelve todos los albums.
router.get("/album/all", async (req, res) => {
    try {
        let albums = await Album.find();
        res.status(200).send(albums);
    } catch (error) {
        console.error('Error al solicitar todos los álbumes:', error);
        res.status(500).send({ message: "Error interno del servidor al solicitar álbumes.", error: error.message });
    }
});

// Ruta que devuelve la información de un album especifíco.
router.get("/album/:id", async (req, res) => {
    try {
        let album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send({ message: "Álbum no encontrado." });
        }
        res.status(200).send(album);
    } catch (error) {
        console.error('Error al solicitar álbum específico:', error);
        res.status(500).send({ message: "Error interno del servidor al solicitar álbum.", error: error.message });
    }
});

// Ruta para agregar un album.
router.post("/album/add", async (req, res) => {
    try {
        let album = await Album.create(req.body);
        res.status(201).send(album); // 201 Created
    } catch (error) {
        console.error('Error al agregar un álbum:', error);
        res.status(500).send({ message: "Error interno del servidor al agregar álbum.", error: error.message });
    }
});

// Ruta para editar un album.
router.put("/album/:idAlbum", async (req, res) => {
    try {
        let album = await Album.findByIdAndUpdate(req.params.idAlbum, req.body, {
            new: true,
        });
        if (!album) {
            return res.status(404).send({ message: "Álbum no encontrado para editar." });
        }
        res.status(200).send(album);
    } catch (error) {
        console.error('Error al editar un álbum:', error);
        res.status(500).send({ message: "Error interno del servidor al editar álbum.", error: error.message });
    }
});

// Ruta para eliminar un album.
router.delete("/album/:idAlbum", async (req, res) => {
    try {
        const result = await Album.findByIdAndDelete(req.params.idAlbum);
        if (!result) {
            return res.status(404).send({ message: "Álbum no encontrado para eliminar." });
        }
        res.status(200).send({ message: "Álbum eliminado exitosamente." });
    } catch (error) {
        console.error('Error al eliminar álbum:', error);
        res.status(500).send({ message: "Error interno del servidor al eliminar álbum.", error: error.message });
    }
});

// Ruta para agregar una canción al album.
router.put("/song/:idAlbum", async (req, res) => {
    try {
        let album = await Album.findById(req.params.idAlbum);
        if (!album) {
            return res.status(404).send({ message: "Álbum no encontrado para agregar canción." });
        }
        album.songs.push(req.body);
        await album.save(); // Usar .save() en lugar de findByIdAndUpdate para arrays anidados
        res.status(200).send(album);
    } catch (error) {
        console.error('Error al agregar una canción:', error);
        res.status(500).send({ message: "Error interno del servidor al agregar canción.", error: error.message });
    }
});

// Ruta para eliminar una canción del album.
router.put("/song/delete/:idAlbum", async (req, res) => {
    let idSong = req.query.idSong;
    try {
        let album = await Album.findById(req.params.idAlbum);
        if (!album) {
            return res.status(404).send({ message: "Álbum no encontrado para eliminar canción." });
        }
        // Filtra las canciones, manteniendo solo aquellas cuyo _id no coincide con idSong
        let albumUpdatedSongs = album.songs.filter(
            (cancion) => cancion._id.toString() !== idSong // Usar .toString() para comparar ObjectIds
        );
        
        // Verifica si la canción realmente fue eliminada
        if (albumUpdatedSongs.length === album.songs.length) {
            return res.status(404).send({ message: "Canción no encontrada en el álbum." });
        }

        album.songs = albumUpdatedSongs;
        await album.save(); // Guardar los cambios en el álbum

        res.status(200).send({ message: "Canción eliminada correctamente del álbum." });
    } catch (error) {
        console.error('Error al eliminar una canción:', error);
        res.status(500).send({ message: "Error interno del servidor al eliminar canción.", error: error.message });
    }
});

module.exports = router;