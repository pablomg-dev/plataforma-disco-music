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
        const response = await axios.post(`http://localhost:3000/createuser`, objectToSend);
        window.location.href = "https://audioslave-fanpage-p5.onrender.com/html/login.html";
    }

    catch (error) {
        console.log(error);
    }
};

buttonRegister.addEventListener("click", (e) => userRegister(e));