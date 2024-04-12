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
    <div className="app" style={{ height: "100%" }}>
      <NavBar handleDrawerOpen={handleDrawerOpen} setMode={setMode} />
      <Box
        className="container"
        sx={{
          height: "100%",
          padding: { xs: "64px 10px 10px 10px", md: "64px 20px 20px 20px" },
          marginLeft: open ? "240px" : "0px",
          transition: "margin-left 0.2s ease",
        }}
      >
        <Outlet />
      </Box>
      <SideBar open={open} mode={mode} handleDrawerClose={handleDrawerClose} />
      <Footer />
    </div>
  );
};

export default MainLayout;
