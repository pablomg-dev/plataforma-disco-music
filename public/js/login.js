// Guardar en una constante el Enter para el Login.
const loginButton = document.querySelector("#login");
// Declarar un objeto vacio para luego capturar los inputs.
const objectToSend = {};

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
    const inputs = document.querySelectorAll("input")
    inputs.forEach((input) => (objectToSend[input.id] = input.value));
};

// Función para el Login, con los inputs ya guardados y validando al usario.
const loginUser = async (e) => {
    e.preventDefault();
    getInputValues();
    try {
        const response = await axios.post(`../login`, objectToSend);
        await swal({
            title: "Login Successfull!",
            icon: "success",
          });
        window.location.href = `../html/home.html`;
    }
    catch (error) {
        swal("Error!", "Wrong Email or Password.", "error");
    }
};

// Agregar un addEventListener al Enter Button para ejecutar la función loginUser.
loginButton.addEventListener("click", (e) => loginUser(e));