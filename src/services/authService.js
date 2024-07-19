import { getUsers } from "./userService";

const authenticate = async (
  email,
  password,
  setSnackbarOpen,
  setSnackbarMessage,
  setLoading
) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    console.log({ email, password });
    if (response && response.ok) {
      const data = await response.json();
      const users = await getUsers(data.token);
      users.map((user) => {
        if (user.email === email) {
          localStorage.setItem("email", user.email);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("branchId", user.branchId);
          localStorage.setItem("studiedBranchId", user.studiedBranchId);
          localStorage.setItem("team", user.teamId);
          localStorage.setItem("authorities", JSON.stringify(user.authorities));
          localStorage.setItem("name", user.firstName + " "+user.lastName);
        }
      });
      return data;
    } else {
      setSnackbarMessage((await response.json()).message);
      setSnackbarOpen(true);
      setLoading(false)
      return await response.json();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const register = async (data,setSnackbarMessage,setSnackbarOpen,setLoading) => {
  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    body: data,
  });
  try {
    if (response.ok) {
      setSnackbarMessage("Registration was made successfully");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage((await response.json()).message);
      setSnackbarOpen(true);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    setSnackbarMessage("Error during registration");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }

  return response;
};

const acceptUser = async (token, id,setSnackbarOpen,setSnackbarMessage,setConfirmLoading) => {
  console.log(id);
  const response = await fetch(`http://localhost:8080/api/auth/accept?user=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (response.ok) {
    setSnackbarMessage("User accepted successfully");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    return await response.json();
  } else {
    setSnackbarMessage("Error accepting user");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    throw new Error("Error accepting user");
  }
}

const rejectUser = async (token,id ,setSnackbarOpen,setSnackbarMessage,setConfirmLoading) => {
  console.log(id);

  const response = await fetch(`http://localhost:8080/api/auth/reject?user=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (response.ok) {
    setSnackbarMessage("User rejected successfully");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    return await response.json();
  } else {
    setSnackbarMessage("Error rejecting user");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    throw new Error("Error rejecting user");
  }
  
}

const forgotPassword = async (email, setSnackbarOpen, setSnackbarMessage,setLoading,setActiveStep) => {
  const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: email,
  });

  if (response.ok) {
    setSnackbarMessage("Email sent successfully");
    setSnackbarOpen(true);
    setLoading(false);
    console.log("Email sent successfully");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log("after the setActiveStep");


  } else {
    setSnackbarMessage("Error sending password reset email");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    setSnackbarOpen(true);
    setLoading(false);
  }
};

const validateToken = async (email,token,setSnackBarOpen,setSnackbarMessage,setLoading,setActiveStep) => {
  const response = await fetch(`http://localhost:8080/api/auth/validate-token?token=${token}&email=${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(await response.json());
  if (response.ok) {
    setSnackBarOpen(true);
    setSnackbarMessage("Token is valid");
    setLoading(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  } else {
    setSnackBarOpen(true);
    setSnackbarMessage("Token is invalid");
    setLoading(false);
  }
}

const resetPassword = async (token,password,setSnackBarOpen,setSnackbarMessage,setLoading) => {
  const response = await fetch(`http://localhost:8080/api/auth/reset-password?token=${token}&password=${password}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    setSnackBarOpen(true);
    setSnackbarMessage("Password reset successfully");
    setLoading(false);
  } else {
    setSnackBarOpen(true);
    setSnackbarMessage("Error resetting password");
    setLoading(false);
  }
}

export { authenticate, register, acceptUser, rejectUser, forgotPassword ,resetPassword,validateToken};