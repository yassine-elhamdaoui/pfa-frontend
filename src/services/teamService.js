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

export { createTeam };
