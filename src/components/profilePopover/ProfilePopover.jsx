/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { PhotoCamera, Close, Edit, Download } from "@mui/icons-material";
import { downLoadProfileImage, getUserById } from "../../services/userService";
import { uploadProfileImage } from "../../services/imageService";
import { updateUserById } from "../../services/userService";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import EditProfileDialog from "../dialogs/EditProfileDialog";
const ProfilePopover = ({ anchorEl, open, onClose,userData, profileImage ,setProfileImage}) => {

  const mode = localStorage.getItem("mode");
    const token = localStorage.getItem("token");
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const updatedUser = await uploadProfileImage(
          userData.id,
          e.target.files[0],
          token
        );
        const url = await downLoadProfileImage(userData.id, token);
        setProfileImage(url);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPopover-paper": {
          borderRadius: "15px",
          width: window.innerWidth > 550 ? "280px" : "100svw",
          minHeight: "fit-content",
          maxHeight: "100vh",
          backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
          position: "relative",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <Box sx={{ borderRadius: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="10px"
          p="0 10px 10px 10px"
        >
          <div
            style={{
              position: "relative",
            }}
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            <Avatar alt="Profile" sx={{ width: 65, height: 65 }} 
            src= {profileImage !== "" && profileImage}
            />
            <label>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "-5px",
                  color: "lightgray",
                  display: isAvatarHovered ? "block" : "none",
                }}
                aria-label="upload picture"
                component="span" // Use component="span" to make the IconButton clickable
                disableRipple
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          {userData && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography fontSize={17}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography color="textSecondary" fontSize={13}>
                {userData.email}
              </Typography>
            </div>
          )}
          <Divider sx={{ width: "100%" }} />

          {userData && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "start",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => setOpenEditDialog(true)}
              >
                <BorderColorOutlinedIcon
                  sx={{
                    color:
                      mode === "dark"
                        ? "rgba(255,255,255,0,85)"
                        : "rgba(0,0,0,0,85)",
                  }}
                />
                <Typography color="textSecondary">Edit Profile</Typography>
              </div>
              {/* <Divider sx={{ width: "100%" }} /> */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                <LogoutIcon
                  sx={{
                    color:
                      mode === "dark"
                        ? "rgba(255,255,255,0,85)"
                        : "rgba(0,0,0,0,85)",
                  }}
                />
                <Typography color="textSecondary">Logout</Typography>
              </div>
            </Box>
          )}
        </Box>
      </Box>
      <EditProfileDialog
        openEditDialog={openEditDialog}
        handleEditClose={() => setOpenEditDialog(false)}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        userData={userData}
      />
    </Popover>
  );
};

export default ProfilePopover;
