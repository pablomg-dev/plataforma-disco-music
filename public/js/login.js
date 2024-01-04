// const parrafo = document.getElementById("passShort")
const objectToSend = {};

const loginButton = document.querySelector("#login");
loginButton.addEventListener("click", (e) => loginUser(e));

function getInputValues() {
    const inputs = document.querySelectorAll("input")
    inputs.forEach((input) => (objectToSend[input.id] = input.value))
    console.log(inputs);
};

const loginUser = async (e) => {
    e.preventDefault()
    getInputValues()
    try {
        const response = await axios.post(`http://localhost:3000/login`, objectToSend)
        swal("Good job!", "You clicked the button!", "success");
        window.location.href = "http://localhost:3000/";
    }
    
    catch (error) {
        swal("Error!", "Wrong Email or Password.", "error");
    }
};