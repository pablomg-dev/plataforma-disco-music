// Importar las funciones onLoad y logOut.
import { onLoad } from "../utils/utils.js";
import { logOut } from "../utils/utils.js";

// Guardar en constantes el Add Album Button y Cancel Button.
const addButton = document.querySelector('#addButton')
const buttonCancel = document.querySelector('#buttonCancel');

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
  // Capturar los input y guardarlos.
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const yearOfReleaseInput = document.getElementById("yearOfRelease");
  const coverInput = document.getElementById("cover");
  // Obtener los valores de los campos de entrada.
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const yearOfReleaseValue = yearOfReleaseInput.value;
  const coverValue = coverInput.value;
  // Devolver los valores en un objeto.
  return {
    title: titleValue,
    description: descriptionValue,
    yearOfRelease: yearOfReleaseValue,
    cover: coverValue,
  };
};

const addAlbum = async (e) => {
  e.preventDefault();
  const objectToSend = getInputValues();
  try {
    const response = await axios.post("../album/add", objectToSend);
    await swal({
        title: "Album added successfully!",
        icon: "success",
      });

    window.location.href = "../html/home.html";

  } catch (error) {
    swal({
      title: "Could not add album, try again.",
      icon: "warning",
      text: "All fields must be completed correctly.",
    });
  }
};

// Agregar un addEventListener al Button Add Album para ejecutar la función addAlbum.
addButton.addEventListener("click", (e) => {
  addAlbum(e);
});

// Agregar un addEventListener al Button Cancel para reedirigirnos al home.
buttonCancel.addEventListener("click", () => {
    window.location.href = "../html/home.html";
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