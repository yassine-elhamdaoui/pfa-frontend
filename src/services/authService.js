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

const register = async (jsonData,setSnackbarMessage,setSnackbarOpen,setLoading) => {
  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
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

  const response = await fetch(`http://localhost:8080/api/auth/${id}/reject?user=${id}`, {
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

export { authenticate, register , acceptUser, rejectUser};
