import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import Footer from "../components/footer/Footer";
function GeneralLayout({ mode, setMode }) {
    const location = useLocation();

    const shouldShowFooter = location.pathname === "/";
  return (
    <div className="app" style={{ height: "100%", minHeight: "100svh" }}>
      {shouldShowFooter && (
        <div>
          <Box position="static" sx={{ bgcolor: "#f5f6fa" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/src/assets/logo2.png" height={60} width={60} />
                <Typography variant="h6">PFA HUB</Typography>
              </div>
              <div style={{ display: "flex" }}>
                <Button color="inherit">About</Button>
                <Button color="inherit">Contact</Button>
                <Button color="inherit">Login</Button>
                <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
              </div>
            </Toolbar>
          </Box>
        </div>
      )}
      <Outlet />
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default GeneralLayout