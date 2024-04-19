import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { register } from "../../services/authService";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Register() {
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const jsonData = {};
    if (userType === "ROLE_STUDENT") {
      data.set("studiedBranch", data.get("branch"));
      data.set("role", "ROLE_STUDENT");
      data.delete("branch");
    } else if (userType === "ROLE_SUPERVISOR") {
      data.set("branch", data.get("branch"));
      data.set("role", "ROLE_SUPERVISOR");
      data.delete("studiedBranch");
    }

    // Remove fields with empty values from FormData
    for (let [key, value] of data.entries()) {
      if (value.trim() !== "") {
        jsonData[key] = value;
      }
    }
    console.log(jsonData);
    const response = await register(
      jsonData,
      setSnackbarMessage,
      setSnackbarOpen,
      setLoading
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="inscriptionNumber"
                label="Inscription N°"
                name="inscriptionNumber"
                autoComplete="inscription"
                disabled={userType !== "ROLE_STUDENT"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="cin"
                label="Cin"
                name="cin"
                autoComplete="cin"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>

            <Grid item xs={6}>
              <Select
                fullWidth
                id="userType"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                <MenuItem value="ROLE_SUPERVISOR">Supervisor</MenuItem>
                {/* <MenuItem value="ROLE_HEAD_OF_BRANCH">Head of Branch</MenuItem> */}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Select fullWidth id="branch" name="branch" defaultValue={"1"}>
                <MenuItem value="1">GI</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            loading={loading}
            loadingIndicator="Loading…"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            variant="contained"
          >
            <span>Sign Up</span>
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouterLink to={"/auth/authenticate"}>
                Already have an account? Sign In
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
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

      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
