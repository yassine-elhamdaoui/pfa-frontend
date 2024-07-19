const getUsers = async (token) => {
  const users = await fetch("http://localhost:8080/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
  return users;
};

const getUserById = async (userId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

const getSupervisors = async (token) => {
  const supervisors = await fetch("http://localhost:8080/api/users/supervisors", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
  return supervisors;
};

const getStudents = async (token) => {
  const students = await fetch("http://localhost:8080/api/users/students", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
  return students;
}
const downLoadProfileImage = async (userId, token) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/users/${userId}/downloadProfileImage`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      return null;
    }
    const image = await response.blob();
     const url = window.URL.createObjectURL(image);
     console.log(url);
    return url;
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}
const updateUserById = async (
  token,
  userId,
  data,
  setSnackBarOpen,
  setSnackbarMessage
) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setSnackBarOpen(true);
      setSnackbarMessage("Failed to update user");
      throw new Error("Failed to update user");
    }
    const updatedUser = await response.json();
    setSnackBarOpen(true);
    setSnackbarMessage("User updated successfully");
    return updatedUser;
  } catch (error) {
    setSnackBarOpen(true);
    setSnackbarMessage("Failed to update user");
    console.error("Error updating user:", error);
    throw error;
  }
};
export { getUsers , getUserById, updateUserById,getSupervisors,getStudents, downLoadProfileImage};
