import { LoadingButton } from "@mui/lab";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import Link from "@mui/material/Link";
import { register } from "../../services/authService";
import { Paper, useMediaQuery } from "@mui/material";
import { VisuallyHiddenInput } from "../../components/dialogs/createProjectDialog";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
        PFA HUB{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Register() {
  const mode = localStorage.getItem("mode");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const confirmPasswordRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const navigate = useNavigate(); 

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    inscriptionNumber: "",
    cin: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_STUDENT",
    branch: "1",
    image: null,
  });

    const handleRemoveImage = () => {
      setUploadedImage(null);
      setData({ ...data, image: null });
    };

      const handleImageChange = (event) => {
        const file = event.target.files[0];
        setUploadedImage(file);
        setData({ ...data, image: file });
      };
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const steps = [
    "Personal Information",
    "Account Information",
    "Upload Image",
  ];

  const handleNext = () => {
    if (activeStep === 1) {
      if (data.password !== data.confirmPassword) {
        confirmPasswordRef.current.focus();
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRoleChange = (event) => {
    setData({ ...data, role: event.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    for (const key in data) {
      if (data[key] === "") {
        setSnackbarMessage("Please fill all fields");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
    }
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    console.log(data);
    const response = await register(
      formData,
      setSnackbarMessage,
      setSnackbarOpen,
      setLoading
    );
    console.log(await response.json());

    if (response && response.ok) {
      navigate("/auth/authenticate")
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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
                value={data.firstName}
                onChange={handleChange}
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
                value={data.lastName}
                onChange={handleChange}
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
                disabled={data.role !== "ROLE_STUDENT"}
                value={data.role === "ROLE_STUDENT" ? data.inscriptionNumber : ""}
                onChange={handleChange}
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
                value={data.cin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                id="role"
                value={data.role}
                onChange={handleRoleChange}
                defaultValue={"ROLE_STUDENT"}
              >
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                <MenuItem value="ROLE_SUPERVISOR">Supervisor</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Select fullWidth id="branch" name="branch" defaultValue={"1"}>
                <MenuItem value="1">GI</MenuItem>
              </Select>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={handleChange}
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
                value={data.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                inputRef={confirmPasswordRef}
                value={data.confirmPassword}
                onChange={handleChange}
                error={data.password !== data.confirmPassword}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 ,border:"solid 1px rgba(255,255,255,0.3)"}}>
                The image better be in square shape
              </Alert>
              <div
                style={{
                  border: `1px solid ${
                    mode === "dark" ? "#d3d3d350" : "rgba(0,0,0,0.3)"
                  }`,
                  width: "100%",
                }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="text"
                  sx={{
                    color: mode === "dark" ? "lightgray" : "rgba(0,0,0,0.6)",
                    width: "100%",
                  }}
                  tabIndex={-1}
                  fullWidth={isSmallScreen}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    name="report"
                    id="report"
                    onChange={handleImageChange}
                  />
                </Button>
                {uploadedImage && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      width: "100%",
                      minHeight: "60px",
                      borderTop: `1px solid ${
                        mode === "dark" ? "#d3d3d350" : "rgba(0,0,0,0.3)"
                      }`,
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt=""
                        width="100%"
                      />
                      <DeleteOutlineIcon
                        sx={{
                          cursor: "pointer",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                        onClick={handleRemoveImage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingBottom: "50px" }}>
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 3 }}>
            {renderStepContent(activeStep)}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
          
              <Link href="/auth/authenticate" variant="body2">
                Already have an account?
              </Link>
              <div>
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
                    Sign Up
                  </LoadingButton>
                ) : (
                  <Button variant="outlined" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
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
