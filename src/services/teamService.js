export const getAllTeams = async (token) => {
    const branchId = localStorage.getItem("branchId");
    const studiedBranchId = localStorage.getItem("studiedBranchId");

    const selectedBranchId = branchId !== "null" ? branchId : studiedBranchId;

    const allTeams = await fetch("http://localhost:8080/api/teams", {
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
    const teams = allTeams.filter(
      (team) => team.responsible.studiedBranchId === parseInt(selectedBranchId)
    );
    console.log(teams);
    return teams;
}