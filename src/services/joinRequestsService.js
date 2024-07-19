export const getJoinRequests = async (token) => {
    const response = await fetch("http://localhost:8080/api/join-requests", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    console.log(data);
    return data;
}

export const acceptJoinRequest = async (token, id) => {
    const response = await fetch(`http://localhost:8080/api/join-requests/${id}/accept`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}

export const rejectJoinRequest = async (token, id) => {
    const response = await fetch(`http://localhost:8080/api/join-requests/${id}/reject`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}