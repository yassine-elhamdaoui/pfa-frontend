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
