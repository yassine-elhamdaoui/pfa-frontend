/* eslint-disable react/prop-types */
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, TextField } from "@mui/material";
import { forwardRef, useState } from "react";
import { updateProjectPreferences } from "../../services/projectService";
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
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
// eslint-disable-next-line react/prop-types
const EditAssignmentDialog = ({
  teams,
  projects,
  originalAssignmentsResult,
  editDialogOpen,
  handleDialogClose,
  setSnackbarMessage,
  setSnackbarOpen,
}) => {
  const [newAssignment, setNewAssignment] = useState(originalAssignmentsResult);
  const token = localStorage.getItem("token");
  console.log(newAssignment);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submit");
  };
  const handleAssignClick = async () => {
    const projectCounts = {};
    let hasDuplicate = false;

    newAssignment.forEach((assignment) => {
      Object.keys(assignment.projectPreferenceRanks).forEach((projectId) => {
        projectCounts[projectId] = (projectCounts[projectId] || 0) + 1;
        if (projectCounts[projectId] > 1) {
          hasDuplicate = true;
        }
      });
    });

    if (hasDuplicate) {
      console.log("There are duplicate projects in project preference ranks.");
      setSnackbarMessage(
        "There are duplicate projects in project preference ranks."
      );
      setSnackbarOpen(true);
      // handleDialogClose();
    } else {
      console.log(newAssignment);
      await updateProjectPreferences(
        token,
        newAssignment,
        setSnackbarOpen,
        setSnackbarMessage
      );
      handleDialogClose();
    }
  };

  return (
    <Dialog
      open={editDialogOpen}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          handleSubmit(event);
        },
      }}
    >
      {" "}
      <DialogTitle>Edit Preferences</DialogTitle>
      <DialogContentText
        id="alert-dialog-slide-description"
        sx={{ paddingLeft: "25px", paddingRight: "25px" }}
      >
        Edit project preferences
      </DialogContentText>
      <DialogContent>
        <Grid container spacing={2}>
          {Array.from({ length: newAssignment.length }, (_, index) => (
            <Grid item xs={12} key={index}>
              <EditAssignmentRow
                index={index}
                teams={teams}
                projects={projects}
                newAssignments={newAssignment}
                setNewAssignment={setNewAssignment}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleAssignClick} color="primary" variant="outlined">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const EditAssignmentRow = ({ index, teams, projects, newAssignments,setNewAssignment }) => {
  const assignment = newAssignments[index];
  const team = teams.find((t) => t.id === assignment.user.teamId);
  const project = projects.find(
    (p) => p.id === parseInt(Object.keys(assignment.projectPreferenceRanks)[0])
  );
    const handleProjectChange = (newValue) => {
      console.log(newValue);
      setNewAssignment((prev) => {
        const updatedAssignments = [...prev];
        updatedAssignments[index] = {
          ...updatedAssignments[index],
          projectPreferenceRanks: {[newValue.id]:1},
        };
        return updatedAssignments;
      });
    };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          value={team ? team.name : ""}
          sx={{backgroundColor:lightColors[index%lightColors.length]}}
          disabled
        />
      </Grid>
      <Grid item xs={8}>
        <Autocomplete
          options={projects}
          getOptionLabel={(project) => project.title}
          renderInput={(params) => <TextField {...params} label="Project" />}
          value={project}
          onChange={(event, newValue) => {
            handleProjectChange(newValue);
          }}
        />
      </Grid>
    </Grid>
  );
};
export default EditAssignmentDialog;