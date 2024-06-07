/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { uploadFiles } from "../../services/folderService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { VisuallyHiddenInput } from "./createProjectDialog";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function UploadedFilesDialog({
  openFilesDialog,
  handleFilesDialogClose,
  folder,
  setRender,
  setActiveFiles,
  setSnackbarOpen,
  setSnackbarMessage,
}) {
  const token = localStorage.getItem("token");
  const mode = localStorage.getItem("mode");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData,setFormData] = useState({
    files:[]
  });

  const handleFilesChange = (event) => {
    const files = event.target.files;
    const uploadedFilesList = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setUploadedFiles(uploadedFilesList);
    setFormData((prev) => ({    
        ...prev,
        files: Array.from(files).slice(0, 10) 
    }));
  };
  const handleRemoveFileFromFiles = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
        setFormData((prevFormData) => ({
          ...prevFormData,
          files: prevFormData.files.filter((_, i) => i !== index),
        }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    formData.files.forEach((file) =>{
        console.log(file),
         data.append("files", file)});
    console.log(formData);
    console.log(data);

    const response = await uploadFiles(
      token,
      folder.id,
      data,
      setSnackbarOpen,
      setSnackbarMessage
    );
    
    setActiveFiles((prevFiles) => [...prevFiles, ...response]);
    setRender((prev) => !prev);
    console.log(response);
    handleFilesDialogClose();
  };
  return (
    <Dialog
      open={openFilesDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleFilesDialogClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit, // Appeler la fonction handleSubmit lors de la soumission du formulaire
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Upload Files</Typography>
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={handleFilesDialogClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div
              style={{
                border: `1px solid ${
                  mode === "dark" ? "#d3d3d350" : "rgba(0,0,0,0.3)"
                }`,
                width: "100%",
                minWidth:"300px",
              }}
            >
              <Button
                component="label"
                role={undefined}
                variant="text"
                sx={{
                  color: mode === "dark" ? "lightgray" : "rgba(0,0,0,0.6)",
                  width: "100%",
                }}
                tabIndex={-1}
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                Upload Files
                <VisuallyHiddenInput
                  type="file"
                  name="files"
                  id="files"
                  multiple
                  onChange={handleFilesChange}
                />
              </Button>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5px",
                    width: "100%",
                    minHeight: "60px",
                    borderTop: `1px solid ${
                      mode === "dark" ? "#d3d3d350" : "rgba(0,0,0,0.3)"
                    }`,
                    padding: "10px",
                  }}
                >
                  <div>
                    <Typography sx={{ fontSize: "13px" }} key={index}>
                      {file.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "11px", marginTop: "3px" }}
                      color="textSecondary"
                      key={index}
                    >
                      {(file.size * 0.000001).toFixed(2)} MB
                    </Typography>
                  </div>
                  <DeleteOutlineIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRemoveFileFromFiles(index)}
                  />
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="outlined" color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadedFilesDialog;
