/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { stringAvatar } from "../../utils/generalUtils";
import { forEach } from "lodash";
import { downLoadProfileImage } from "../../services/userService";

const JoinRequestContainer = styled(Paper)(({ theme }) => ({
  width: "100%", // Default width for small screens
  margin: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("md")]: {
    width: "75%", // Adjust width for large screens
  },
  [theme.breakpoints.up("lg")]: {
    width: "60%", // Adjust width for large screens
  },
}));

const UserInfoContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  flex: 1,
});

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));


// eslint-disable-next-line react/prop-types
function JoinRequest({ request, setOpenDialog, setIsAcceptConfirmation ,setSelectedUser,setRender}) {
  const token = localStorage.getItem("token");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [image, setImage] = useState([]);
  useEffect(() => {
    async function fetchImages() {
      const images = await downLoadProfileImage(request.user.id,token);
      setImage(images);
    }
    fetchImages();
  }, [request]);
  const handleMoreMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <JoinRequestContainer elevation={3}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <UserInfoContainer>
          <Avatar
            // {...stringAvatar(
            //   request.user.firstName + " " + request.user.lastName
            // )}
            src={image && image}
            height={45}
            width={45}
          />
          <div>
            <Typography variant="h6">{`${request.user.firstName} ${request.user.lastName}`}</Typography>
            <Typography variant="body1" color="textSecondary">
              {`${request.user.email}`}
            </Typography>
          </div>
        </UserInfoContainer>
        {request.user.authorities.map((authorityObj, index) => (
          <Typography key={index} variant="body2" color="textSecondary">
            {authorityObj.authority.includes("ROLE_SUPERVISOR")
              ? "Supervisor"
              : "Student"}
          </Typography>
        ))}

        {isSmallScreen ? (
          <div>
            <IconButton
              aria-label="more"
              aria-controls="more-menu"
              aria-haspopup="true"
              onClick={handleMoreMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Accept</MenuItem>
              <MenuItem onClick={handleMenuClose}>Reject</MenuItem>
            </Menu>
          </div>
        ) : (
          <ButtonGroup>
            <Button
              size="medium"
              color="primary"
              disableElevation
              onClick={() => (
                setSelectedUser(request.id),
                setOpenDialog(true),
                setIsAcceptConfirmation(true),
                setRender((prev) => !prev)
              )}
            >
              Accept
            </Button>
            <Button
              size="medium"
              color="error"
              disableElevation
              onClick={() => (
                setSelectedUser(request.id),
                setOpenDialog(true),
                setIsAcceptConfirmation(false),
                setRender((prev) => !prev)
              )}
            >
              Reject
            </Button>
          </ButtonGroup>
        )}
      </div>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        A new user has registered an account to the branch you're heading.
      </Typography>
    </JoinRequestContainer>
  );
}

export default JoinRequest;
