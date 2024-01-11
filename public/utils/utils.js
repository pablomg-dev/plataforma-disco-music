// const onLoad = async () => {
//     try {
//       const response = await axios.get("../me");
//       username.textContent = `${response.data.name} ${response.data.lastName}`;
//     } catch (error) {
//       window.location.href = "../index.html";
//     }
//   };
  
  const logOut = async () => {
    try {
      const response = await axios.post("../logout");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export { logOut };