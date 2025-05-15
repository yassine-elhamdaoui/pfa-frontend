/* eslint-disable react-hooks/exhaustive-deps */
import { AddCircleOutline, Edit } from "@mui/icons-material";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import CloseIcon from "@mui/icons-material/Close";
import AddFolderDialog from "../../components/dialogs/AddFolderDialog";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/navBar/navBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { addComment, downloadFile } from "../../services/documentService";
import { getTeamById } from "../../services/teamService";
import { downLoadProfileImage, getUserById } from "../../services/userService";
import { stringAvatar } from "../../utils/generalUtils";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import UploadedFilesDialog from "../../components/dialogs/UploadedFilesDialog";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import { deleteFiles, deleteFolder } from "../../services/folderService";
import EditFolderDialog from "../../components/dialogs/EditFolderDialog";
import { useTheme } from "@mui/material/styles";
import DocsSkeleton from "./DocsSkeleton";
import { useSearchParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { forEach } from "lodash";

function Docs() {
  const theme = useTheme();
  const [params] = useSearchParams()
  const projectId = params.get("projectId");
  const mode = localStorage.getItem("mode");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [isMessagesContainerVisible, setIsMessagesContainerVisible] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleMoreMenuClick = (event, folder) => {
    event.preventDefault();
    console.log(folder);
    setAnchorEl(event.currentTarget);
  };

  const [authorsImages, setAuthorsImages] = useState([]);
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  const [loading , setLoading] = useState(false);


  // State to manage the window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmationOpenDialog, setConfirmationOpenDialog] = useState(false);
  const [isFolderDeletion , setIsFolderDeletion] = useState(false)
  const handleConfirmationDone = async () => {
    const response = await deleteFolder(
      token,
      openedFolder.id,
      setSnackbarOpen,
      setSnackbarMessage
    );
    const newFolders = folders.filter(
      (folder) => folder.id !== openedFolder.id
    );
    setFolders(newFolders);
    console.log(openedFolder.id + " is deleted");
    setConfirmLoading(false);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleSelectedFiles = (files) => {
    console.log(files);
    setSelectedFiles(files);
  };
  const handleDeleteFiles = async () => {
    const response = await deleteFiles(
      token,
      openedFolder.id,
      selectedFiles,
      setSnackbarOpen,
      setSnackbarMessage
    );
    const newFiles = activeFiles.filter(
      (file) => !selectedFiles.includes(file.id)
    );
    setActiveFiles(newFiles);
    setSelectedFiles([]);
    setConfirmLoading(false);
    setRender((prev) => !prev);
  };
  const initialRender = useRef(true);
  const [render, setRender] = useState(false);

  const [team, setTeam] = useState({});
  const [project, setProject] = useState({});
  const [user, setUser] = useState({});
  const [openedFolder, setOpenedFolder] = useState({});
  const [openedFile, setOpenedFile] = useState({});
  const [activeFiles, setActiveFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [message, setMessage] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openFilesDialog, setOpenFilesDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const containerRef = useRef(null);

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleEditClose = () => {
    setOpenEditDialog(false);
  };
  const handleFilesDialogClose = () => {
    setOpenFilesDialog(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log(initialRender.current);
      if (initialRender.current) {
        setLoading(true);
      }
      try {
          const fetchedUser = await getUserById(userId, token);
          setUser(fetchedUser);
          console.log(fetchedUser);
          if (
            fetchedUser.authorities.find(
              (auth) => auth.authority === "ROLE_SUPERVISOR"
            ) !== undefined
          ) {
            const fetchedProject = await getProjectById(projectId, token);
            setProject(fetchedProject);
            console.log(fetchedProject);
            setFolders(fetchedProject.folders);
            handleFolderClicked(
              fetchedProject.folders.find(
                (folder) => folder.id === openedFolder.id
              )
            )();    
          }else{
            console.log("here");
            const fetchedTeam = await getTeamById(fetchedUser.teamId, token);
            setTeam(fetchedTeam);
            forEach(fetchedTeam.members, async (member) => {
              console.log(member.firstName);
              const url = await downLoadProfileImage(member.id, token);
              console.log(member.firstName);
              setAuthorsImages((prev) => [
                ...prev,
                {
                  id: member.id,
                  name: member.firstName + " " + member.lastName,
                  url: url,
                },
              ]);
            });
            forEach(fetchedTeam.project.supervisorIds, async (supervisor) => {
              console.log(supervisor);
              const url = await downLoadProfileImage(supervisor, token);
              setAuthorsImages((prev) => [
                ...prev,
                {
                  id: supervisor,
                  name: "",
                  url: url,
                },
              ]);
            });

            setFolders(fetchedTeam.project.folders);
            setProject(fetchedTeam.project);
            console.log(fetchedTeam.project);
            console.log(
              fetchedTeam.project.folders
              .find((folder) => folder.id === openedFolder.id)
              .documents.find((doc) => doc.id === openedFile.id)
            );
            handleFolderClicked(
              fetchedTeam.project.folders.find(
                (folder) => folder.id === openedFolder.id
              )
            )();     
          }
          setLoading(false)
      } catch (error) {
        console.log(error);
      } finally {
        if (!initialRender.current) {
          setLoading(false);
        }
      }
    };
    fetchData();
    initialRender.current = false; 
  }, [render,projectId]);

  const handleFolderClicked = (folder) => () => {
    setOpenedFolder(folder);
    setActiveFiles(folder.documents);
    setSelectedFiles([]);
  };
  const handleAddFilesClicked = () => {
    setOpenFilesDialog(true);
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(files);

    // Optional: Convert FileList to Array and log each file
    Array.from(files).forEach((file) => {
      console.log(file.name);
    });
  };
  const handleAddFolderClicked = () => {
    setOpenDialog(true);
  };
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const handleSendClicked = async () => {
    const response = await addComment(openedFile.id, message, token);
    console.log(response);
    setMessage("");
    setOpenedFile((prev) => ({
      ...prev,
      comments: prev.comments ? [...prev.comments, response] : [response],
    }));
    setRender((prev) => !prev);
  };
  return loading ? (
    <DocsSkeleton />
  ) : (team && Object.keys(team).length > 0) ||
    (user &&
      Object.keys(user).length > 0 &&
      user.authorities.find((auth) => auth.authority === "ROLE_SUPERVISOR") !==
        undefined) ? (
    (console.log(team),
    project && Object.keys(project).length > 0 ? (
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: windowWidth < 900 ? "calc(100% + 10px)" : "65%",
            minHeight: "calc(100svh - 100px)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "0 10px 0 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: "-17px",
            }}
          >
            <BreadCrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Dashboard", href: "/" },
                { label: "Docs", href: "/docs" },
              ]}
            />
            {/* <Search
                sx={{
                  backgroundColor: mode === "dark" ? "#444" : "#33333320",
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search> */}
          </Box>
          <BreadCrumb items={[{ label: "Folders" }]} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "5px", // Adjust the height of the scrollbar
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent", // Make the scrollbar track transparent
              },
              "&::-webkit-scrollbar-thumb": {
                background:
                  mode == "light"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.3)", // Adjust the transparency of the scrollbar thumb
                borderRadius: "10px", // Adjust the border radius of the scrollbar thumb
              },
            }}
          >
            {folders && folders.length > 0 ? (
              folders.map((folder) => (
                <div
                  key={folder.id}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    minWidth: "200px",
                    cursor: "pointer",
                    height: "130px",
                    backgroundColor:
                      mode === "dark" ? "#44444450" : "#33333320",
                  }}
                  onClick={handleFolderClicked(folder)}
                >
                  <div
                    style={{
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {openedFolder && openedFolder.id === folder.id ? (
                      <img src="/src/assets/folder-open.png" height={45} />
                    ) : (
                      <FolderIcon
                        sx={{ fontSize: "50px", color: "lightblue" }}
                      />
                    )}
                    {folder.name !== "Documents" &&
                      folder.name !== "Report" && (
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(event) =>
                            handleMoreMenuClick(event, folder)
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                  </div>
                  <Typography variant="h6">{folder.name}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {folder.documents && folder.documents.length} Files .{" "}
                    {(folder.size / 1024).toFixed(2)}KB
                  </Typography>
                </div>
              ))
            ) : (
              <>no folders</>
            )}
            <div
              style={{
                padding: "10px",
                borderRadius: "10px",
                minWidth: "200px",
                height: "130px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "center",
                border: `1px dashed ${
                  mode === "dark" ? "#ffffff60" : "#00000060"
                }`,
              }}
              onClick={handleAddFolderClicked}
            >
              <CreateNewFolderIcon
                sx={{ fontSize: "70px", color: "lightblue" }}
              />
              <Typography variant="body1" color="textSecondary">
                Add Folder
              </Typography>
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BreadCrumb items={[{ label: "All Files" }]} />
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {selectedFiles.length > 0 && (
                <Tooltip title="delete">
                  <IconButton onClick={setConfirmationOpenDialog}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="add files">
                <IconButton onClick={handleAddFilesClicked}>
                  <AddCircleOutline sx={{ fontSize: "30px" }} />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <DataGrid
              columns={[
                {
                  field: "docName",
                  headerName: "Name",
                  width: 200,
                  valueGetter: (params) =>
                    params.row.docName.split(".")[0].slice(0, -37),
                },
                {
                  field: "uploadDate",
                  headerName: "Date",
                  width: 100,
                  valueGetter: (params) =>
                    new Date(params.row.uploadDate).toLocaleDateString() +
                    " " +
                    new Date(params.row.uploadDate).toLocaleTimeString(),
                },
                {
                  field: "fileSize",
                  headerName: "size",
                  width: 100,
                  valueGetter: (params) =>
                    (params.row.fileSize / 1024).toFixed(2) + "KB",
                },
                { field: "uploader", headerName: "uploaded by", width: 200 },
              ]}
              onRowClick={(row) => (
                setOpenedFile(row.row), setIsMessagesContainerVisible(true)
              )}
              onRowSelectionModelChange={handleSelectedFiles}
              rows={activeFiles}
              sx={{
                width: "100%",
                "& .MuiDataGrid-footerContainer.MuiDataGrid-withBorderColor.css-wop1k0-MuiDataGrid-footerContainer":
                  { display: "none" },
                "& .report-row": {
                  backgroundColor: "rgba(255, 204, 153, 0.1)",
                  fontWeight: "bold",
                },
              }}
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              disableSelectionOnClick
              // disableColumnMenu
            />
          </Box>
        </Box>
        <Box
          sx={{
            position: windowWidth < 900 ? "absolute" : "relative",
            width: windowWidth < 900 ? "100%" : "35%",
            right:
              windowWidth < 900
                ? isMessagesContainerVisible
                  ? "0"
                  : "-100%"
                : "0",
            top: windowWidth < 900 ? "50px" : "0",
            backgroundColor:
              mode === "dark"
                ? windowWidth < 900
                  ? "#121212"
                  : "#44444450"
                : windowWidth < 900
                ? "#fff"
                : "#33333320",
            borderRadius: "10px",
            padding: "10px",
            display:
              windowWidth < 900
                ? !isMessagesContainerVisible
                  ? "none"
                  : "flex"
                : "flex",
            flexDirection: "column",
            gap: "10px",

            minHeight:
              windowWidth < 900
                ? "calc(100svh - 50px)"
                : "calc(100svh - 100px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BreadCrumb items={[{ label: "File" }]} />
            {windowWidth < 900 && (
              <IconButton onClick={() => setIsMessagesContainerVisible(false)}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
          {openedFile && Object.keys(openedFile).length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${
                    mode === "dark"
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)"
                  }`,
                  borderRadius: "5px",
                  padding: "5px",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  {openedFile.docName.split(".")[0].slice(0, -37)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" color="textSecondary">
                    {(openedFile.fileSize / 1024).toFixed(2)}KB
                  </Typography>
                  <Tooltip title="download">
                    <IconButton
                      onClick={() => {
                        downloadFile(
                          openedFile.projectId,
                          openedFile.id,
                          openedFile.docName,
                          token
                        );
                      }}
                    >
                      <ArrowCircleDownRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <BreadCrumb items={[{ label: "Conversation" }]} />
              <Box
                ref={containerRef}
                sx={{
                  minHeight:
                    windowWidth < 900
                      ? "calc(100svh - 290px)"
                      : "calc(83svh - 200px)",
                  height: "calc(83svh - 200px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "5px", // Adjust the width of the scrollbar
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent", // Make the scrollbar track transparent
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background:
                      mode === "light"
                        ? "rgba(0, 0, 0, 0.3)"
                        : "rgba(255, 255, 255, 0.3)", // Adjust the transparency of the scrollbar thumb
                    borderRadius: "10px", // Adjust the border radius of the scrollbar thumb
                  },
                }}
              >
                {openedFile.comments && openedFile.comments.length > 0 ? (
                  openedFile.comments.map((comment, index) => (
                    <Box
                      key={comment.id}
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        gap: "5px",
                        width:
                          comment.authorId === parseInt(userId)
                            ? "100%"
                            : "90%",
                        flexFlow:
                          comment.authorId === parseInt(userId)
                            ? "row-reverse"
                            : "row",
                      }}
                    >
                      {comment.authorId !== parseInt(userId) && (
                        <Avatar
                          src={
                            authorsImages.find(
                              (author) => author.id === comment.authorId
                            )?.url
                          }
                          sx={{ width: "35px", height: "35px" }}
                        />
                      )}
                      <Box
                        sx={{
                          backgroundColor: "#80008070",
                          padding: "5px",
                          maxWidth:
                            comment.authorId === parseInt(userId)
                              ? "calc(90% - 9px)"
                              : "fit-content",
                          borderRadius:
                            comment.authorId === parseInt(userId)
                              ? "15px 3px 15px 15px"
                              : "3px 15px 15px 15px",
                        }}
                      >
                        <Typography variant="body2">{comment.text}</Typography>
                        <p
                          style={{
                            textAlign: "end",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "10px",
                          }}
                        >
                          {new Date(comment.date).toLocaleTimeString()}
                        </p>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "calc(100% - 70px)",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/src/assets/conversation.png"
                      height={100}
                      width={100}
                      alt=""
                    />
                    <Typography
                      variant="body1"
                      textAlign="center"
                      color="textSecondary"
                    >
                      Start a conversation
                    </Typography>
                  </div>
                )}
              </Box>
              <IconButton
                onClick={handleScrollToBottom}
                sx={{
                  width: "30px",
                  height: "30px",
                  position: "absolute",
                  bottom: 70,
                  right: 10,
                  backdropFilter: "blur(10px)",
                  backgroundColor: mode === "dark" ? "#44444450" : "#33333320",
                }}
              >
                <KeyboardDoubleArrowDownRoundedIcon />
              </IconButton>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    placeholder="Type your message"
                    variant="outlined"
                    fullWidth
                    value={message}
                    sx={{ borderRadius: "50px" }}
                    onChange={handleMessageChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={handleSendClicked}>
                    <SendRoundedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "calc(100% - 100px)",
                justifyContent: "center",
              }}
            >
              <img
                src="/src/assets/selected_file.png"
                height={120}
                width={120}
                alt=""
              />
              <Typography
                variant="body1"
                textAlign="center"
                color="textSecondary"
              >
                select a file
              </Typography>
            </div>
          )}
        </Box>
        <AddFolderDialog
          openDialog={openDialog}
          handleClose={handleClose}
          project={project}
          setFolders={setFolders}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
        <UploadedFilesDialog
          openFilesDialog={openFilesDialog}
          folder={openedFolder}
          setActiveFiles={setActiveFiles}
          setRender={setRender}
          handleFilesDialogClose={handleFilesDialogClose}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
        <ConfirmationDialog
          message={
            isFolderDeletion
              ? "Are you sure you want to delete this folder?"
              : "Are you sure you want to delete these files?"
          }
          openDialog={confirmationOpenDialog}
          setOpenDialog={setConfirmationOpenDialog}
          handleConfirmClick={
            isFolderDeletion ? handleConfirmationDone : handleDeleteFiles
          }
          setLoading={setConfirmLoading}
          loading={confirmLoading}
        />
        <EditFolderDialog
          openEditDialog={openEditDialog}
          handleEditClose={handleEditClose}
          folder={openedFolder}
          setFolders={setFolders}
          folders={folders}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMoreMenuClose}
        >
          <MenuItem
            onClick={() => {
              setOpenEditDialog(true);
              handleMoreMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setConfirmationOpenDialog(true);
              setIsFolderDeletion(true);
              handleMoreMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={
              snackbarMessage && snackbarMessage.includes("success")
                ? "success"
                : "error"
            }
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    ) : (
      <>
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/" },
            { label: "Docs", href: "/docs" },
          ]}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "60px",
            alignItems: "center",
          }}
        >
          <img src="/src/assets/no-project.png" height={200} width={200} />
          <Typography variant="h5" color="textSecondary" textAlign="center">
            No project found
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            {Object.keys(user).length > 0 &&
            user.authorities.find(
              (auth) => auth.authority === "ROLE_SUPERVISOR"
            ) !== undefined
              ? "This team still don't have a project assigned to it"
              : "Wait until you're assigned to a project"}
          </Typography>
        </div>
      </>
    ))
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "100px",
        alignItems: "center",
      }}
    >
      <img src="/src/assets/team.png" height={200} width={200} />
      <Typography variant="h5" color="textSecondary" textAlign="center">
        {Object.keys(user).length > 0 &&
        user.authorities.find(
          (auth) => auth.authority === "ROLE_SUPERVISOR"
        ) !== undefined
          ? "No team found for this project"
          : "You are not in a team"}
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        {Object.keys(user).length > 0 &&
        user.authorities.find(
          (auth) => auth.authority === "ROLE_SUPERVISOR"
        ) !== undefined
          ? "Wait until the a team is assigned to this project"
          : "Still have no team ,create one or wait till you're added to one"}
      </Typography>
    </div>
  );
}

export default Docs;
