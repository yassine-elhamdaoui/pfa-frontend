import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Popover
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import React, { useState, useEffect } from 'react';
import { useTheme } from "@mui/material/styles";
import { Search, SearchIconWrapper, StyledInputBase } from "./navBar";
import CreateProjectDialog from "../dialogs/CreateProjectDialog";
import CreateTeamDialog from "../dialogs/CreateTeamDialog";
import { NavLink } from "react-router-dom";
import { hasRole } from "../../utils/userUtiles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { stringAvatar } from "../../utils/generalUtils";
import { getAllNotificationsForCurrentUser ,deleteNotificationById} from '../../services/notificationService';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadCrumb from "../breadCrumb/BreadCrumb"
import {List, ListItem, ListItemText} from "@mui/material";
import { Divider } from "@mui/material";




// eslint-disable-next-line react/prop-types
export default function NavBar({ handleDrawerOpen, setMode }) {
  const theme = useTheme();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mobileNotificationPopupOpen, setMobileNotificationPopupOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState({});
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };


    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('token');
          const notifications = await getAllNotificationsForCurrentUser(token);
          // Trier les notifications par date de création
         notifications.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
         setNotifications(notifications); 
         // Calculer le temps écoulé pour chaque notification
        const now = Date.now();
        const elapsedTimeMap = {};
        notifications.forEach(notification => {
          const creationTime = new Date(notification.creationDate).getTime();
          const diffInMinutes = Math.floor((now - creationTime) / (1000 * 60));
          elapsedTimeMap[notification.id] = calculateElapsedTime(diffInMinutes);
        });
        setElapsedTime(elapsedTimeMap);     
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setSnackbarMessage('Error fetching notifications');
          setSnackbarOpen(true);
        }
      };
  
      fetchNotifications();
    }, []);
  




    const calculateElapsedTime = (diffInMinutes) => {
      if (diffInMinutes < 60) {
        return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes < 43200) {
        const diffInDays = Math.floor(diffInMinutes / 1440);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes < 525600) {
        const diffInMonths = Math.floor(diffInMinutes / 43200);
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
      } else {
        const diffInYears = Math.floor(diffInMinutes / 525600);
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
      }
    };


    const handleDeleteNotification = async (notificationId) => {
      try {
        const token = localStorage.getItem('token');
        await deleteNotificationById(token, notificationId);
        // Actualise la liste des notifications après la suppression
        const updatedNotifications = notifications.filter((notification) => notification.id !== notificationId);
        setNotifications(updatedNotifications);
        // Affiche une notification de succès
        setSnackbarMessage('Notification deleted successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting notification:', error);
        // Affiche une notification d'erreur
        setSnackbarMessage('Error deleting notification');
        setSnackbarOpen(true);
      }
    };
    









  const isMenuOpen = Boolean(anchorEl);
  const isModeMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationPopoverOpen = Boolean(notificationAnchorEl);

  const haveTeam = localStorage.getItem("team") != "null";

  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isStudent = hasRole("ROLE_STUDENT");

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
  const handleMobileNotificationPopupOpen = (event) => {
    setMobileNotificationPopupOpen(true);
  };
  
  const handleCloseMobileNotificationPopup = () => {
    setMobileNotificationPopupOpen(false);
  };

  const handleCloseNotificationPopover = () => {
    setNotificationAnchorEl(null);
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      {window.screen.width >= 900 ? (
        <MenuItem onClick={(event) => setAnchorEl2(event.currentTarget)}>
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
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={2} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleMobileNotificationPopupOpen}>
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
  const renderMobileNotificationPopup = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="mobile-notification-popup"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={mobileNotificationPopupOpen}
      onClose={handleCloseMobileNotificationPopup}
      sx={{ '& .MuiMenu-paper': { width: '100vw', maxWidth: '100vw', maxHeight: '80vh' } }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold', marginLeft: 2 }}>
          <BreadCrumb items={[{ label: "Notifications", link: "#" }]} />
        </Box>
        <Divider />
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem>
                {/* Contenu de chaque notification */}
                <ListItemText
                  primary={notification.title}
                  secondary={notification.description}
                />
                <IconButton onClick={() => handleDeleteNotification(notification.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              {index !== notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Menu>
  );

  








  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <NavLink to="/" style={{ textDecoration: "none", color: "white" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              PFA HUB
            </Typography>
          </NavLink>
          <Search>
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

          {isSupervisor ? (
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
          {isSupervisor ? (
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

          <Box sx={{ display: { xs: "none", md: "flex" } ,alignItems:"center"}}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={2} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            
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

          <Popover
  open={isNotificationPopoverOpen}
  anchorEl={notificationAnchorEl}
  onClose={handleCloseNotificationPopover}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  sx={{ width: '90%'}}
>
  <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, padding: '8px 0 0' }}>
    <Box sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold', marginLeft: 2 }}>
      <BreadCrumb items={[{ label: "Notifications", link: "#" }]} />
    </Box>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {notifications.map((notification, index) => (
        <ListItem
          key={notification.id}
          alignItems="flex-start"
          sx={{ borderBottom: index !== notifications.length - 1 ? '1px solid #ccc' : 'none' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {notification.title}
                  </Typography>
                  <IconButton onClick={() => handleDeleteNotification(notification.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              secondary={
                <React.Fragment>
                 <Typography
                   sx={{ display: 'inline', wordWrap: 'break-word' }}
                      component="span"
                      variant="body2"
                       color="text.primary"
                      >
                   {notification.description}
                 </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                    {elapsedTime[notification.id] ? `${elapsedTime[notification.id]}` : ''}
                  </Typography>
                </React.Fragment>
              }
            />
          </Box>
        </ListItem>
      ))}
    </List>
  </Box>
</Popover>


            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {localStorage.getItem("name") ? (
                <Avatar {...stringAvatar(localStorage.getItem("name"))} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
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
      </AppBar>
      {renderMobileMenu}
      {renderMobileNotificationPopup}
      {renderMenu}
      {renderModeMenu}
      {isSupervisor && (
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




















