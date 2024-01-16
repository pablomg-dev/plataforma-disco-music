// Guardar en una constante el Enter button para el Login.
const loginButton = document.querySelector("#login");

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
  // Capturar los valores que ingresa el usuario.
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  // Devolver los valores en un objeto.
  return {
    email: email,
    password: password,
  };
};

// Función para el Login, con los inputs ya guardados y validando al usuario.
const loginUser = async (e) => {
    e.preventDefault();
    const objectToSend = getInputValues();
    try {
        const response = await axios.post("../login", objectToSend);
        await swal({
            title: "Login Successfull!",
            icon: "success",
          });
        window.location.href = `../html/home.html`;
    }
    catch (error) {
        swal("Error!", "Wrong Email or Password!", "error");
    }
};

// Agregar un addEventListener al Enter Button para ejecutar la función loginUser.
loginButton.addEventListener("click", (e) => loginUser(e));