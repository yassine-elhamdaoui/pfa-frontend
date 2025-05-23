
export const getAllTeams = async (token,academicYear) => {
    const branchId = localStorage.getItem("branchId");
    const studiedBranchId = localStorage.getItem("studiedBranchId");

    const selectedBranchId = branchId !== "null" ? branchId : studiedBranchId === "null" ? 1 : studiedBranchId;

    const allTeams = await fetch("http://localhost:8080/api/teams?academicYear="+academicYear, {
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
        console.log(allTeams);
        console.log(selectedBranchId);
    const teams = allTeams.filter(
      (team) => team.responsible.studiedBranchId === parseInt(selectedBranchId)
    );
    console.log(teams);
    return teams;
}

// teamService.js

const createTeam = async (teamData, token, setSnackbarOpen, setSnackbarMessage) => {
  console.log(teamData);
    try {
      const response = await fetch("http://localhost:8080/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create team:", data);
        throw new Error("Failed to create team");
      }
      localStorage.setItem("team", data.id);
      console.log("Team created with success here is Backend response:", data);
      setSnackbarMessage("Team created successfully"); // Message de succès
      setSnackbarOpen(true); // Ouvrir le Snackbar
      localStorage.setItem("team", data.id);
      let authorities = localStorage.getItem("authorities");
      authorities = authorities ? JSON.parse(authorities) : [];
      authorities.push({ authority: "ROLE_RESPONSIBLE" });
      const updatedAuthorities = JSON.stringify(authorities);
      localStorage.setItem("authorities", updatedAuthorities);

      return data;
    } catch (error) {
        console.error('Error creating team:', error);
        setSnackbarMessage("Failed to create team"); // Message d'erreur
        setSnackbarOpen(true); // Ouvrir le Snackbar
        throw error;
    }
};





const getTeamById = async (teamId, token) => {
  try {
      const response = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        return {};
      }
  
      const team = await response.json();
      return team;
    } catch (error) {
      console.error("Error fetching team:", error);
      throw error;
    }
    
};


export { createTeam , getTeamById};
