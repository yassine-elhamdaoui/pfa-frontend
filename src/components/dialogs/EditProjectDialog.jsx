/* eslint-disable react/prop-types */
import { Autocomplete, Avatar, Button, DialogActions, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Slide, TextField, Typography, useMediaQuery } from "@mui/material";
import { StyledDialog, StyledDialogContent, StyledGrid, VisuallyHiddenInput } from "./createProjectDialog";
import { LoadingButton } from "@mui/lab";
import { forwardRef, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { hasRole } from "../../utils/userUtiles";
import createProject, { updateProject } from "../../services/projectService";
import { getUsers } from "../../services/userService";
import { getAllTeams } from "../../services/teamService";
import { stringAvatar } from "../../utils/generalUtils";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


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
    backgroundColor: lightColors[i % 6],
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


function EditProjectDialog({
    editProjectDialogOpen,
    handleModalClose,
    setSnackbarOpen,
    setSnackbarMessage,
    project
}) {
    const [techOptions, setTechOptions] = useState([
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
    const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  const [supervisors, setSupervisors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projectType, setProjectType] = useState("old");
    const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    techStack: techOptions.filter((option) => {
        return project.techStack.split(", ").includes(option.title);
    }),
    codeLink: project.codeLink,
    branch: 1,
    academicYear: project.academicYear,
    supervisors: [],
    team: null,
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            supervisors: supervisors.filter((supervisor) =>
            project.supervisorIds.includes(supervisor.id)
            ),
        }));
    }, [supervisors, project.supervisorIds]);

  const [loading, setLoading] = useState(false);


    useEffect(() => {
      async function fetchData() {
        const users = await getUsers(token);
        const fetchedTeams = await getAllTeams(token);
        setSupervisors(
          users.filter(
            (user) =>
              user.email !== localStorage.getItem("email") &&
              user.authorities.some(
                (authority) => authority.authority === "ROLE_SUPERVISOR"
              )
          )
        );
        setTeams(fetchedTeams.filter((team) => team.projectId === null));
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

      const handleTechChange = (event, value) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          techStack: value,
        }));
      };
      const handleTeamChange = (event, value) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          team: value,
        }));
      };

      const handleSupervisorsChange = (event, value) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          supervisors: value,
        }));
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const techStack = formData.techStack
          .map((tech) => tech.title)
          .join(", ");
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("status", projectType);
        data.append("techStack", techStack);
        data.append("codeLink", formData.codeLink);
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        if (month >= 9 && month <= 12) {
          formData.academicYear = `${year}/${year + 1}`;
        } else if (month >= 1 && month <= 7) {
          formData.academicYear = `${year - 1}/${year}`;
        }
        data.append("academicYear", formData.academicYear);
        data.append("branch", formData.branch);
        if (formData.team && formData.team.id !== null) {
          data.append("team", formData.team.id);
        } else {
          data.append("team", null);
        }
        data.append(
          "supervisors",
          formData.supervisors.map((supervisor) => supervisor.id)
        );
        for (let pair of data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        setLoading(false);
        await updateProject(token,project.id, data, setSnackbarOpen, setSnackbarMessage);
        handleModalClose();
      };
  return (
    <StyledDialog
      open={editProjectDialogOpen}
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
      <DialogTitle>
        {" "}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Create Project</Typography>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleModalClose} />
        </div>
      </DialogTitle>
      <DialogContentText
        id="alert-dialog-slide-description"
        sx={{ marginLeft: "25px" }}
      >
        Fill in the details to create a new project
      </DialogContentText>
      <StyledDialogContent>
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
              limitTags={4}
              value={formData.techStack}
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
                  //   value={formData.techStack}
                  label="Tech Stack"
                  placeholder="Select Tech Stack"
                />
              )}
            />
          </Grid>
          {/* Team stuff */}
          {isHOB && (
            <Grid item xs={12}>
              <Autocomplete
                id="team"
                options={teams}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p>{option.name}</p>
                      <Typography color="textSecondary" variant="body2">
                        {option.responsible.email}
                      </Typography>
                    </div>
                  </li>
                )}
                onChange={handleTeamChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team"
                    placeholder="Select Team"
                  />
                )}
              />
            </Grid>
          )}
          {/* Supervisors */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="supervisors"
              disableCloseOnSelect
              filterSelectedOptions
              value={formData.supervisors}
              options={supervisors}
              getOptionLabel={(option) =>
                option.firstName + " " + option.lastName
              }
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

        </Grid>
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="error">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          loading={loading}
          loadingIndicator="creating..."
          sx={{ paddingLeft: "15px", paddingRight: "15px" }}
          variant="outlined"
        >
          <span>Save project</span>
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default EditProjectDialog