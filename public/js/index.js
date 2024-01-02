// const divAlbums = document.querySelector("#albums");

// const renderAlbums = (album) => {
//   console.log(album);
//   const div = document.createElement("div");
//   const imgAlbum = document.createElement("img");

//   div.classList.add("flex justify-center flex-wrap text-center mx-36 gap-10");
//   let urlPortada = album.portada;
//   imgAlbum.setAttribute("src", urlPortada);

//   div.appendChild(imgAlbum);
//   divAlbums.appendChild(div);
// }

// const getAlbums = async () => {
//   try {
//     const respuesta = await axios.get("./album/all");
//     console.log(respuesta.data);
//     respuesta.data.map((album) =>{
//       console.log(album);
//       renderAlbums(album);
//     })
//   } catch (error) {
//     console.log(error);
//   }
// };

// getAlbums();