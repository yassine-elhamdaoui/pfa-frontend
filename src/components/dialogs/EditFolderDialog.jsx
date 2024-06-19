/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {  updateFolder } from "../../services/folderService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function AddFolderDialog({
  openEditDialog,
  handleEditClose,
  setFolders,
  folders,
  folder,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    folders.map((folder) => {
      if (folder.name === e.target.name.value) {
        setSnackbarMessage("Folder already exists");
        setSnackbarOpen(true);
        return;
      }
    });
    const response = await updateFolder(
      token,
      folder.id,
      e.target.name.value,
      setSnackbarOpen,
      setSnackbarMessage
    );
    console.log(response);
    setFolders((prevFolders) => {
        const index = prevFolders.findIndex((f) => f.id === folder.id);
        const newFolders = [...prevFolders];
        newFolders[index] = response;
        return newFolders;
        });
        

    handleEditClose();
  };

  return (
    <Dialog
      open={openEditDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleEditClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
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
          <Typography variant="h6">Edit Folder</Typography>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleEditClose} />
        </div>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose} color="error">
          Cancel
        </Button>
        <Button type="submit" variant="outlined">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddFolderDialog;
