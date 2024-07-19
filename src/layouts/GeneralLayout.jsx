import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import Footer from "../components/footer/Footer";
import { useEffect, useState } from "react";
import { forEach } from "lodash";
import { downLoadProfileImage } from "../services/userService";
function GeneralLayout({ setMode }) {
    const location = useLocation();
    const mode = localStorage.getItem("mode") || "light";
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const shouldShowFooter = location.pathname === "/";
    const [profileImage, setProfileImage] = useState(null);
    useEffect(() => {
        downLoadProfileImage(userId,token).then((res) => {
            setProfileImage(res);
        });
    }, []);

  return (
    <Box className="app" style={{ height: "100%", minHeight: "100svh" }}>
      {shouldShowFooter && (
        <Box>
          <Box
            position="static"
            sx={{
              padding: {
                xs: "0px 10px", 
                md: "0px 40px", 
                lg: "0px 70px", 
              },

              backgroundColor: mode === "light" ? "#f5f6fa" : "#171717",
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <img src="/src/assets/logo2.png" height={60} width={60} />
                <Typography variant="h6">PFA HUB</Typography>
              </Box>
              <Box style={{ display: "flex",alignItems:"center" }}>
                {token === null && (
                  <>
                    <Button color="inherit" sx={{ marginRight: "10px" }} href="/auth/register">
                      Login
                    </Button>
                    <Button color="inherit" variant="outlined" href="/auth/register">
                      Sign up
                    </Button>
                  </>
                )}
                <Avatar
                  alt="Profile"
                  src={profileImage !== "" && profileImage}
                  sx={{ width: 35, height: 35 ,marginLeft:"10px"}}
                />
              </Box>
            </Toolbar>
          </Box>
        </Box>
      )}
      <Outlet />
      <div
        style={{
          backgroundColor: mode === "light" ? "#f5f6fa" : "#121212",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        }}
      >
        {shouldShowFooter && <Footer />}
      </div>
    </Box>
  );
}

export default GeneralLayout