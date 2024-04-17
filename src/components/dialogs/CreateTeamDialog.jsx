import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import * as React from 'react';
import { useEffect } from "react";
import { getUsers } from '../../services/userService'; // Import de la fonction getUsers depuis le fichier usersservice
import { createTeam } from '../../services/teamService'; // Import de la fonction createTeam depuis le fichier teamService'
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';




const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
}); 

// eslint-disable-next-line react/prop-types
function CreateTeamDialog({ teamDialogOpen, handleModalClose }) {
  const [users, setUsers] = React.useState([]); // État pour stocker la liste des utilisateurs
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
 

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedUsers(newValue);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token JWT introuvable dans le stockage local.');
          return;
        }
        // Utilisation de la fonction getUsers pour récupérer les utilisateurs
        const usersData = await getUsers(token);
        // Filtrer les utilisateurs pour ne conserver que ceux qui ne sont dans aucune équipe
        const usersWithoutTeam = usersData.filter(user => !user.teamId);
        // Mettre à jour l'état avec la liste des utilisateurs récupérés sans équipe
        setUsers(usersWithoutTeam);
        // Ajouter un log pour suivre les utilisateurs récupérés
        console.log('Utilisateurs récupérés avec succès :', usersWithoutTeam);
      } catch (error) {
        // Gérer les erreurs survenues lors de la récupération des utilisateurs
        console.error('Erreur lors de la récupération des utilisateurs depuis le backend :', error);
      }
    };
    // Appeler la fonction de récupération des utilisateurs au montage du composant
    fetchUsers();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const teamData = {
      name: formJson.name,
      // Récupérer les IDs des utilisateurs sélectionnés à partir de selectedUsers
      membersIds: selectedUsers.map(user => user.id),
    };
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token JWT introuvable dans le stockage local.');
        return;
      }
      console.log('Données de l\'équipe à envoyer :', teamData); // Log des données de l'équipe à envoyer
      await createTeam(teamData, token, setSnackbarOpen, setSnackbarMessage);
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe :', error);
    }
  };




  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
    return '#' + Array(6 - color.length + 1).join('0') + color;
  }
  



  function stringAvatarByFullName(fullName) {
    return {
      sx: {
        bgcolor: stringToColor(fullName), // Utilisez le nom complet pour définir la couleur de fond
        width: 40,
        height: 40,
      },
      children: `${fullName.split(" ")[0][0]}${fullName.split(" ")[1][0]}`.toUpperCase(), // Utilisez les initiales du prénom et du nom de famille pour l'avatar
    };
  }
  
  

  return (
    <Dialog
      open={teamDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleModalClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit, // Appeler la fonction handleSubmit lors de la soumission du formulaire
      }}
      aria-describedby="alert-dialog-slide-description"
    >
  <DialogTitle sx={{  color: 'blue' }}>{"Create Team"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Please fill in the form to create your team
        </DialogContentText>

        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Name of Team :
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            type="text"
            fullWidth
            placeholder="Enter team name"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}

          />
        </Box>

        <Box mb={3} mt={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Members of Team :
          </Typography>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={users}
            filterSelectedOptions
            value={selectedUsers}
            onChange={handleAutocompleteChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.lastName}
                  {...getTagProps({ index })}
                  key={index} // Assurez-vous que chaque élément a une clé unique
                />
              ))
            }
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`} 
            filterOptions={(options, { inputValue }) =>
                              options.filter(
                              (option) =>
                                    option.lastName.toLowerCase().includes(inputValue.toLowerCase()) ||
                                    option.firstName.toLowerCase().includes(inputValue.toLowerCase())
                           ) }
            fullWidth
            renderOption={(props, option) => (
              <li {...props}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar {...stringAvatarByFullName(`${option.firstName} ${option.lastName}`)} />
                  <span style={{ marginLeft: 10 }}>{`${option.firstName} ${option.lastName}`}</span>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter Name of Member"
                variant="outlined"
                fullWidth
                margin="dense" // Ajustez la marge selon vos besoins
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="error">Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage && snackbarMessage.includes("successfully")
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default CreateTeamDialog;
