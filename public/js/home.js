const redirect = (id) => { window.location.href = `./album.html?album=${id}`};

const getAlbums = async () => {
    try {
        const response = await axios.get("../album/all")
        response.data.map((album) => {
            renderAlbums(album)});

    } catch (error) {
        console.log(error);
    }
};

getAlbums();

const renderAlbums = (album) => {
    console.log(album);

    const div = document.querySelector('#albumDiv');
    const newDiv = document.createElement('div');
    const imgAlbum = document.createElement('img');
    const span = document.createElement('span');
    const iconTrash = document.createElement("i");

    span.textContent = album.yearOfRelease;
    imgAlbum.classList.add('w-48', 'cursor-pointer');
    imgAlbum.src= album.cover ? album.cover : 'https://imgur.com/0uSALUr.png'
    iconTrash.classList.add('fa-solid', 'fa-trash-can', 'cursor-pointer');
    

    div.appendChild(newDiv);
    newDiv.appendChild(span);
    newDiv.appendChild(imgAlbum);
    newDiv.appendChild(iconTrash);

    imgAlbum.addEventListener("click", () => {
        redirect(album._id);
      });
};