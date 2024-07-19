/* eslint-disable react/prop-types */
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { updateUserById } from "../../services/userService";
import { hasRole } from "../../utils/userUtiles";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function EditProfileDialog({
  openEditDialog,
  handleEditClose,
  setSnackbarOpen,
  setSnackbarMessage,
  userData,
}) {
  const isStudent = hasRole("ROLE_STUDENT");
  const token = localStorage.getItem("token");
    const [snackbarOpen2, setSnackbarOpen2] = useState(false);
    const [snackbarMessage2, setSnackbarMessage2] = useState("");
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: "",
    confirmPassword: "",
    inscriptionNumber: userData.inscriptionNumber,
    cin: userData.cin,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSnackbarOpen2(true);
      setSnackbarMessage2("Passwords do not match");
      return;
      
    }
    const response = await updateUserById(
      token,
      userData.id,
      formData,
      setSnackbarOpen,
      setSnackbarMessage
    );
    console.log(response);
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
          <Typography variant="h6">Edit Profile</Typography>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleEditClose} />
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              value={formData.firstName}
              focused={userData.firstName ? true : false}
              variant="standard"
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              focused={userData.lastName ? true : false}
              variant="standard"
              value={formData.lastName}
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              variant="standard"
              name="password"
              label="Password"
              type="password"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              variant="standard"
              name="confirmPassword"
              label="Confirm-password"
              type="password"
              fullWidth
              onChange={handleChange}
              error={formData.password !== formData.confirmPassword}
            />
          </Grid>
          {isStudent && (
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                variant="standard"
                focused={userData.inscriptionNumber ? true : false}
                name="inscriptionNumber"
                value={formData.inscriptionNumber}
                label="Inscription Number"
                type="text"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              variant="standard"
              name="cin"
              focused={userData.cin ? true : false}
              label="CIN"
              type="text"
              value={formData.cin}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose} color="error">
          Cancel
        </Button>
        <Button type="submit" variant="outlined">
          Edit
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen2}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage2 && snackbarMessage2.includes("success")
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage2}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default EditProfileDialog;
