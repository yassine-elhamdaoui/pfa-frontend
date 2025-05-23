import { Outlet } from "react-router-dom";
import NavBar from "../components/navBar/NavBar";
import Footer from "../components/footer/Footer";
import SideBar from "../components/sideBar/SideBar";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const MainLayout = ({ mode, setMode }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/auth/authenticate");
      return;
    }
  }, [navigate]);
  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 900) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="app" style={{ height: "100%", minHeight: "100svh" }}>
      <NavBar handleDrawerOpen={handleDrawerOpen} setMode={setMode} />
      <Box
        sx={{

          // backgroundColor: mode === "light" ? "#f5f6fa" : "#121212",
          marginLeft: window.innerWidth <= 900 ? 0 : open ? "230px" : "0px",
          transition: "margin-left 0.2s ease",
        }}
      >
        <Box
          className="container"
          sx={{
            height: "100%",
            minHeight: "100svh",
            padding: { xs: "80px 10px 10px 10px", md: "80px 20px 20px 20px" },
          }}
        >
          <Outlet />
        </Box>
        <div
          style={{
            backgroundColor: mode === "light" ? "#f5f6fa" : "#121212",
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
          }}
        >
          <Footer />
        </div>
      </Box>
      <SideBar open={open} mode={mode} handleDrawerClose={handleDrawerClose} />
    </div>
  );
};

export default MainLayout;
