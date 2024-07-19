import { LoadingButton } from "@mui/lab";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { forgotPassword, resetPassword, validateToken } from "../../services/authService";

const steps = ['Enter Email', 'Enter Security Token', 'Set New Password'];

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      PFA HUB {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const confirmPasswordRef = useRef(null);
  const [newPassword, setNewPassword] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNext = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (activeStep === 0) {
      // Handle sending email
      console.log('Email:', email);
      const response = await forgotPassword(email,setSnackbarOpen,setSnackbarMessage,setLoading,setActiveStep);
    } else if (activeStep === 1) {
      // Handle verifying token
      console.log('Token:', token);

      const response = await validateToken(email,token,setSnackbarOpen,setSnackbarMessage,setLoading,setActiveStep);
    } else if (activeStep === 2) {
      // Handle setting new password
      console.log('New Password:', newPassword);
      if (newPassword !== confirmPasswordRef.current.value) {
        setSnackbarOpen(true);
        setSnackbarMessage("Passwords do not match");
        setLoading(false);
      }else{
        const response = await resetPassword(token,newPassword,setSnackbarOpen,setSnackbarMessage,setLoading);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
        <Avatar
          src="/src/assets/auth_logo.png"
          sx={{ m: 1, bgcolor: "secondary.main" }}
        />
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box sx={{ width: "100%", mt: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box component="form" onSubmit={handleNext} sx={{ mt: 1 }}>
            {activeStep === 0 && (
              <>
                <Alert severity="info">
                  Enter the account email: you will get a security token that
                  you should put in the box.
                </Alert>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <Alert severity="info">
                  Check your email for the security token and enter it below.
                </Alert>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="token"
                  label="Security Token"
                  name="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </>
            )}
            {activeStep === 2 && (
              <>
                <Alert severity="info">Set your new password below.</Alert>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  inputRef={confirmPasswordRef}
                  //   value={data.confirmPassword}
                  //   onChange={handleChange}
                  //   error={data.password !== data.confirmPassword}
                />
              </>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Link href="/auth/authenticate" variant="body2">
                  Login
                </Link>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingIndicator="Loading…"
                    variant="outlined"
                  >
                    reset
                  </LoadingButton>
                ) : (
                  <Button variant="outlined" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
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
            snackbarMessage &&
            (snackbarMessage.includes("successfully") ||
              snackbarMessage.includes("is valid"))
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Copyright sx={{ mt: 4, mb: 4 }} />
    </Container>
  );
}

export default ForgotPassword;
