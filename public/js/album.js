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

// Capturar el mensaje de carga
const loadingMessage = document.getElementById('loadingMessage');

// Funcion que nos lleva a un album en específico.
const redirect = (url, id) => {
    window.location.href = `${url}?album=${id}`;
};

// Inicializo la lista de canciones en 1.
let numSong = 1;

// Función que trae la información del backend para el album especifico y la renderiza.
const getAlbum = async () => {
    try {
        // Limpiar el contenido existente en albumDiv y mostrar mensaje de carga
        const albumDiv = document.querySelector('#albumDiv');
        albumDiv.innerHTML = ''; // Limpia todo el contenido, incluyendo el mensaje de carga
        
        // Puedes volver a mostrar el mensaje de carga si lo deseas, o simplemente omitirlo si la carga es rápida.
        // Para este caso, lo eliminamos y esperamos que el renderizado sea rápido.

        const response = await axios.get(`../album/${idAlbum}`);
        
        if (response.data) {
            renderAlbum(response.data); // Renderiza la información del álbum principal

            const songs = response.data.songs;
            if (songs && songs.length > 0) {
                numSong = 1; // Reiniciar el contador de canciones cada vez que se renderizan
                songs.map((song) => {
                    renderSongs(song);
                });
            } else {
                // Si no hay canciones, mostrar un mensaje
                const noSongsMessage = document.createElement('p');
                noSongsMessage.classList.add('text-white', 'text-center', 'text-lg', 'mt-10');
                noSongsMessage.textContent = 'No hay canciones añadidas a este álbum.';
                albumDiv.appendChild(noSongsMessage);
            }
        } else {
            console.error("No se encontró el álbum o la respuesta es vacía.");
            albumDiv.innerHTML = '<p class="text-white text-center text-xl mt-20">No se pudo cargar el álbum. Inténtalo de nuevo más tarde.</p>';
        }

    } catch (error) {
        console.error("Error al obtener o renderizar el álbum:", error);
        const albumDiv = document.querySelector('#albumDiv');
        albumDiv.innerHTML = '<p class="text-white text-center text-xl mt-20">Error al cargar el álbum. Es posible que el ID sea inválido o haya un problema de conexión.</p>';
    } finally {
        // Asegurarse de que el mensaje de carga esté oculto al finalizar la operación (éxito o error)
        if (loadingMessage) {
            loadingMessage.classList.add('hidden');
        }
    }
};
getAlbum(); // Llamar a la función para cargar el álbum al inicio

// Función que renderiza el album en especifico.
function renderAlbum(album) {
    const div = document.querySelector('#albumDiv'); // Este es el contenedor principal (albumDiv)

    // Creamos un contenedor interno para el contenido del álbum para mejor control de layout
    const albumContentContainer = document.createElement('div');
    albumContentContainer.classList.add(
        'bg-black', 'bg-opacity-50', 'p-4', 'sm:p-6', 'md:p-8', 'lg:p-10', // Padding responsivo
        'rounded-lg', 'shadow-xl', 'max-w-4xl', 'mx-auto', 'my-8', // Estilo de tarjeta, ancho máximo y centrado
        'text-white' // Color de texto para los elementos dentro de este contenedor
    );

    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    const h2Songs = document.createElement('h2'); // Cambiado el nombre para evitar conflictos con otras variables

    // Clases responsivas para el título (h1)
    h1.classList.add('text-3xl', 'sm:text-4xl', 'md:text-5xl', 'font-bold', 'text-center', 'mb-4', 'text-orange-600', 'drop-shadow-lg');
    h1.textContent = album.title;

    // Clases responsivas para la descripción (p)
    p.classList.add('text-base', 'sm:text-lg', 'text-justify', 'leading-relaxed', 'mb-6', 'px-2', 'sm:px-4'); // Padding horizontal para el párrafo
    p.textContent = album.description;

    // Clases responsivas para el subtítulo "Songs" (h2)
    h2Songs.classList.add('text-2xl', 'sm:text-3xl', 'font-semibold', 'text-center', 'my-6', 'tracking-wider', 'text-orange-600', 'drop-shadow-lg');
    h2Songs.textContent = 'Songs';

    // Agregamos los elementos al contenedor interno
    albumContentContainer.appendChild(h1);
    albumContentContainer.appendChild(p);
    albumContentContainer.appendChild(h2Songs);
    
    // Si hay una imagen de portada, la agregamos
    if (album.cover) {
        const imgCover = document.createElement('img');
        imgCover.classList.add(
            'w-48', 'h-48', 'sm:w-64', 'sm:h-64', 'md:w-72', 'md:h-72', // Tamaño responsivo
            'object-cover', 'rounded-lg', 'shadow-md', 'mx-auto', 'my-6', // Estilo de imagen y centrado
            'border-2', 'border-orange-700' // Borde
        );
        imgCover.src = album.cover;
        albumContentContainer.insertBefore(imgCover, p); // Insertar la imagen antes del párrafo
    }

    // Finalmente, agregamos el contenedor interno al div principal
    div.appendChild(albumContentContainer);

    // agregamos los addEventListener a los botones de la sidebar (solo una vez)
    editAlbum.addEventListener("click", () => {
        redirect("../html/editAlbum.html", album._id);
    });
    addSong.addEventListener("click", () => {
        redirect("../html/addSong.html", album._id);
    });
};

