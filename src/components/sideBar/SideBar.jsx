import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { ListItemButton } from "@mui/material";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SubjectIcon from "@mui/icons-material/Subject";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SchoolIcon from "@mui/icons-material/School";
import Tooltip from "@mui/material/Tooltip";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { StyledDrawer, DrawerHeader } from "./sideBar";
import { useState } from "react";
import { hasRole } from "../../utils/userUtiles";


const studentStuff = [
  { id: 0, text: "BackLog", icon: <SubjectIcon />, path: "/project/backlog" },
  { id: 1, text: "Board", icon: <ViewWeekIcon />, path: "/project/board" },
  {
    id: 2,
    text: "Reports",
    icon: <QueryStatsIcon />,
    path: "/project/reports",
  },
  { id: 3, text: "Team", icon: <PeopleAltIcon />, path: `/project/team/${localStorage.getItem("team")}` },
  {
    id: 4,
    text: "settings",
    icon: <SettingsIcon />,
    path: "/project/settings",
  },
];
const supervisorStuff = [
  { id: 5, text: "Projects", icon: <FolderCopyIcon />, path: "/projects" },
  { id: 6, text: "Defenses", icon: <CoPresentIcon />, path: "/defenses" },
];
const HOBStuff = [
  { id: 7, text: "Requests", icon: <PersonAddAlt1Icon />, path: "/requests" },
  { id: 8, text: "Teams", icon: <PeopleAltIcon />, path: "/teams" },
  { id: 9, text: "Defenses", icon: <CoPresentIcon />, path: "/defenses" },
  {
    id: 10,
    text: "Assignments",
    icon: <AssignmentIcon />,
    path: "/assignments",
  },
];

const forAll = [
  {
    id: 11,
    text: "Result",
    icon: <AssignmentIcon />,
    path: "/assignments/result",
  },
  { id: 12, text: "Branch", icon: <SchoolIcon />, path: "/branch" },
  { id: 13, text: "Projects", icon: <FolderCopyIcon />, path: "/projects" }
];
// eslint-disable-next-line react/prop-types
export default function SideBar({ mode, open, handleDrawerClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

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
          {!isHOB ? (
            <List>
              <ListSubheader>PROJECT</ListSubheader>
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
            </List>):null
          }

          {isSupervisor ? (
            <>
              <Divider />
              <List>
                {supervisorStuff.map((item, index) => (
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
