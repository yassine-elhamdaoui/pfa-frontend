import { styled } from "@mui/system";
import { Drawer, ListItemButton } from "@mui/material";
const drawerWidth = 230;
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    marginTop: "64px",
    maxHeight: "calc(100svh - 64px)",

    backgroundColor: localStorage.getItem("mode") === "light" ? "#f5f6fa" : "#121212",
    padding: "5px",
    zIndex: 1000,
    width: drawerWidth,
  },
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
