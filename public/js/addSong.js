// Importar las funciones onLoad y logOut.
import {onLoad, logOut} from "../utils/utils.js";

// Guardar en constantes el Add Album Button y Cancel Button.
const addButton = document.querySelector('#addButton')
const buttonCancel = document.querySelector('#buttonCancel');
const editAlbum = document.querySelector('#editAlbum')

// Obtener el id del album y guardarlo.
const idAlbum = window.location.search.split("album=")[1];

// Funcion que nos lleva a un album en específico, pasandole dos parametros.
const redirect = (url, id) => {
    window.location.href = `${url}?album=${id}`;
  };

// Declarar una variable sin asignarle un valor.
let album;

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
    // Capturar los input y guardarlos.
    const titleInput = document.getElementById('title');
    const durationInput = document.getElementById('duration');
    const linkInput = document.getElementById('link');
    // Obtener los valores de los campos de entrada.
    const titleValue = titleInput.value;
    const durationValue = durationInput.value;
    const linkValue = linkInput.value;
    // Devolver los valores en un objeto.
    return {
        title: titleValue,
        duration: durationValue,
        link: linkValue,
    };
};

// Función que agrega una canción, tomando los valores de la función getInputValues.
const addSong = async (e) => {
    e.preventDefault();
    const objectToSend = getInputValues();
    try {
        await axios.put(`../../song/${idAlbum}`, objectToSend);
        await swal({
            title: "Song added successfully!",
            icon: "success",
        });
        redirect("../html/album.html", album._id);
    } catch (error) {
        swal("Error when adding song!");
    }
};

// Función que trae la información del backend para el albun especifico.
const getAlbum = async () => {
    try {
        const { data } = await axios.get(`../album/${idAlbum}`);
        console.log(data);
        album = data;
    }
    catch (error) {
        console.log(error);
    };
};
getAlbum();

// Agregar un addEventListener al Button Add Album para redirigir al usuario a la vista del album para editar.
editAlbum.classList.add('cursor-pointer');
editAlbum.addEventListener("click", (e) => {
    redirect("../html/editAlbum.html", album._id);
});

// Agregar un addEventListener al Button Add Song para ejecutar la función addSong.
addButton.addEventListener("click", (e) => {
    addSong(e);
});

// Agregar un addEventListener al Button Cancel para reedirigirnos a la vista individual del album.
buttonCancel.addEventListener("click", () => {
    redirect("../html/album.html", album._id);
});

// Log Out.
// Capturar el Button Log Out.
const buttonLogout = document.querySelector("#logout");
buttonLogout.classList.add('cursor-pointer');
// Le agregamos un addEventListener y le aplicamos la función logOut.
buttonLogout.addEventListener("click", () => {
    logOut();
    window.location.href = "../index.html";
});

// Función que sirve para que solo accendan los usuarios logueados.
onLoad();