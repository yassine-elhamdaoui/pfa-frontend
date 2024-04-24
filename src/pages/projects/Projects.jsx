import DeveloperBoardOffIcon from "@mui/icons-material/DeveloperBoardOff";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import { acceptProject, getAllProjects, rejectProject } from "../../services/projectService";
import { getUsers } from "../../services/userService";
import { stringAvatar } from "../../utils/generalUtils";
import { hasRole } from "../../utils/userUtiles";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";


const mode = localStorage.getItem("mode");
const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
function Projects() {
    console.log("rerender");
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedProject, setSelectedProject] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isAcceptConfirmation, setIsAcceptConfirmation] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  const handleClick = (event, Pro) => {
    console.time("handleClick"); // Start measuring time
    setAnchorEl(event.currentTarget);
    setSelectedProject(Pro);
    console.log(Pro.id);
    console.timeEnd("handleClick"); // End measuring time and log the result
  };

    const handleClose = () => {
      setSelectedProject(null);
      setAnchorEl(null);
    };

  const token = localStorage.getItem("token");

const cardColors = [
  mode === "dark" ? "rgba(173, 216, 230, 0.2)" : "rgba(173, 216, 230, 0.4)",
  mode === "dark" ? "rgba(216, 191, 216, 0.2)" : "rgba(216, 191, 216, 0.4)",
  mode === "dark" ? "rgba(144, 238, 144, 0.2)" : "rgba(144, 238, 144, 0.4)",
  mode === "dark" ? "rgba(255, 255, 153, 0.2)" : "rgba(255, 255, 153, 0.4)",
  mode === "dark" ? "rgba(255, 204, 153, 0.2)" : "rgba(255, 204, 153, 0.4)",
  mode === "dark" ? "rgba(255, 182, 193, 0.2)" : "rgba(255, 182, 193, 0.4)",
  mode === "dark" ? "rgba(255, 0, 0, 0.2)" : "rgba(255, 0, 0, 0.4)",
  mode === "dark" ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 255, 0, 0.4)",
  mode === "dark" ? "rgba(0, 0, 255, 0.2)" : "rgba(0, 0, 255, 0.4)",
  mode === "dark" ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 255, 0, 0.4)",
  mode === "dark" ? "rgba(255, 0, 255, 0.2)" : "rgba(255, 0, 255, 0.4)",
  mode === "dark" ? "rgba(0, 255, 255, 0.2)" : "rgba(0, 255, 255, 0.4)",
];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUsers = await getUsers(token);
        setUsers(fetchUsers);

        const fetchProjects = await getAllProjects(token);
        setProjects(fetchProjects);
        // setFilteredProjects(fetchProjects);
      } catch (err) {
        console.error("Error fetching Users And Projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Stack direction="row" spacing={2} marginTop={1} marginBottom={1} display="flex" justifyContent="space-between">
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="rectangular" width={40} height={40} sx={{borderRadius:"50%"}}/>
        </Stack>
      <Grid container spacing={2}>
        {[...Array(10)].map((_, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            gap={"10px"}
            key={index}
            sx={{ minWidth: "300px"}}
          >
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "250px",
              alignItems: "stretch",
              gap: "10px",
              flexGrow: 1,
            }}
          >
            <Box sx={{ p: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Skeleton variant="text" width={150} height={40} />
              </Stack>
              <Divider />
              <Skeleton variant="text" width="100%" height={100} />

              <Stack direction="row" spacing={1} marginTop={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </Stack>
            </Box>
            <Divider />
          </Card>
          </Grid>
        ))}
      </Grid>
      </>
    );
  }

  if (projects.length === 0) {
    return (
      <PlaceHolder
        icon={DeveloperBoardOffIcon}
        title="No Projects Yet"
        message="no projects published at the moment"
      />
    );
  } else {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight={400}>
            Projects
          </Typography>
          <IconButton
            aria-controls="filter-menu"
            aria-haspopup="true"
            // onClick={handleFilterClick}
          >
            <FilterListIcon />
          </IconButton>
          {/* <Menu
            id="filter-menu"
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterSelect("2023/2024")}>
              2023/2024
            </MenuItem>
          </Menu> */}
        </Box>
        <Grid container spacing={2}>
          {projects.map((Pro, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              gap={"10px"}
              key={Pro.id}
              sx={{ minWidth: "300px" }}
            >
              <Card
                key={Pro.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  minHeight: "250px",
                  flexGrow: 1,
                  "&:hover": {
                    boxShadow: 3, // More pronounced shadow on hover
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: cardColors[index % cardColors.length],
                    minWidth: "15px",
                  }}
                />
                <Box
                  variant="elevation"
                  sx={{
                    // bgcolor: cardColors[index % cardColors.length],
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    gap: "10px",
                    flexGrow: 1,
                    margin: 1,
                  }}
                  key={index}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack
                      display="flex"
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        fontWeight={900}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <StickyNote2Icon />
                        <Typography
                          variant="h5"
                          component="h2"
                          fontWeight={600}
                          onClick={() => {
                            navigate(`/projects/${Pro.id}`);
                          }}
                        >
                          {Pro.title.substring(0, 20)}
                          {Pro.title.length > 20 && "..."}
                        </Typography>
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {Pro.status === "new" && (
                          <FiberNewIcon fontSize="large" />
                        )}
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, Pro)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                    <Divider />
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      marginTop={2}
                      fontWeight={600}
                    >
                      {Pro.description.substring(0, 150)}
                      {Pro.description.length > 100 && "..."}
                    </Typography>

                    <Stack direction="row" spacing={1} paddingTop={3}>
                      <AvatarGroup>
                        {Pro.supervisorIds.map((SId) => {
                          const user = users.find((user) => user.id === SId);
                          if (user) {
                            const Fullname = `${user.firstName} ${user.lastName}`;
                            return (
                              <Tooltip key={user.id} title={Fullname}>
                                <Avatar {...stringAvatar(Fullname)} />
                              </Tooltip>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </AvatarGroup>
                    </Stack>
                  </Box>
                  <Divider />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => (
              navigate(`/projects/${selectedProject.id}`), handleClose()
            )}
          >
            View
          </MenuItem>
          {isHOB && selectedProject && !selectedProject.isPublic && (
            <MenuItem onClick={() => (setOpenDialog(true),setIsAcceptConfirmation(true))}>Accept</MenuItem>
          )}
          {isHOB && selectedProject && !selectedProject.isPublic && (
            <MenuItem
              onClick={() => (setOpenDialog(true), setIsAcceptConfirmation(false))}
            >
              Refuse
            </MenuItem>
          )}
        </Menu>
        <ConfirmationDialog
          message={
            isAcceptConfirmation
              ? "Are you sure you want to accept this project?"
              : "Are you sure you want to refuse this project?"
          }
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleConfirmClick={() =>
            isAcceptConfirmation
              ? acceptProject(
                  token,
                  selectedProject.id,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
              : rejectProject(
                  token,
                  selectedProject.id,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
          }
          setLoading={setConfirmLoading}
          loading={confirmLoading}
        />
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
      </Box>
    );
  }
}

export default Projects;
