import AssignmentIcon from "@mui/icons-material/Assignment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import SubjectIcon from "@mui/icons-material/Subject";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import { Collapse, ListItemButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasRole } from "../../utils/userUtiles";
import { DrawerHeader, StyledDrawer } from "./sideBar";
import { getAllProjects } from "../../services/projectService";
import { ExpandCircleDown, PeopleOutline } from "@mui/icons-material";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";

const studentStuff = [
  { id: 0, text: "BackLog", icon: <SubjectIcon />, path: "/dashboard/project/backlog" },
  { id: 1, text: "Board", icon: <ViewWeekIcon />, path: "/dashboard/project/board" },
  {
    id: 2,
    text: "Reports",
    icon: <QueryStatsIcon />,
    path: "/project/reports",
  },
  { id: 3, text: "Team", icon: <PeopleAltIcon />, path: "/dashboard/project/team" },
  { id: 43, text: "Docs", icon: <FolderCopyRoundedIcon />, path: "/dashboard/project/docs" },
];
const supervisorStuff = [
  // { id: 6, text: "Defenses", icon: <CoPresentIcon />, path: "/defenses" },
];
const HOBStuff = [
  { id: 7, text: "Requests", icon: <PersonAddAlt1Icon />, path: "/dashboard/requests" },
  { id: 8, text: "Teams", icon: <PeopleAltIcon />, path: "/dashboard/teams" },
  {
    id: 10,
    text: "Assignments",
    icon: <AssignmentIcon />,
    path: "/dashboard/assignments",
  },
];

const forAll = [
  {
    id: 11,
    text: "Result",
    icon: <AssignmentIcon />,
    path: "/dashboard/assignments/result",
  },
  { id: 9, text: "Defenses", icon: <CoPresentIcon />, path: "/dashboard/defense" },
  { id: 12, text: "Branch", icon: <SchoolIcon />, path: "/dashboard/branch" },
  { id: 13, text: "Projects", icon: <FolderCopyIcon />, path: "/dashboard/projects" },
];
// eslint-disable-next-line react/prop-types
export default function SideBar({ mode, open, handleDrawerClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [projects , setProjects] = useState([{}]);

  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  const isStudent = hasRole("ROLE_STUDENT");
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

    const [expandedProjectId, setExpandedProjectId] = useState(null);

    const handleProjectClick = (projectId) => {
      setExpandedProjectId(projectId === expandedProjectId ? null : projectId);
    };

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await getAllProjects(token);
      console.log(fetchedProjects);
      setProjects(fetchedProjects);
    }
    if(isSupervisor){
      fetchProjects();
    }
  }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledDrawer variant="persistent" anchor="left" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <Tooltip title="Collapse">
                <ChevronLeftIcon />
              </Tooltip>
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px", // Adjust the width of the scrollbar
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent", // Make the scrollbar track transparent
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                mode == "light"
                  ? "rgba(0, 0, 0, 0.3)"
                  : "rgba(255, 255, 255, 0.3)", // Adjust the transparency of the scrollbar thumb
              borderRadius: "10px", // Adjust the border radius of the scrollbar thumb
            },
          }}
        >
          {isStudent ? (
            <List>
              <ListSubheader sx={{
                backgroundColor  : mode === "light" ? "#f5f6fa" : "#121212",
              }}>PROJECT</ListSubheader>
              {studentStuff.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    sx={{ pl: 4, borderRadius: "4px" }}
                    selected={selectedIndex === item.id}
                    onClick={(event) => {
                      handleListItemClick(event, item.id);
                      navigate(item.path);
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText sx={{ ml: -1.5 }} primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : null}

          {isSupervisor ? (
            <>
              <Divider />
              <List>
                <ListSubheader sx={{
                  backgroundColor  : mode === "light" ? "#f5f6fa" : "#121212",
                }}>PROJECTS</ListSubheader>
                {projects && projects.length > 0 ? projects.map((project) => (
                  <div key={project.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={{ borderRadius: "4px" }}
                        selected={selectedIndex === project.id}
                        onClick={(event) => {
                          handleProjectClick(project.id);
                        }}
                      >
                        <ListItemIcon
                          sx={{ transition: "transform 0.3s ease" }}
                        >
                            <ExpandCircleDown
                              sx={{
                                transition: "transform 0.3s ease-in-out ",
                                transform: expandedProjectId === project.id ? "rotate(0deg)" : "rotate(-90deg)",
                              }}
                            />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ ml: -1.5 }}
                          primary={project.title}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Collapse
                      in={expandedProjectId === project.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List disablePadding>
                        <ListItemButton
                          sx={{ ml: 2, borderRadius: "5px" }}
                          onClick={(event) => {
                            navigate(`/dashboard/my-projects/backlog?projectId=${project.id}`);
                          }}
                        >
                          <ListItemIcon>
                            <SubjectIcon />
                          </ListItemIcon>
                          <ListItemText sx={{ ml: -1 }} primary="Backlog" />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ ml: 2, borderRadius: "5px" }}
                          onClick={(event) => {
                            navigate(`/dashboard/my-projects/board?teamId=${project.teamId}`);
                          }}
                        >
                          <ListItemIcon>
                            <ViewWeekIcon />
                          </ListItemIcon>
                          <ListItemText sx={{ ml: -1 }} primary="Board" />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ ml: 2, borderRadius: "5px" }}
                          onClick={(event) => {
                            navigate(`/dashboard/my-projects/team?teamId=${project.teamId}`);
                          }}
                        >
                          <ListItemIcon>
                            <PeopleAltIcon />
                          </ListItemIcon>
                          <ListItemText sx={{ ml: -1 }} primary="Team" />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ ml: 2, borderRadius: "5px" }}
                          onClick={(event) => {
                            navigate(`/dashboard/my-projects/reports?projectId=${project.id}`);
                          }}
                        >
                          <ListItemIcon>
                            <QueryStatsIcon />
                          </ListItemIcon>
                          <ListItemText sx={{ ml: -1 }} primary="Reports" />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ ml: 2, borderRadius: "5px" }}
                          onClick={(event) => {
                            navigate(`/dashboard/my-projects/docs?projectId=${project.id}`);
                          }}
                        >
                          <ListItemIcon>
                            <FolderCopyRoundedIcon />
                          </ListItemIcon>
                          <ListItemText sx={{ ml: -1 }} primary="Docs" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </div>
                )) : (
                  <div style={{display:"flex" , justifyContent:"center" , flexDirection:"column" ,alignItems:"center" ,padding:"20px 0 30px 0"}}>
                    <Typography color="textSecondary">No projects found</Typography>
                    <Typography color="textSecondary" variant="body2">go ahead and create one.</Typography>
                  </div>
                )}

              </List>
            </>
          ) : null}

          {isHOB ? (
            <>
              <Divider />
              <List>
                {HOBStuff.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      sx={{ borderRadius: "4px" }}
                      selected={selectedIndex === item.id}
                      onClick={(event) => {
                        handleListItemClick(event, item.id);
                        navigate(item.path);
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText sx={{ ml: -1.5 }} primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          ) : null}
          <Divider />
          <List>
            {forAll.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  sx={{ borderRadius: "4px" }}
                  selected={selectedIndex === item.id}
                  onClick={(event) => {
                    handleListItemClick(event, item.id);
                    navigate(item.path);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText sx={{ ml: -1.5 }} primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </StyledDrawer>
    </Box>
  );
}