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
import { PhotoCamera, Close, Edit } from "@mui/icons-material";
import { getUserById } from "../../services/userService";
import { uploadProfileImage } from "../../services/imageService";
import { updateUserById } from "../../services/userService";

const ProfilePopover = ({ anchorEl, open, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [inscriptionNumber, setInscriptionNumber] = useState("");
  const [popoverWidth, setPopoverWidth] = useState("auto");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const user = await getUserById(userId, token);
        setUserData(user);
        if (user.profileImage) {
          const profileImageUrl = `http://localhost:8080${user.profileImage}`;
          setProfileImage(profileImageUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const token = localStorage.getItem("token");
      try {
        const updatedUser = await uploadProfileImage(
          userData.id,
          e.target.files[0],
          token
        );
        const profileImageUrl = `http://localhost:8080${updatedUser.profileImage}`;
        setProfileImage(profileImageUrl);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const handleEditClick = () => {
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setEmail(userData.email);
    setPassword("");
    setNewPassword("");
    setInscriptionNumber(userData.inscriptionNumber || "");
    setIsEditing(true);
    setPopoverWidth("80%");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const updatedUserData = {
      firstName,
      lastName,
      email,
      password,
      inscriptionNumber,
    };

    try {
      const id = localStorage.getItem("userId");
      const updatedUser = await updateUserById(id, updatedUserData, token);

      setUserData(updatedUser);

      if (updatedUser.token) {
        localStorage.setItem("token", updatedUser.token);
      }

      setIsEditing(false);
      setPopoverWidth("auto");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          width: popoverWidth,
          maxWidth: 600,
          p: 4,
        },
      }}
    >
      <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Avatar
            src={profileImage}
            alt="Profile"
            sx={{ width: 150, height: 150 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="icon-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
        {userData && (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {userData.email}
            </Typography>
            {userData.authorities.some(
              (authority) => authority.authority === "ROLE_STUDENT"
            ) && (
              <Typography variant="body1" align="center" gutterBottom>
                Inscription Number {userData.inscriptionNumber}
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="center">
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <TextField
                    label="Firstname"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Lastname"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {userData.authorities.some(
                    (authority) => authority.authority === "ROLE_STUDENT"
                  ) && (
                    <TextField
                      label="Numéro d'inscription"
                      variant="outlined"
                      value={inscriptionNumber}
                      onChange={(e) => setInscriptionNumber(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    mt={2}
                    sx={{ width: "100%" }}
                  >
                    <Button variant="outlined" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};

export default ProfilePopover;
