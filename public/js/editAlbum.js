// Importamos las funciones onLoad y logOut
import { onLoad } from "../utils/utils.js";
import { logOut } from "../utils/utils.js";

// Obtenemos los botones Edit y Cancel.
const buttonEdit = document.querySelector("#buttonEdit");
const buttonCancel = document.querySelector('#buttonCancel');

// Obtenemos el id del album y lo guardamos.
const query = window.location.search.split("=");
const idAlbum = query[1];

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
  // Obtener los input del form.
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const coverInput = document.getElementById("cover");

  // Obtener los valores de los campos de entrada.
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const imageValue = coverInput.value;

  // Devolver los valores en un objeto.
  return {
    title: titleValue,
    description: descriptionValue,
    cover: imageValue,
  };
}

// Agregamos un addEventListener al button Edit para ejecutar la función changeAlbum.
buttonEdit.addEventListener("click", (e) => {
    changeAlbum(e);
  });

const changeAlbum = async (e) => {
  e.preventDefault();
  const objectToSend = getInputValues();
  try {
    const response = await axios.put(`../../album/${idAlbum}`, objectToSend);
    await swal({
      title: "Album edited!",
      text: 'You modified the album!',
      icon: "success",
      button: "Ok",
    });
    window.location.href = `../html/home.html`;
  } catch (error) {
    console.log(error);
  }
};

// Obtenemos el button logout.
const buttonLogout = document.querySelector("#logout");
buttonLogout.classList.add('cursor-pointer');
// Le agregamos un addEventListener y le aplicamos la función logOut.
buttonLogout.addEventListener("click", () => {
  logOut();
  window.location.href = "../index.html";
});

//   const redirect = (id) => { window.location.href = `./album.html?album=${id}` };

//   buttonCancel.addEventListener("click",
//     window.location.href = `../album.html?album=${idAlbum}`
//   );