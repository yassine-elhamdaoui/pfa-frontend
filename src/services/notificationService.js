export const getAllNotificationsForCurrentUser = async (token) => {
    const userId = localStorage.getItem("userId");

    const allNotifications = await fetch(`http://localhost:8080/api/notifications/user/${userId}`, {
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

    console.log(allNotifications);
    return allNotifications;
}




export const deleteNotificationById = async (token, notificationId) => {
    const url = `http://localhost:8080/api/notifications/${notificationId}`;
    
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete notification");
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};



