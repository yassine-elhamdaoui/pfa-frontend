/* eslint-disable react/prop-types */
import React, { forwardRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DialogContentText, IconButton, Slide, Typography, colors } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Grid from "@mui/material/Grid";
import { makePreferences } from "../../services/projectService";

const lightColors = [
  "rgba(173, 216, 230, 0.2)",
  "rgba(216, 191, 216, 0.2)",
  "rgba(144, 238, 144, 0.2)",
  "rgba(255, 255, 153, 0.2)",
  "rgba(255, 204, 153, 0.2)",
  "rgba(255, 182, 193, 0.2)",
  "rgba(176, 224, 230, 0.2)",
  "rgba(218, 112, 214, 0.2)",
  "rgba(127, 255, 212, 0.2)",
  "rgba(240, 230, 140, 0.2)",
  "rgba(240, 128, 128, 0.2)",
  "rgba(255, 192, 203, 0.2)",
  "rgba(135, 206, 250, 0.2)",
  "rgba(255, 250, 205, 0.2)",
  "rgba(250, 128, 114, 0.2)",
  "rgba(245, 222, 179, 0.2)",
  "rgba(32, 178, 170, 0.2)",
  "rgba(255, 165, 0, 0.2)",
  "rgba(238, 130, 238, 0.2)",
  "rgba(175, 238, 238, 0.2)",
];

const token = localStorage.getItem("token");
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
function MakePreferencesDialog({
  projects,
  preferencesDialogOpen,
  handleModalClose,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const [selectedProjects, setSelectedProjects] = useState([]);
console.log(selectedProjects);
  const handleSubmit = (event) => {
    event.preventDefault();
    const ranking = selectedProjects.reduce((acc, curr, index) => {
      if (curr && curr.length > 0) {
        acc[curr[0].id] = index + 1;
      }
      return acc;
    }, {});
    console.log(ranking);
    makePreferences(token, ranking,setSnackbarOpen,setSnackbarMessage);
    handleModalClose();
  };
const getFilteredProjects = (index) => {
  return projects.filter((project) => {
    // Check if the project is not selected in any previous autocomplete
    return !selectedProjects.some((selectedProject, selectedIndex) => {
      return (
        selectedProject &&
        Array.isArray(selectedProject) &&
        selectedProject.length > 0 &&
        selectedIndex !== index &&
        selectedProject[0] &&
        selectedProject[0].id === project.id
      );
    });
  });
};
const selectedProjectColors = selectedProjects.map(() => {
  return lightColors[Math.floor(Math.random() * lightColors.length)];
});




return (
  <Dialog
    open={preferencesDialogOpen}
    onClose={handleModalClose}
    TransitionComponent={Transition}
    keepMounted
    PaperProps={{
      component: "form",
      onSubmit: (event) => {
        handleSubmit(event);
      },
    }}
  >
    <DialogTitle>Make Preferences</DialogTitle>
    <DialogContentText
      id="alert-dialog-slide-description"
      sx={{ paddingLeft: "25px" ,paddingRight:"25px"}}
    >
      {projects.length === 0
        ? "There are no projects to make preferences."
        : "Select your preferences for the projects."}
    </DialogContentText>
    <DialogContent>
      <Grid container spacing={2}>
        {Array.from({ length: projects.length }, (_, index) => (
          <Grid item xs={12} key={index}>
            {selectedProjects[index] ? (
              <div style={{ display: "flex", alignItems: "center",position:"relative" }}>
                <TextField
                  variant="outlined"
                  // label={`Preference ${index + 1}`}
                  value={`Preference ${index + 1} : ${selectedProjects[index][0].title}`}
                  fullWidth
                  disabled
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: lightColors[index%lightColors.length],
                      width: "100%",
                    },
                  }}
                />
                <IconButton
                  style={{ position: "absolute", right: "10px" ,zIndex:100 }}
                  onClick={() => {
                    setSelectedProjects((prevState) => {
                      const newState = [...prevState];
                      newState[index] = null;
                      return newState;
                    });
                  }}
                >
                  <HighlightOffIcon />
                </IconButton>a
              </div>
            ) : (
              <Autocomplete
                multiple
                id={`project-${index}`}
                options={getFilteredProjects(index)}
                getOptionLabel={(option) => option.title}
                filterSelectedOptions
                onChange={(event, value) => {
                  setSelectedProjects((prevState) => {
                    const newState = [...prevState];
                    newState[index] = value;
                    return newState;
                  });
                }}
                renderOption={(props, option, { selected }) => {
                  return (
                    <li {...props}>
                      <Typography>{option.title}</Typography>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={`Preference ${index + 1}`}
                    fullWidth
                  />
                )}
                ChipProps={{
                  style: {
                    backgroundColor: selectedProjectColors[index],
                    width: "90%",
                  },
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </DialogContent>
    <DialogActions>
        {projects.length > 0 && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
    </DialogActions>
  </Dialog>
);

}

export default MakePreferencesDialog;
