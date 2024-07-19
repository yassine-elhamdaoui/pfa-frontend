import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  deleteNotificationById,
  getAllNotificationsForCurrentUser,
} from "../../services/notificationService";
import { stringAvatar } from "../../utils/generalUtils";
import { hasRole } from "../../utils/userUtiles";
import CreateProjectDialog from "../dialogs/CreateProjectDialog";
import CreateTeamDialog from "../dialogs/CreateTeamDialog";
import Notifications from "../notification/Notifications";
import { Search, SearchIconWrapper, StyledInputBase } from "./navBar";
import ProfilePopover from "../profilePopover/ProfilePopover"; 
import { downLoadProfileImage, getUserById } from "../../services/userService";
import { forEach } from "lodash";


// eslint-disable-next-line react/prop-types
export default function NavBar({ handleDrawerOpen, setMode }) {
  const mode = localStorage.getItem("mode")
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [teamNotifications , setTeamNotifications] = useState([]);
  const [projectNotifications , setProjectNotifications] = useState([]);
  const [userData, setUserData] = useState({});
  const [elapsedTime, setElapsedTime] = useState({});
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);//////usestate pour item profile
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); ////////////anchore1 pour profil

    const [sendersImages, setSendersImages] = useState([]);

  const [profileImage, setProfileImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


    const handleCloseNotsView = () => {
      setNotificationAnchorEl(null);
    };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const notifications = await getAllNotificationsForCurrentUser(token);
        const user = await getUserById(localStorage.getItem("userId"), token);
        setUserData(user);
        // Trier les notifications par date de création
        notifications.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        );

              forEach(notifications, async (not) => {
                const url = await downLoadProfileImage(not.idOfSender, token);
              
                if (sendersImages.find((sender) => sender.id === not.idOfSender) === undefined){
                    setSendersImages((prev) => [
                      ...prev,
                      {
                        id: not.idOfSender,
                        url: url,
                      },
                    ]);
                }
              });
        const url = await downLoadProfileImage(user.id, token);
        setProfileImage(url);

        setNotifications(notifications);
        setTeamNotifications(notifications.filter((notification) => notification.type === "TEAM"));
        setProjectNotifications(notifications.filter((notification) => notification.type === "PROJECT"));
        // Calculer le temps écoulé pour chaque notification
        const now = Date.now();
        const elapsedTimeMap = {};
        notifications.forEach((notification) => {
          const creationTime = new Date(notification.creationDate).getTime();
          const diffInMinutes = Math.floor((now - creationTime) / (1000 * 60));
          elapsedTimeMap[notification.id] = calculateElapsedTime(diffInMinutes);
        });
        setElapsedTime(elapsedTimeMap);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setSnackbarMessage("Error fetching notifications");
        setSnackbarOpen(true);
      }
    };
    fetchNotifications();

    // Set up polling to fetch notifications every 1 minute
    const interval = setInterval(fetchNotifications, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const calculateElapsedTime = (diffInMinutes) => {
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 43200) {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 525600) {
      const diffInMonths = Math.floor(diffInMinutes / 43200);
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else {
      const diffInYears = Math.floor(diffInMinutes / 525600);
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  };

const handleDeleteNotification = async (notificationId, notificationType) => {
  try {
    const token = localStorage.getItem("token");
    await deleteNotificationById(token, notificationId);

    if (notificationType === "TEAM") {
      // Update the teamNotifications state
      const updatedTeamNotifications = teamNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setTeamNotifications(updatedTeamNotifications);
    }
    if (notificationType === "PROJECT") {
      // Update the projectNotifications state
      const updatedProjectNotifications = projectNotifications.filter(
        (notification) => notification.id !== notificationId
      );
      setProjectNotifications(updatedProjectNotifications);
    }

    // Update the notifications state
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};


  const isMenuOpen = Boolean(anchorEl);
  const isModeMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationPopoverOpen = Boolean(notificationAnchorEl);

  const haveTeam = localStorage.getItem("team") !== "null";

  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isStudent = hasRole("ROLE_STUDENT");
  const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");


  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setProfilePopoverOpen(true);
    handleMenuClose(); 
  };
  
  const handleProfilePopoverClose = () => {
    setProfilePopoverOpen(false);
    setProfileAnchorEl(null);
  
  };

  const handleAddTeamButtonClicked = () => {
    setTeamDialogOpen(true);
  };
  const handleAddProjectButtonClicked = () => {
    setProjectDialogOpen(true);
  };

  const handleModalClose = () => {
    setProjectDialogOpen(false);
    setTeamDialogOpen(false);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleModeMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLightModeChosen = () => {
    setMode("light");
    handleMenuClose();
    localStorage.setItem("mode", "light");
  };
  const handleDarkModeChosen = () => {
    setMode("dark");
    handleMenuClose();
    localStorage.setItem("mode", "dark");
  };




  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick} sx={{padding:"5px 20px"}}>Profile</MenuItem>
      {window.screen.width >= 900 ? (
        <MenuItem onClick={(event) => setAnchorEl2(event.currentTarget)} sx={{padding:"5px 20px"}}>
          Theme
        </MenuItem>
      ) : null}
    </Menu>
  );
  const renderModeMenu = (
    <Menu
      anchorEl={anchorEl2}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isModeMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLightModeChosen}>Light</MenuItem>
      <MenuItem onClick={handleDarkModeChosen}>Dark</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem 
        onClick={(event) => (setMobileMoreAnchorEl(null),setNotificationAnchorEl(event.currentTarget))}
      >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleModeMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <DarkModeIcon />
        </IconButton>
        <p>Theme</p>
      </MenuItem>
    </Menu>
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        position="fixed"
        open={open}
        sx={{
          backgroundColor: mode === "light" ? "#f5f6fa" : "#171717",
          width: "100svw",
          zIndex: 1000,
          boxShadow: " 0px 2px 5px 0px rgba(0, 0, 0, 0.1)",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <NavLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img src="/src/assets/logo2.png" height={60} width={60} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              PFA HUB
            </Typography>
          </NavLink>
          <Search
            sx={{
              backgroundColor: mode === "dark" ? "#444" : "#33333320",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {isStudent && !haveTeam ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleAddTeamButtonClicked}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              Create Team
            </Button>
          ) : null}

          {isSupervisor || isHOB ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleAddProjectButtonClicked}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              Create Project
            </Button>
          ) : null}
          {isStudent && !haveTeam ? (
            <Tooltip title="Create team" arrow>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleAddTeamButtonClicked}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          ) : null}
          {isSupervisor || isHOB ? (
            <Tooltip title="Create project" arrow>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleAddProjectButtonClicked}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          ) : null}

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={(event) => setNotificationAnchorEl(event.currentTarget)}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Notifications
              notificationAnchorEl={notificationAnchorEl}
              isNotificationPopoverOpen={isNotificationPopoverOpen}
              handleCloseNotsView={handleCloseNotsView}
              notifications={notifications}
              elapsedTime={elapsedTime}
              handleDeleteNotification={handleDeleteNotification}
              mode={mode}
              teamNotifications={teamNotifications}
              sendersImages={sendersImages}
            />


            <Box sx={{
              display:"flex",
              alignItems:"center",
              padding: "0 10px",
              borderRadius: "50px",
              border: `1px solid ${mode === "light" ? "#333" : "#ccc"}`,
              height: "40px",
            }}>
            <Typography variant="body2">
              {userData.firstName} {userData.lastName}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {localStorage.getItem("token") ? (
                // <Avatar {...stringAvatar(localStorage.getItem("name"))} />
                <Avatar
                  alt="Profile"
                  src={profileImage !== "" && profileImage}
                  sx={{ width: 35, height: 35 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Box>

      {profilePopoverOpen && <ProfilePopover
        anchorEl={profileAnchorEl}
        open={profilePopoverOpen}
        userData={userData}
        onClose={handleProfilePopoverClose}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />}

      {renderMobileMenu}
      {renderMenu}
      {renderModeMenu}
      {(isSupervisor || isHOB) && (
        <CreateProjectDialog
          projectDialogOpen={projectDialogOpen}
          handleModalClose={handleModalClose}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        
        />
      )}
      {isStudent && (
        <CreateTeamDialog
          teamDialogOpen={teamDialogOpen}
          handleModalClose={handleModalClose}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage && snackbarMessage.includes("success")
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
