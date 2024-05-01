export const getAllUserStories = async (token) => {
    try {
        const response = await fetch("http://localhost:8080/api/userstory", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        return data;


    } catch (error) {
        console.error("Error fetching user stories: ", error);

    }
}