// Función que renderiza la lista de canciones.
function renderSongs(song) { // Cambiado el nombre de la variable de 'album' a 'song' para mayor claridad
    const albumDiv = document.querySelector('#albumDiv');
    
    // Busca el contenedor de contenido del álbum que creamos en renderAlbum
    let songsListContainer = albumDiv.querySelector('.songs-list-container');
    if (!songsListContainer) {
        songsListContainer = document.createElement('div');
        songsListContainer.classList.add(
            'songs-list-container', // Clase para identificar este contenedor
            'max-w-3xl', 'mx-auto', 'mb-8' // Ancho máximo y centrado
        );
        // Encuentra el último elemento en albumDiv (el h2 "Songs") y lo inserta después
        const h2Songs = albumDiv.querySelector('h2');
        if (h2Songs) {
            h2Songs.after(songsListContainer);
        } else {
            albumDiv.appendChild(songsListContainer); // Fallback si h2Songs no se encuentra
        }
    }

    // Ya no necesitas un <ul> por cada canción, solo una lista general
    // Asegúrate de que el <ul> exista dentro de songsListContainer, o créalo si no
    let ul = songsListContainer.querySelector('ul');
    if (!ul) {
        ul = document.createElement('ul');
        ul.classList.add('list-none', 'p-0', 'space-y-3'); // Espacio entre ítems de la lista
        songsListContainer.appendChild(ul);
    }

    const li = document.createElement('li');
    // Clases responsivas para cada elemento de la lista de canciones
    li.classList.add(
        'flex', 'flex-col', 'sm:flex-row', 'items-center', 'justify-between', 
        'bg-gray-800', 'bg-opacity-70', 'p-3', 'sm:p-4', 'rounded-lg', 'shadow-md', 
        'text-white', 'text-sm', 'sm:text-base' // Tamaño de texto responsivo
    );
    
    const spanSongNumber = document.createElement('span');
    spanSongNumber.classList.add('font-bold', 'mb-1', 'sm:mb-0', 'sm:mr-2');
    spanSongNumber.textContent = `${numSong}-`;

    const spanSongTitle = document.createElement('span');
    spanSongTitle.classList.add('flex-grow', 'text-center', 'sm:text-left', 'mb-1', 'sm:mb-0'); // Centrado en móvil, izquierda en sm+
    spanSongTitle.textContent = song.title;

    const spanSongDuration = document.createElement('span');
    spanSongDuration.classList.add('text-sm', 'text-gray-300', 'mb-2', 'sm:mb-0', 'sm:mr-2');
    spanSongDuration.textContent = song.duration;

    const spanSongIcons = document.createElement('span');
    spanSongIcons.classList.add('flex', 'space-x-4'); // Espacio entre íconos

    const iconTrash = document.createElement('i');
    // Usar una CLASE en lugar de un ID para los íconos de eliminación
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer', 'text-red-500', 'hover:text-red-700', 'text-lg', 'sm:text-xl');
    iconTrash.setAttribute('data-song-id', song._id); // Guardar el ID de la canción en un atributo de datos

    const iconMusic = document.createElement('i');
    iconMusic.classList.add('fa-brands', 'fa-youtube', 'cursor-pointer', 'text-red-400', 'hover:text-red-600', 'text-lg', 'sm:text-xl');
    iconMusic.setAttribute('data-song-link', song.link); // Guardar el enlace en un atributo de datos

    numSong++;

    li.appendChild(spanSongNumber);
    li.appendChild(spanSongTitle);
    li.appendChild(spanSongDuration);
    spanSongIcons.appendChild(iconTrash);
    spanSongIcons.appendChild(iconMusic);
    li.appendChild(spanSongIcons);
    ul.appendChild(li);

    // Agregamos un addEventListener para abrir en una nueva venta un video de youtube.
    iconMusic.addEventListener("click", (e) => {
        const songLink = e.currentTarget.getAttribute('data-song-link');
        if (songLink) {
            window.open(songLink, "_blank");
        }
    });

    // Añadir el addEventListener para el icono de basura
    iconTrash.addEventListener("click", (e) => {
        const songIdToDelete = e.currentTarget.getAttribute('data-song-id');
        if (songIdToDelete) {
            deleteSong(idAlbum, songIdToDelete);
        }
    });
};


// Función para eliminar una canción y le agregamos el addEventListener al trash icon.
const deleteSong = async (albumId, songId) => { // Nombres más claros para los parámetros
    try {
        await axios.put(`../song/delete/${albumId}?idSong=${songId}`);
        await swal({
            title: "Song deleted correctly!",
            icon: "success",
        });

        // Simplemente vuelve a cargar el álbum y sus canciones para refrescar
        getAlbum(); 

    } catch (error) {
        console.error("Error al eliminar la canción:", error); // Usar console.error
        swal({
            title: "Error al eliminar la canción",
            text: error.message || "Algo salió mal.",
            icon: "error",
        });
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
