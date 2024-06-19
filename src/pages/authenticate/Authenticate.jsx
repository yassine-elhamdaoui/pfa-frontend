import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { authenticate } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

export default function Authenticate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };
    const [error, setError] = useState({
      code: null,
      message: "",
    });
  function handleClick() {
    setLoading(true);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClick();
    
    const data = new FormData(event.currentTarget);
    const res = await authenticate(
      data.get("email"),
      data.get("password"),
      setSnackbarOpen,
      setSnackbarMessage,
      setLoading
    );
    
    if (res.token) {
      localStorage.setItem("token", res.token);
      setError(null);
      setLoading(false);
        var a = document.createElement("a");
        a.href = "/";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
      setError(res);
    }
    console.log(res);
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            type="submit"
            loading={loading}
            loadingIndicator="Loading…"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            variant="contained"
          >
            <span>Sign In</span>
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to={"/auth/register"}>
                Don't have an account? Sign Up
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
