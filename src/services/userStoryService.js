export const updateUserStory = async (newUserStory, userStoryId, token) => {
    try {
        const response = await fetch(`http://localhost:8080/api/user-stories/${userStoryId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },  
            body: JSON.stringify(newUserStory),
        });
        if (!response.ok) {
            throw new Error("Failed to update user story");
        }
        const updatedUserStory = await response.json();
        return updatedUserStory;
    }
    catch (error) {
        console.error("Error updating user story:", error);
        throw error;
    }
}