const loginButton = document.querySelector("#login");
const objectToSend = {};

function getInputValues() {
    const inputs = document.querySelectorAll("input")
    inputs.forEach((input) => (objectToSend[input.id] = input.value));
};

const loginUser = async (e) => {
    e.preventDefault()
    getInputValues()
    try {
        const response = await axios.post(`http://localhost:3000/login`, objectToSend);
        window.location.href = "http://localhost:3000/";
    }

    catch (error) {
        swal("Error!", "Wrong Email or Password.", "error");
    }
};

loginButton.addEventListener("click", (e) => loginUser(e));