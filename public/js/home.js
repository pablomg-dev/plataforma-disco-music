// Importamos las funciones onLoad y logOut.
import {onLoad, logOut, redirect} from "../utils/utils.js";

// Función que trae la información del backend para cada album, la renderiza y puede borrarla.
const getAlbums = async () => {
    try {
        // Limpiar el contenedor de álbumes antes de renderizar para evitar duplicados
        const albumsContainer = document.querySelector('#albumsDiv');
        albumsContainer.innerHTML = ''; // Limpia el contenido existente

        const response = await axios.get("../album/all");
        
        // Asegurarse de que response.data sea un array y tenga elementos
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            response.data.map((album) => {
                renderAlbums(album);
            });
            
            // Re-seleccionar los iconos de basura después de que los álbumes se rendericen
            const trashIcons = document.querySelectorAll('.fa-trash-can'); // Usar clase para seleccionar iconos

            // Asignar el evento click usando un enfoque más robusto
            albumsContainer.querySelectorAll('.singleDiv').forEach((divElement, index) => {
                const iconTrash = divElement.querySelector('.fa-trash-can');
                if (iconTrash) {
                    iconTrash.addEventListener("click", () => {
                        // Asegurarse de que el _id correcto se pase
                        deleteAlbum(response.data[index]._id);
                    });
                }
            });

        } else {
            console.log('No se encontraron álbumes o la respuesta no es válida.');
            // Opcional: Mostrar un mensaje al usuario si no hay álbumes
            albumsContainer.innerHTML = '<p class="text-black text-center text-xl mt-10">No hay álbumes para mostrar.</p>';
        }

    } catch (error) {
        console.error("Error al obtener o renderizar los álbumes:", error); // Usar console.error para errores
    }
};

// Se llama a getAlbums al cargar la página
getAlbums();

// Función que renderiza cada album para mostarlos en la Home.
const renderAlbums = (album) => {
    // Tomamos el Div padre.
    const div = document.querySelector('#albumsDiv');

    // Corrección: NO añadir 'mx-52' aquí. Los márgenes se manejan en el HTML con Tailwind.
    // div.classList.add('mx-52'); // <-- ELIMINAR ESTA LÍNEA

    // Creamos los elementos.
    const newDiv = document.createElement('div');
    const imgAlbum = document.createElement('img');
    const span = document.createElement('span');
    const iconTrash = document.createElement("i");

    // Le damos los estilos.
    // Añade clases de Tailwind para responsividad y espaciado de los items de album
    newDiv.classList.add('singleDiv', 'flex', 'flex-col', 'items-center', 'p-4', 'bg-white', 'bg-opacity-10', 'rounded-lg', 'shadow-lg', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200');
    
    // Estilos para el span del año
    span.classList.add('text-lg', 'font-semibold', 'text-black', 'mb-2');
    span.textContent = album.yearOfRelease;

    // Estilos para la imagen del álbum
    imgAlbum.classList.add('w-36', 'h-36', 'sm:w-48', 'sm:h-48', 'md:w-56', 'md:h-56', 'object-cover', 'rounded-md', 'mb-2', 'cursor-pointer', 'border', 'border-orange-600', 'shadow-md');
    imgAlbum.src = album.cover ? album.cover : 'https://imgur.com/0uSALUr.png'; // Fallback image

    // Estilos para el icono de basura
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer', 'text-red-500', 'hover:text-red-700', 'text-xl', 'mt-2'); // Más clases para estilo
    
    // Agregamos los elementos al HTML.
    newDiv.appendChild(span);
    newDiv.appendChild(imgAlbum);
    newDiv.appendChild(iconTrash);
    div.appendChild(newDiv);
    
    // Agregamos un addEventListener para redirigir a un album especifico, cuando den click en la imagen.
    imgAlbum.addEventListener("click", () => {
        redirect(album._id);
    });
};

// Función que borra un album especifico.
const deleteAlbum = async (albumId) => { // Cambiado 'album' a 'albumId' para mayor claridad
    try {
        await axios.delete(`../album/${albumId}`);
        await swal({
            title: "Album deleted successfully!",
            icon: "success",
        });

        // Después de borrar y mostrar el SweetAlert, NO necesitas recargar la página completa.
        // En su lugar, simplemente vuelve a cargar los álbumes para refrescar la lista.
        getAlbums(); // <-- Llama a getAlbums para refrescar la lista sin recargar toda la página

    } catch (error) {
        console.error("Error al borrar el álbum:", error); // Usar console.error para errores
        swal({
            title: "Error al borrar el álbum",
            text: error.message || "Algo salió mal.",
            icon: "error",
        });
    }
};

// Log Out.
// Capturar el Button Log Out.
const buttonLogout = document.querySelector("#logout");
buttonLogout.classList.add('cursor-pointer');
// Le agregamos un addEventListener y le aplicamos la función logOut.
buttonLogout.addEventListener("click", () => {
    logOut();
    window.location.href = "../index.html"; // Redirigir al index después de logout
});

// Función que sirve para que solo accedan los usuarios logueados.
onLoad();
