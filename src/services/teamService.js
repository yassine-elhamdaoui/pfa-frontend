
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

// teamService.js

const createTeam = async (teamData, token, setSnackbarOpen, setSnackbarMessage) => {
    try {
        const response = await fetch('http://localhost:8080/api/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(teamData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Failed to create team:', data);
            throw new Error('Failed to create team');
        }
        localStorage.setItem("team", data.id);
        console.log('Team created with success here is Backend response:', data);
        setSnackbarMessage("Team created successfully"); // Message de succès
        setSnackbarOpen(true); // Ouvrir le Snackbar
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team");
    }
    const team = await response.json();
    return team;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};


export { createTeam , getTeamById};



export const updateTeam = async (teamData, token, setSnackbarOpen, setSnackbarMessage) => {
  try {
    const teamId = localStorage.getItem("team");
      const response = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
          method: 'PUT', // Utilisation de la méthode PUT pour la mise à jour
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(teamData),
      });

      const data = await response.json();
      
      if (!response.ok) {
          console.error('Failed to update team:', data);
          throw new Error('Failed to update team');
      }
      
      console.log('Team updated successfully. Backend response:', data);
      setSnackbarMessage("Team updated successfully"); // Message de succès
      setSnackbarOpen(true); // Ouvrir le Snackbar
      return data;
  } catch (error) {
      console.error('Error updating team:', error);
      setSnackbarMessage("Failed to update team"); // Message d'erreur
      setSnackbarOpen(true); // Ouvrir le Snackbar
      throw error;
  }
};
