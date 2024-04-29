const getUsers = async (token) => {
  const users = await fetch("http://localhost:8081/api/users", {
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

export { getUsers };



export const getSupervisorById = async (supervisorId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${supervisorId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch supervisors: ${response.status}`);
    }

    const supervisors = await response.json();
    return supervisors;
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    throw error;
  }
};

