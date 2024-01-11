// Funcion que sirve para que solo accendan los usuarios logueados.
const onLoad = async () => {
  try {
    const response = await axios.get("../me");
    const username = document.querySelector('#username');
    username.textContent = `${response.data.name} ${response.data.lastName}`;
  } catch (error) {
    console.log(error);
    window.location.href = "../index.html";
  }
};

// Función para el Log Out, borrando las cookies.
  const logOut = async () => {
    try {
      const response = await axios.post("../logout");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export {onLoad, logOut };