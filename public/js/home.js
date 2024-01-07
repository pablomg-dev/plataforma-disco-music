// Función toma el id del album a renderizar y se lo agregaremos como query param a la url.
const redirect = (id) => { window.location.href = `./album.html?album=${id}` };

// Función que trae la información del backend para cada album y la renderiza con renderAlbums.
const getAlbums = async () => {
    try {
        const response = await axios.get("../album/all")
        response.data.map((album) => {
            renderAlbums(album)
        });

        const trash = document.querySelectorAll('i');
        for (let i = 0; i < trash.length; i++) {
            trash[i].addEventListener("click", () => {
                deleteAlbum(response.data[i]._id);
            });
        };

        renderAlbums(album);

        } catch (error) {
            console.log(error);
        }
    };

    getAlbums();


    // Función que renderiza cada album para mostarlos en la Home.
    const renderAlbums = (album) => {

        const div = document.querySelector('#albumDiv');
        const newDiv = document.createElement('div');
        const imgAlbum = document.createElement('img');
        const span = document.createElement('span');
        const iconTrash = document.createElement("i");

        span.textContent = album.yearOfRelease;
        imgAlbum.classList.add('w-48', 'h-48', 'cursor-pointer');
        imgAlbum.src = album.cover ? album.cover : 'https://imgur.com/0uSALUr.png';
        iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer');
        div.classList.add('oneAlbum');


        div.appendChild(newDiv);
        newDiv.appendChild(span);
        newDiv.appendChild(imgAlbum);
        newDiv.appendChild(iconTrash);

        // Redirigir a un album especifico cuando haga click en la imagen.
        imgAlbum.addEventListener("click", () => {
            redirect(album._id);
        });
    };

    // Función que borra un album especifico.
    const deleteAlbum = async (album) => {
        try {
            await axios.delete(`../album/${album}`);
            swal({
                title: "Album deleted successfully",
                icon: "success",
            });

            const albums = document.querySelectorAll(".oneAlbum");
            albums.forEach((album) => album.remove());
            const response = await axios.get("../album/all");
            response.data.map((album) => {
                renderAlbums(album);
            });

        } catch (error) {
            console.log(error.message);
        }
    };