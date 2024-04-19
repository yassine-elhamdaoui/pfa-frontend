import { forwardRef, useEffect, useState } from "react";
import {
  DialogActions,
  DialogContentText,
  DialogTitle,
  Slide,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
  useMediaQuery,
  Typography,
  Avatar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getUsers } from "../../services/userService";
import createProject from "../../services/projectService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { stringAvatar } from "../../utils/generalUtils";
import { StyledDialog, StyledDialogContent, StyledGrid, VisuallyHiddenInput } from "./createProjectDialog";
const lightColors = [
   "rgba(173, 216, 230, 0.5)",
   "rgba(216, 191, 216, 0.5)",
   "rgba(144, 238, 144, 0.5)",
   "rgba(255, 255, 153, 0.5)",
   "rgba(255, 204, 153, 0.5)",
   "rgba(255, 182, 193, 0.5)",
];
const chipStyles = {};
for (let i = 0; i < 20; i++) {
  chipStyles[
    `& .css-1pje9j3-MuiButtonBase-root-MuiChip-root:nth-of-type(${i + 1})`
  ] = {
    backgroundColor: lightColors[i%6],
  };
  chipStyles[
    `& .css-38raov-MuiButtonBase-root-MuiChip-root:nth-of-type(${i + 1})`
  ] = {
    backgroundColor: lightColors[i % 6],
  };
}




const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const token = localStorage.getItem("token");

