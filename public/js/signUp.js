// Guardar en una constante el Submit button para registrarse.
const buttonRegister = document.querySelector("#buttonRegister");

// Función para tomar los valores del form (los input que haga el usuario).
function getInputValues() {
    // Capturar los input y guardarlos.
    const nameInput = document.querySelector('#name');
    const lastNameInput = document.querySelector('#lastName');
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    // Obtener los valores de los campos de entrada.
    const nameValue = nameInput.value;
    const lastNameValue = lastNameInput.value;
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    // Devolver los valores en un objeto.
    return {
        name: nameValue,
        lastName: lastNameValue,
        email: emailValue,
        password: passwordValue,
    };
};

// Función para el registro, con los inputs ya guardados y validando al usuario.
const userRegister = async (e) => {
    e.preventDefault();
    const objectToSend = getInputValues();
    try {
        const response = await axios.post(`../createuser`, objectToSend);
        await swal({
            title: "SignUp Successfull!",
            icon: "success",
        });
        window.location.href = `./login.html`;
    }
    catch (error) {
        swal("Error!", "You must complete all fields.", "error");
    }
};

// Agregar un addEventListener al Submit button para ejecutar la función userRegister.
buttonRegister.addEventListener("click", (e) => userRegister(e));