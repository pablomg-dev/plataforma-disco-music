// Importar las funciones onLoad y logOut
import {onLoad, logOut} from "../utils/utils.js";

// Guardar en constantes los botones de la Sidebar.
const editAlbum = document.querySelector("#editAlbum");
const addSong = document.querySelector("#addSong");

// Agregar estilo a botones de la sidebar (puntero mano).
editAlbum.classList.add('cursor-pointer');
addSong.classList.add('cursor-pointer');

// Obtener el id del album y guardarlo.
const idAlbum = window.location.search.split("album=")[1];

// Funcion que nos lleva a un album en específico.
const redirect = (url, id) => {
  window.location.href = `${url}?album=${id}`;
};

// Inicializo la lista de canciones en 1.
let numSong = 1;

// Función que trae la información del backend para el albun especifico y la renderiza.
const getAlbum = async () => {
    try {
        const response = await axios.get(`../album/${idAlbum}`);
        renderAlbum(response.data);
        const songs = response.data.songs;
        songs.map((song, index) => {
            renderSongs(song, index);
        });

        const trash = document.querySelectorAll("#delete");

        for (let i = 0; i < trash.length; i++) {
            trash[i].addEventListener("click", () => {
                deleteSong(idAlbum, songs[i]._id);
            });
        }
    } catch (error) {
        console.log(error);
    }
};
getAlbum();


// Función que renderiza el album en especifico.
function renderAlbum(album) {
    // Tomamos el Div padre.
    const div = document.querySelector('#albumDiv');
    // Creamos los elementos.
    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    const h2 = document.createElement('h2');
    // Le damos los estilos.
    h1.classList.add('text-3xl', 'font-semibold', 'text-black', 'mx-36', 'mt-10', 'mb-5', 'tracking-wider');
    p.classList.add('text-black', 'mx-36', 'mb-5', 'text-justify', 'text-base');
    h2.classList.add('text-2xl', 'font-semibold', 'text-black', 'text-center', 'my-5', 'tracking-wider');
    // Agregamos la info de las canciones.
    h1.textContent = album.title;
    p.textContent = album.description;
    h2.textContent = 'Songs';
    // Agregamos los elementos al HTML.
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(h2);
    // agregamos los addEventListener a los botones de la sidebar
    editAlbum.addEventListener("click", () => {
        redirect("../html/editAlbum.html", album._id);
    });
    addSong.addEventListener("click", () => {
        redirect("../html/addSong.html", album._id);
    });
};

// Función que renderiza la lista de canciones.
function renderSongs(album) {
    // Tomamos el Div padre.
    const div = document.querySelector('#albumDiv');
    // Creamos los elementos.
    const songsDiv = document.createElement('div');
    const ul = document.createElement('ul')
    const li = document.createElement('li');
    const spanSongNumber = document.createElement('span');
    const spanSongTitle = document.createElement('span');
    const spanSongDuration = document.createElement('span');
    const spanSongIcons = document.createElement('span');
    const iconTrash = document.createElement('i');
    const iconMusic = document.createElement('i');
    // Le damos los estilos.
    songsDiv.classList.add('mx-52');
    ul.classList.add('list-none', 'p-0');
    li.classList.add('flex', 'items-center', 'mb-2.5', 'bg-red-600', 'bg-opacity-75', 'p-2.5', 'rounded');
    spanSongNumber.classList.add('mr-2.5', 'font-bold');
    spanSongTitle.classList.add('grow');
    spanSongDuration.classList.add('mr-2.5');
    spanSongIcons.classList.add('cursor-pointer');
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer', 'mx-2.5');
    iconMusic.classList.add('fa-brands', 'fa-youtube', 'mx-2.5');
    iconTrash.setAttribute('id', 'delete');
    // Agregamos la info de las canciones.
    spanSongNumber.textContent = `${numSong}-`;
    spanSongTitle.textContent = album.title;
    spanSongDuration.textContent = album.duration;
    numSong++;
    // Agregamos los elementos al HTML.
    div.appendChild(songsDiv);
    songsDiv.appendChild(ul);
    ul.appendChild(li);
    li.appendChild(spanSongNumber);
    li.appendChild(spanSongTitle);
    li.appendChild(spanSongDuration);
    li.appendChild(spanSongIcons);
    spanSongIcons.appendChild(iconTrash);
    spanSongIcons.appendChild(iconMusic);
    // Agregamos un addEventListener para abrir en una nueva venta un video de youtube.
    iconMusic.addEventListener("click", () => {
        window.open(album.link, "_blank");
    });
};

// Función para eliminar una canción y le agregamos el addEventListener al trash icon.
const deleteSong = async (album, song) => {
    try {
      await axios.put(`../song/delete/${album}?idSong=${song}`);
      await swal({
        title: "Song deleted correctly!",
        icon: "success",
      });

      location.reload();

      ul.innerHTML = ""; // limpia la lista actual

      const response = await axios.get(`../album/${idAlbum}`);
      const songs = response.data.songs;
      songs.map((song, index) => {
        renderSongs(song, index);
      });

      const trash = document.querySelectorAll("#delete");
      for (let i = 0; i < trash.length; i++) {
        trash[i].addEventListener("click", () => {
          deleteSong(idAlbum, songs[i]._id);
        });
      }

    } catch (error) {
      console.log(error);
    }
  };

// Log Out.
// Obtenemos el button logout.
const buttonLogout = document.querySelector("#logout");
buttonLogout.classList.add('cursor-pointer');
// Le agregamos un addEventListener y le aplicamos la función logOut.
buttonLogout.addEventListener("click", () => {
  logOut();
  window.location.href = "../index.html";
});

// Función que sirve para que solo accendan los usuarios logueados.
onLoad();