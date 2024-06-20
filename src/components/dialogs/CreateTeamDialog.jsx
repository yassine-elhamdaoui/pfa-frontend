import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import * as React from "react";
import { useEffect } from "react";
import { getUsers } from "../../services/userService"; // Import de la fonction getUsers depuis le fichier usersservice
import { createTeam } from "../../services/teamService"; // Import de la fonction createTeam depuis le fichier teamService'
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import { stringAvatar } from "../../utils/generalUtils";
import { getAcademicYear } from "../../services/projectService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
function CreateTeamDialog({ teamDialogOpen, handleModalClose ,setSnackbarOpen, setSnackbarMessage}) {
  const [users, setUsers] = React.useState([]); // État pour stocker la liste des utilisateurs
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedUsers(newValue);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token JWT introuvable dans le stockage local.");
          return;
        }
        // Utilisation de la fonction getUsers pour récupérer les utilisateurs
        const usersData = await getUsers(token);
        // Filtrer les utilisateurs pour ne conserver que ceux qui ne sont dans aucune équipe
        const usersWithoutTeamAndStudentRole = usersData.filter(
          (user) =>
            user.email !== localStorage.getItem("email") &&
            !user.teamId &&
            user.authorities.some(
              (authority) => authority.authority === "ROLE_STUDENT"
            )
        );

        // Mettre à jour l'état avec la liste des utilisateurs récupérés sans équipe
        setUsers(usersWithoutTeamAndStudentRole);
        // Ajouter un log pour suivre les utilisateurs récupérés
        console.log(
          "Utilisateurs récupérés avec succès :",
          usersWithoutTeamAndStudentRole
        );
      } catch (error) {
        // Gérer les erreurs survenues lors de la récupération des utilisateurs
        console.error(
          "Erreur lors de la récupération des utilisateurs depuis le backend :",
          error
        );
      }
    };
    // Appeler la fonction de récupération des utilisateurs au montage du composant
    fetchUsers();
  }, []);

  const handleSubmit =  (event) => {
        let academicYear 
          const year = new Date().getFullYear();
          const month = new Date().getMonth();
          if (month >= 9 && month <= 12) {
            academicYear = `${year}/${year + 1}`;
          } else if (month >= 1 && month <= 7) {
            academicYear = `${year - 1}/${year}`;
          }
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const teamData = {
      name: formJson.name,
      // Récupérer les IDs des utilisateurs sélectionnés à partir de selectedUsers
      membersIds: selectedUsers.map((user) => user.id),
      academicYear: academicYear
    };
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token JWT introuvable dans le stockage local.");
        return;
      }
      console.log("Données de l'équipe à envoyer :", teamData); // Log des données de l'équipe à envoyer
       createTeam(teamData, token, setSnackbarOpen, setSnackbarMessage);
       handleModalClose();
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe :", error);
    }
  };

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
      <DialogTitle>
        <div style={{display:"flex",alignItems:"center" ,justifyContent:"space-between"}}>
          <Typography variant="h6">Create Team</Typography>
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={handleModalClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Please fill in the form to create your team
        </DialogContentText>

        <Box>
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="name"
            id="name"
          />
        </Box>

        <Box>

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
            getOptionLabel={(option) =>
             `${option.firstName} ${option.lastName}` 
            }
            filterOptions={(options, { inputValue }) =>
              options.filter(
                (option) =>
                  option.lastName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                  option.firstName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
              )
            }
            fullWidth
            renderOption={(props, option) => (
              <li {...props}>
                <div style={{ display: "flex", alignItems: "center" ,gap:"10px"}}>
                  <Avatar
                    {...stringAvatar(
                     `${option.firstName} ${option.lastName}`
                    )}
                  />
                  <div>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                    <Typography variant="body2" color="textSecondary">{option.email}</Typography>
                  </div>
                </div>
              </li> 
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                label="members"
                margin="dense" // Ajustez la marge selon vos besoins
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </DialogActions>

    </Dialog>
  );
}

export default CreateTeamDialog;