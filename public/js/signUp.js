const buttonRegister = document.querySelector("#buttonRegister");

buttonRegister.addEventListener("click", (e) => {
  userRegister(e);
});

// función para guardar los valores que ingresa el usuario
function getInputValues() {
    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Obtener los valores de los campos de entrada
    const nameValue = nameInput.value;
    const lastNameValue = lastNameInput.value;
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value

    // Devolver los valores en un objeto
    return {
      name: nameValue,
      lastName: lastNameValue,
      email: emailValue,
      password: passwordValue
    };
  }

const userRegister = async (e) => {
  e.preventDefault();
  const objectToSend = getInputValues();
  console.log(objectToSend, "OBJECT");
  try {
    await axios.post("http://localhost:3000/createuser", objectToSend);
    window.location.href = "http://localhost:3000/login";
  } catch (error) {
    console.log(error);
  }
};