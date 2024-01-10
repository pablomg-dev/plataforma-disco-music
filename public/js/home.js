// Importamos las funciones onLoad y logOut
import { onLoad } from "../utils/utils.js";
import { logOut } from "../utils/utils.js";


// Función que toma el id del album a renderizar y se lo agregaremos como query param a la url.
const redirect = (id) => { window.location.href = `./album.html?album=${id}` };

// Función que trae la información del backend para cada album, la renderiza y puede borrarla.
const getAlbums = async () => {
    try {
        const response = await axios.get("../album/all");
        response.data.map((album) => {
            renderAlbums(album);
        });
        

        const trash = document.querySelectorAll('i');

        for (let i = 0; i < trash.length; i++) {
            trash[i].addEventListener("click", () => {
                deleteAlbum(response.data[i]._id);
            });
        };

    } catch (error) {
        console.log(error);
    }

};

getAlbums();


// Función que renderiza cada album para mostarlos en la Home.
const renderAlbums = (album) => {
    // Tomamos el Div padre.
    const div = document.querySelector('#albumsDiv');
    // Creamos los elementos.
    const newDiv = document.createElement('div');
    const imgAlbum = document.createElement('img');
    const span = document.createElement('span');
    const iconTrash = document.createElement("i");
    // Le damos los estilos.
    div.classList.add('mx-52')
    newDiv.classList.add('.singleDiv');
    span.textContent = album.yearOfRelease;
    imgAlbum.classList.add('w-48', 'h-48', 'cursor-pointer');
    imgAlbum.src = album.cover ? album.cover : 'https://imgur.com/0uSALUr.png';
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer');
    // Agregamos los elementos al HTML.
    div.appendChild(newDiv);
    newDiv.appendChild(span);
    newDiv.appendChild(imgAlbum);
    newDiv.appendChild(iconTrash);

    // Agregamos un addEventListener para redirigir a un album especifico.
    imgAlbum.addEventListener("click", () => {
        redirect(album._id);
    });
};

// Función que borra un album especifico.
const deleteAlbum = async (album) => {
    try {
        await axios.delete(`../album/${album}`);
        await swal({
            title: "Album deleted successfully!",
            icon: "success",
        });

        location.reload();

    } catch (error) {
        console.log(error.message);
    }
};

// Log Out.
// Capturar el Button Log Out.
const buttonLogout = document.querySelector("#logout");
buttonLogout.classList.add('cursor-pointer');
// Le agregamos un addEventListener y le aplicamos la función logOut.
buttonLogout.addEventListener("click", () => {
  logOut();
  window.location.href = "../index.html";
});

// Función onLoad que se ejecuta apenas carga la página.
// const username = document.querySelector("#username");
// const tourDates = document.querySelector("#tour-dates");
// tourDates.classList.add('cursor-pointer');

// let user = "";

// tourDates.addEventListener("click", () => {
//   window.location.href = `./tours.html?user=${user}`;
// });

// onLoad();