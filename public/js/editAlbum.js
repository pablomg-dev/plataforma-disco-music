// Importar las funciones onLoad y logOut, desde la carpeta utils.
import {onLoad, logOut} from "../utils/utils.js";

// Guardar en constantes los botones Add Song, Edit y Cancel.
const buttonAddSong = document.querySelector("#addSong");
const buttonEdit = document.querySelector("#buttonEdit");
const buttonCancel = document.querySelector('#buttonCancel');

// Obtener el id del album y guardarlo.
const idAlbum = window.location.search.split("album=")[1];

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
  // Capturar los input y guardarlos.
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const coverInput = document.getElementById("cover");
  // Obtener los valores de los campos de entrada.
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const coverValue = coverInput.value;
  // Devolver los valores en un objeto.
  return {
    title: titleValue,
    description: descriptionValue,
    cover: coverValue,
  };
};

// Función que envia la info de los inputs del usuario y las envia a la base de datos para actualizarla.
const changeAlbum = async (e) => {
  e.preventDefault();
  const objectToSend = getInputValues();
  try {
    const response = await axios.put(`../album/${idAlbum}`, objectToSend);
    await swal({
      title: "Album edited correctly!",
      icon: "success",
    });

    window.location.href = "../html/home.html";

  } catch (error) {
    swal({
      title: "Could not edit album, try again!",
      icon: "warning",
      text: "All fields must be completed correctly.",
    });
  }
};

// Agregar un addEventListener al Button Edit para ejecutar la función changeAlbum.
buttonEdit.addEventListener("click", (e) => {
  changeAlbum(e);
});

// Agregar un addEventListener al Button Add Song, asi nos redirige al id del album actual.
buttonAddSong.classList.add('cursor-pointer');
buttonAddSong.addEventListener("click", () => {
  window.location.href = `../html/addSong.html?album=${idAlbum}`;
});

// Agregar un addEventListener al Button Cancel para reedirigirnos a la vista individual del album.
  buttonCancel.addEventListener("click", () => {
    window.location.href = `../html/album.html?album=${idAlbum}`;
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