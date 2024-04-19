import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
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
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Search, SearchIconWrapper, StyledInputBase } from "./navBar";
import CreateProjectDialog from "../dialogs/CreateProjectDialog";
import CreateTeamDialog from "../dialogs/CreateTeamDialog";
import { NavLink } from "react-router-dom";
import { hasRole } from "../../utils/userUtiles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { stringAvatar } from "../../utils/generalUtils";


// eslint-disable-next-line react/prop-types
export default function NavBar({ handleDrawerOpen, setMode }) {
  const theme = useTheme();
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

  const isMenuOpen = Boolean(anchorEl);
  const isModeMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const haveTeam = localStorage.getItem("team") != "null";

  const isSupervisor = hasRole("ROLE_SUPERVISOR");

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
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
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
          {!haveTeam ? (
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
          {!haveTeam ? (
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

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
      {renderMenu}
      {renderModeMenu}
      <CreateProjectDialog
        projectDialogOpen={projectDialogOpen}
        handleModalClose={handleModalClose}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
      />
      <CreateTeamDialog
        teamDialogOpen={teamDialogOpen}
        handleModalClose={handleModalClose}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
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