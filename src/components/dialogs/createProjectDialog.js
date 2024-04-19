import { Dialog, DialogContent, Grid } from "@mui/material";
import { styled } from "@mui/system";

export const StyledDialog = styled(Dialog)(() => ({
  "& .css-1qxadfk-MuiPaper-root-MuiDialog-paper": {
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "20px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
  },
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
              display: "flex",
          flexDirection: "column",
          gap: "20px",
          height: "100svh",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        
    }));


export const StyledGrid = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  alignItems: "center",
  flexWrap: "wrap",
}));

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
