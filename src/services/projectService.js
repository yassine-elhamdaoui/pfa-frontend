
const Addproject =async(jwtToken,formData,setSnackbarMessage,setSnackbarOpen,setLoading)=>{
    console.log(formData.get("files[0]"));
    const response = await fetch("http://localhost:8081/api/projects",
   {
    method:"post",
    headers:{
        
        'Authorization': `Bearer ${jwtToken}`
    },
    body:formData
}); 
console.log(response);
try {
    if (response.ok) {
      setSnackbarMessage("Creation was made successfully");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage((await response.json()).message);
      setSnackbarOpen(true);
    }
  }
  catch (error) {
    console.error("Error during registration:", error);
    setSnackbarMessage("Error during registration");
    setSnackbarOpen(true);
  }finally {
    setLoading(false);
  }
    return  response;
}
export default Addproject;
   