// eslint-disable-next-line react/prop-types
function CreateProjectDialog({ projectDialogOpen, handleModalClose ,setSnackbarOpen, setSnackbarMessage }) {
  const [techOptions,setTechOptions] = useState([
    {
      title: "JavaScript",
      iconClassName: "devicon-javascript-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "React",
      iconClassName: "devicon-react-original colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Node.js",
      iconClassName: "devicon-nodejs-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Express.js",
      iconClassName: "devicon-express-original colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Vue.js",
      iconClassName: "devicon-vuejs-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Angular",
      iconClassName: "devicon-angularjs-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Python",
      iconClassName: "devicon-python-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Django",
      iconClassName: "devicon-django-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Ruby on Rails",
      iconClassName: "devicon-rails-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "React Native",
      iconClassName: "devicon-react-original colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Flutter",
      iconClassName: "devicon-flutter-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "MongoDB",
      iconClassName: "devicon-mongodb-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "MySQL",
      iconClassName: "devicon-mysql-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "PostgreSQL",
      iconClassName: "devicon-postgresql-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Git",
      iconClassName: "devicon-git-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Docker",
      iconClassName: "devicon-docker-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Kubernetes",
      iconClassName: "devicon-kubernetes-plain colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "Symfony",
      iconClassName: "devicon-symfony-original colored",
      iconStyle: { fontSize: "20px" },
    },
    {
      title: "SpringBoot",
      iconClassName: "devicon-spring-plain colored",
      iconStyle: { fontSize: "20px" },
    },
  ]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [supervisors, setSupervisors] = useState([]);
  const [projectType, setProjectType] = useState("old");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [],
    codeLink: "",
    branch: 1,
    supervisors: [],
    files: [],
    report: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers(token);
      setSupervisors(
        users.filter(
          (user) =>
            user.email !== localStorage.getItem("email") &&
            user.authorities.some(
              (authority) => authority.authority === "ROLE_SUPERVISOR"
            )
        )
      );
    }
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setProjectType(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleTechChange = (event, value) => {

    setFormData((prevFormData) => ({
      ...prevFormData,
      techStack: value,
    }));
  };

  const handleSupervisorsChange = (event, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supervisors: value,
    }));
  };

  const handleFilesChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: Array.from(event.target.files).slice(0, 10),
    }));
  };

  const handleReportFileChange = (event) => {
    setFormData({ ...formData, report: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const techStack = formData.techStack.map((tech) => tech.title).join(", ");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("status", projectType);
    data.append("techStack", techStack);
    data.append("codeLink", formData.codeLink);
    data.append("branch", formData.branch);
    data.append(
      "supervisors",
      formData.supervisors.map((supervisor) => supervisor.id)
    );
    data.append("report", formData.report);
    if (formData.files.length === 0) {
      data.append("files", null);
    } else {
      formData.files.forEach((file) => data.append("files", file));
    }
    for (let pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    await createProject(token, data ,setSnackbarOpen , setSnackbarMessage);
    setLoading(false);
    handleModalClose();
  };




  return (
    <StyledDialog
      open={projectDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleModalClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          handleSubmit(event);
        },
      }}
    >
      <DialogTitle>Create Project</DialogTitle>
      <DialogContentText
        id="alert-dialog-slide-description"
        sx={{ marginLeft: "25px" }}
      >
        Fill in the details to create a new project
      </DialogContentText>
      <StyledDialogContent>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Project Type</FormLabel>
          <RadioGroup
            aria-label="projectType"
            name="projectType"
            value={projectType}
            onChange={handleRadioChange}
            row
          >
            <FormControlLabel
              value="old"
              control={<Radio />}
              label="Old Project"
            />
            <FormControlLabel
              value="new"
              control={<Radio />}
              label="New Project"
            />
          </RadioGroup>
        </FormControl>

        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              fullWidth
              id="title"
              name="title"
              label="Title"
              type="text"
              variant="standard"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          {/* Tech Stack */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="techStack"
              options={techOptions}
              filterSelectedOptions
              disableCloseOnSelect
              sx={chipStyles}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <i
                      className={option.iconClassName}
                      style={option.iconStyle}
                    ></i>
                    <span style={{ marginLeft: 8 }}>{option.title}</span>
                  </div>
                </li>
              )}
              onChange={handleTechChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tech Stack"
                  placeholder="Select Tech Stack"
                />
              )}
            />
          </Grid>
          {/* Supervisors */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="supervisors"
              disableCloseOnSelect
              filterSelectedOptions
              options={supervisors}
              getOptionLabel={(option) =>
                option.firstName + " " + option.lastName
              }
              value={formData.supervisors}
              onChange={handleSupervisorsChange}
              renderOption={(props, option) => (
                <li {...props}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      {...stringAvatar(
                        `${option.firstName} ${option.lastName}`
                      )}
                    />
                    <div>
                      <span>{`${option.firstName} ${option.lastName}`}</span>
                      <Typography variant="body2" color="textSecondary">
                        {option.email}
                      </Typography>
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supervisors"
                  placeholder="Selected supervisors"
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Code Link (if project is old) */}
          {projectType === "old" && (
            <Grid item xs={12}>
              <TextField
                id="codeLink"
                name="codeLink"
                label="Code Link"
                type="url"
                fullWidth
                variant="standard"
                value={formData.codeLink}
                onChange={handleChange}
              />
            </Grid>
          )}
          {projectType === "old" && (
            <StyledGrid item xs={12}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                fullWidth={isSmallScreen}
                startIcon={<CloudUploadIcon />}
              >
                Upload Report
                <VisuallyHiddenInput
                  type="file"
                  name="report"
                  id="report"
                  onChange={handleReportFileChange}
                />
              </Button>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                fullWidth={isSmallScreen}
                startIcon={<CloudUploadIcon />}
              >
                Upload Files
                <VisuallyHiddenInput
                  type="file"
                  name="files"
                  id="files"
                  multiple
                  onChange={handleFilesChange}
                />
              </Button>
            </StyledGrid>
          )}
        </Grid>
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={handleModalClose}>Cancel</Button>
        <LoadingButton
          type="submit"
          loading={loading}
          loadingIndicator="creating..."
          sx={{ paddingLeft: "15px", paddingRight: "15px" }}
          variant="contained"
        >
          <span>Save project</span>
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default CreateProjectDialog;
