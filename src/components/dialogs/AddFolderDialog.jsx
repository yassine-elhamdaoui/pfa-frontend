/* eslint-disable react/prop-types */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Typography } from "@mui/material";
import { forwardRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { createFolder } from "../../services/folderService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function AddFolderDialog(
    { openDialog, handleClose ,project,setFolders, setSnackbarOpen, setSnackbarMessage}
) {
    const token = localStorage.getItem("token");
    const handleSubmit =async (e) => {
        e.preventDefault(); 
        project.folders.map((folder) => {
            if (folder.name === e.target.name.value) {
              setSnackbarMessage("Folder already exists");
              setSnackbarOpen(true);
              return;
            }
        });
        const response = await createFolder(token,project.id, e.target.name.value, setSnackbarOpen, setSnackbarMessage);
        console.log(response);
                console.log(project.id);
                console.log(e.target.name.value);
        setFolders((prevFolders) => [...prevFolders, response]);
        
        handleClose();
    }

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit, // Appeler la fonction handleSubmit lors de la soumission du formulaire
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Add Folder</Typography>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
        </div>
      </DialogTitle>
      <DialogContent>
        <Box sx={{width:"300px"}}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="name"
            id="name"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button type="submit" variant="outlined">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddFolderDialog