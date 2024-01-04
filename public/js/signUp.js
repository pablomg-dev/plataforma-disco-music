const buttonRegister = document.querySelector("#buttonRegister");
const objectToSend = {};

function getInputValues() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (objectToSend[input.id] = input.value));
}

const userRegister = async (e) => {
    e.preventDefault();
    getInputValues();
    try {
        const response = await axios.post(`../../createuser`, objectToSend);
        window.location.href = `./login.html`;
    }

    catch (error) {
        console.log(error);
    }
};

buttonRegister.addEventListener("click", (e) => userRegister(e));