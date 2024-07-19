/* eslint-disable react-hooks/exhaustive-deps */
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArticleIcon from "@mui/icons-material/Article";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Reorder } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import CreateModifyStoryDialog from "../../components/dialogs/CreateModifyStoryDialog";
import CreateSprintDialog from "../../components/dialogs/CreateSprintDialog";
import CreateStoryDialog from "../../components/dialogs/CreateStoryDialog";
import ModifySprint from "../../components/dialogs/ModifySprint";
import {
  AffecteToSprint,
  Affectedevelop,
  DeleteSprint,
  DeleteStory,
  closesprint,
  getBacklog,
  getSprints,
  removefromsprint,
  startSprint,
} from "../../services/backLogService";
import { getProjectById } from "../../services/projectService";
import { getTeamById } from "../../services/teamService";
import { stringAvatar } from "../../utils/generalUtils";
import { hasRole } from "../../utils/userUtiles";
import "ldrs/hourglass";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { forEach, set } from "lodash";
import { downLoadProfileImage, getUserById } from "../../services/userService";
import { useSearchParams } from "react-router-dom";

function BackLog() {
    const [params] = useSearchParams();
    const projectId = params.get("projectId");
  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis egetsit amet blandit leo lobortis egetsit amet blandit leo lobortis eget.";
  const isRespo = hasRole("ROLE_RESPONSIBLE");
  const isSupervisor = hasRole("ROLE_SUPERVISOR");
  const isStudent = hasRole("ROLE_STUDENT");
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("md"));
  const isbigScreen = useMediaQuery(useTheme().breakpoints.down("lg"));
  const mode = localStorage.getItem("mode");
  const initialItems = [
    {
      id: 1,
      name: "User 1",
      description: description,
      Status: "Done",
      priority: 12,
      nameDev: "Developer1 de",
    },
    {
      id: 2,
      name: "User 2",
      description: description,
      Status: "To Do",
      priority: 5,
      nameDev: "Developer1 de",
    },
    {
      id: 3,
      name: "User 3",
      description: description,
      Status: "In Progress",
      priority: 8,
      nameDev: "Developer1 ed",
    },
    {
      id: 4,
      name: "User 4",
      description: description,
      Status: "Done",
      priority: 10,
      nameDev: "Developer1 ed",
    },
  ];

  const [items, setItems] = useState(initialItems);
  const [item2, setItem2] = useState(initialItems);

  const [anchorEl, setAnchorEl] = useState({});

  const [backlogShow, setbacklogShow] = useState(false);
  const [SprintShow, setSprintShow] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [backlogData, setBacklogData] = useState({});
  const [SprintData, setSprintData] = useState([]);
  const [Membres, setMembres] = useState([]);
  const [user,setUser] = useState();
  const userId = localStorage.getItem("userId");
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false);
  const [snackbarDeleteMessage, setsnackbarDeleteMessage] = useState("");
  const [backlogID, setBacklogID] = useState();
  const [projectID, setprojectID] = useState();
  const [team, setTeam] = useState({});
  const [project, setProject] = useState({});
  const [loading, setloading] = useState();

  const [anchorElArray, setAnchorElArray] = useState(
    // new Array(Membres.length).fill(null)
    []
  );
  const [reorder, setReorder] = useState(false);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const monthNames = [
      "janv",
      "fév",
      "mars",
      "avr",
      "mai",
      "juin",
      "juil",
      "août",
      "sept",
      "oct",
      "nov",
      "déc",
    ];
    const formattedDate = dayOfMonth + " " + monthNames[month];

    return formattedDate;
  }

  //////////Menu 1////////////////////////
  const handleFilterClick = (event, itemId) => {
    setAnchorEl({ ...anchorEl, [itemId]: event.currentTarget });
  };
  const handleClose = (itemId) => {
    setAnchorEl({ ...anchorEl, [itemId]: null });
  };
  const handleMenuItemClick = async (Devid, itemId) => {
    try {
      const resp = await Affectedevelop(itemId, Devid, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage(
        "Error Affecting dev to user. Please try again."
      );
    }

    handleClose(itemId);
  };
  /////////////Menu 2////////////////////////
  const [anchorE2, setAnchorE2] = useState({});
  const [render , setRender] = useState(false);
  const initialRender = useRef(true);
  const [membersImages ,setMembersImages] = useState([]);

  const handleClick2 = (event, storyid) => {
    setAnchorE2({ ...anchorE2, [storyid]: event.currentTarget });
  };
  const handleClose2 = (storyid) => {
    // const selectedStatus = Status.find(item => item.label === event.target.innerText);

    setAnchorE2({ ...anchorE2, [storyid]: null });
  };
  //////////////////////////////////
  useEffect(() => {
    const fetchteam = async () => {
      try {
        console.log(initialRender.current);
        if (initialRender.current) {
          setloading(true);
        }
        const fetchedUser = await getUserById(userId, token);
        setUser(fetchedUser);
        if (
          fetchedUser.authorities.find(
            (auth) => auth.authority === "ROLE_STUDENT"
          ) !== undefined
        ) {
          const teaminfo = await getTeamById(fetchedUser.teamId, token);
          setTeam(teaminfo);
          setProject(teaminfo.project);
          forEach(teaminfo.members, async (member) => {
            const url = await downLoadProfileImage(member.id, token);
            setMembersImages((prev) => [
              ...prev,
              {
                id: member.id,
                name: "",
                url: url,
              },
            ]);
          });

          console.log(teaminfo);
          setprojectID(teaminfo.project.id);
          setMembres(teaminfo.members);
          const Backloginfo = await getBacklog(teaminfo.project.backlog, token);
          console.log(Backloginfo);
          setBacklogData(Backloginfo);
          setBacklogID(Backloginfo.id);
          if (Backloginfo.userStories[0] == null) {
            setbacklogShow(false);
          } else {
            setbacklogShow(true);
          }

          // const sprintinfo = await getSprint(teaminfo.projectId,token );
          // console.log(sprintinfo);
          setSprintData(await getSprints(teaminfo.project.id, token));
        } else {
          const project = await getProjectById(projectId, token);
          const teaminfo = await getTeamById(project.teamId, token);
          forEach(teaminfo.members, async (member) => {
            const url = await downLoadProfileImage(member.id, token);
            setMembersImages((prev) => [
              ...prev,
              {
                id: member.id,
                name: "",
                url: url,
              },
            ]);
          });
          setMembres(teaminfo.members);
          console.log(project);
          setprojectID(projectId);
          const fetchedBacklogData = await getBacklog(project.backlog, token);
          
          setBacklogData(fetchedBacklogData);
          setBacklogID(project.backlog);
          if (backlogData &&  Object.keys(backlogData).length > 0 && backlogData.userStories[0] == null) {
            setbacklogShow(false);
          } else {
            setbacklogShow(true);
          }
          setSprintData(await getSprints(projectId, token));
        }

        setloading(false);
      } catch (error) {
        console.error("Error fetching Team", error);
      } finally {
        if (!initialRender.current) {
          setloading(false);
        }
      }
    };

    fetchteam();
    initialRender.current = false;
  }, [render,projectId]);

  //////////////////////////////////////////HandleSprintDialog/////////////////////////
  const [SprintAmodify, setSprintAmodify] = useState(null);
  const [Modifysprintopen, setModifysprintopen] = useState(null);
  const [SprintDialogOpen, setSprintDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setSprintDialogOpen(true);
  };
  const handleModalClose = () => {
    setSprintDialogOpen(false);
  };
  //////////////////////////////////////////////HandleStoryDialog///////////////////////////////
  const [StoryDialogOpen, setStoryDialogOpen] = useState(false);
  const [StoryModifyDialogOpen, setStoryModifyDialogOpen] = useState(false);

  const handleClickOpenStory = () => {
    setStoryDialogOpen(true);
  };
  const handleModalCloseStory = () => {
    setStoryDialogOpen(false);
    setStoryModifyDialogOpen(false);
    setStoryAmodify(false);
    setModifysprintopen(false);
  };
  ///////////////////////////////////handle CreateBacklog///////////////////////////////
  const handleDeleteConfirmation = async (id) => {
    try {
      const resp = await DeleteStory(id, token);
      setsnackbarDeleteMessage("Story deleted successfully.");
      setSnackbarDeleteOpen(true);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage("Error deleting story. Please try again.");
      setSnackbarDeleteOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setReorder((prev) => !prev);
      setRender((prev) => !prev);

    }
  };
  const handleSnackbarDeleteClose = () => {
    setSnackbarDeleteOpen(false);
  };
  const [StoryAmodify, setStoryAmodify] = useState(null);

  const handleModifyStory = (story) => {
    setStoryAmodify(story);
    setStoryModifyDialogOpen(true);
  };

  const handleModifySprint = (sprint) => {
    setSprintAmodify(sprint);
    setModifysprintopen(true);
  };
  const [StoryIdDelete, setStoryIdDelete] = useState();
  const Deletestory = (id) => {
    setStoryIdDelete(id);
    setDeleteDialogOpen(true);
  };
  console.log(SprintData);

  const handleaffectTosprint = async (id, sprintid) => {
    try {
      const resp = await AffecteToSprint(id, sprintid, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage("Error Affecting to Sprint. Please try again.");
    } finally {
      handleClose2(id);

    }
  };

  // Handle close for closing menu

  const handleremovefromSprint = async (id) => {
    try {
      const resp = await removefromsprint(id, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage(
        "Error Affecting dev to user. Please try again."
      );
    }
  };
  const Endsprint = async (sprintid) => {
    try {
      const respo = await closesprint(sprintid, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage("Error close  Sprint. Please try again.");
    }
  };
  const startsprint = async (sprintid) => {
    if (SprintData.filter((sprint) => sprint.started === true && sprint.closed === false).length > 0) {
      setsnackbarDeleteMessage("Error start  Sprint. Please try again.");
      setSnackbarDeleteOpen(true);
      return;
    }
    try {
      const respo = await startSprint(sprintid, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage("Error close  Sprint. Please try again.");
    }
  };
  const [massege, setmessage] = useState("");
  const [loadingDialogue, setloadingDialogue] = useState(false);
  const [openDeleteDialogue, setopenDeleteDialogue] = useState(false);
  const [idSprintDelete, setidSprintDelete] = useState(null);
  const Delete = (id) => {
    setmessage("Are you sure you want to delete this Sprint ?");
    setidSprintDelete(id);
    setopenDeleteDialogue(true);
  };
  const removeSprint = async (sprintid) => {
    try {
      const respo = await DeleteSprint(sprintid, token);
      setRender((prev) => !prev);
    } catch (error) {
      console.error("Error ", error);
      setsnackbarDeleteMessage("Error Delete  Sprint. Please try again.");
    } finally {
      setloadingDialogue(false);
    }
  };
  // Check if a specific menu is open
  const isOpen = (index) => {
    return Boolean(anchorElArray[index]);
  };
  const Priorityicon = (priority) => {
    if (priority > 0 && priority < 5) {
      return <KeyboardDoubleArrowDownIcon sx={{ color: "green" }} />;
    } else if (priority >= 5 && priority < 10) {
      return <KeyboardDoubleArrowDownIcon sx={{ color: "green" }} />;
    } else if (priority >= 10 && priority < 15) {
      return <DensityMediumIcon sx={{ color: "orange" }} />;
    } else if (priority >= 10 ) {
      return <KeyboardDoubleArrowUpIcon sx={{ color: "red" }} />;
    }
  };
  const Statuticon = (status) => {
    if (status == "ToDo") {
      return <ArticleIcon sx={{ color: "rgb(241,192,119)" }} />;
    } else if (status == "In Progress") {
      return <AutoModeIcon sx={{ color: "rgb(119,205,241)" }} />;
    } else if (status == "Done") {
      return <CheckCircleOutlineIcon sx={{ color: "green" }} />;
    }
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/" },
            { label: "Backlog", href: "/backlog" },
          ]}
        />
        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:"3px"
        }}>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
        </div>
        <div style={{
          display:"flex",
          width:"100%",
          justifyContent:"end",
        }}>
          <Skeleton variant="rectangular" width="170px" height={40} sx={{borderRadius:"5px"}}/>
        </div>
        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:"3px",
          borderRadius: "10px",
          border: "dashed gray",
          padding: "40px 20px",
        }}>

          <Skeleton variant="rectangular" width="200px" height={40} sx={{borderRadius:"5px",marginBottom:"20px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>
          <Skeleton variant="rectangular" width="100%" height={65} sx={{borderRadius:"5px"}}/>

        </div>

      </Box>
    );
  } else{
    return (team && Object.keys(team).length > 0) ||
      (user &&
        Object.keys(user).length > 0 &&
        user.authorities.find(
          (auth) => auth.authority === "ROLE_SUPERVISOR"
        ) !== undefined) ? (
      (project && Object.keys(project).length > 0) ||
      (user &&
        Object.keys(user).length > 0 &&
        user.authorities.find((auth) => auth.authority === "ROLE_SUPERVISOR") !==
          undefined) ? (
        <>
          <Box>
            <BreadCrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Dashboard", href: "/" },
                { label: "Backlog", href: "/backlog" },
              ]}
            />
            <Box
              sx={{
                overflow: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
              }}
              my={4}
              // display="flex"
              // alignItems="center"
              gap={4}
            >
              {SprintData.length === 0 && (
                <Alert
                  severity="info"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <AlertTitle>No Sprints Created Yet</AlertTitle>
                  <Typography variant="body2">
                    It looks like you haven't created any sprints yet. Click the
                    button below to create your first sprint.
                  </Typography>
                </Alert>
              )}
              {SprintData.map((sprint) => (
                <Accordion
                  key={sprint.id}
                  elevation={0}
                  sx={{
                    minWidth: 800,
                    marginBottom: 0.5,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255 , .07)"
                        : "rgba(0, 0, 0,.07)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 900, marginRight: 5 }}>
                          {sprint.name}
                        </Typography>
                        <Typography style={{ marginRight: 20 }}>
                          ({sprint.userStories.length})
                        </Typography>
                        <Typography style={{ marginRight: 20 }}>
                          {formatDate(sprint.starDate)} -{" "}
                          {formatDate(sprint.endDate)}{" "}
                        </Typography>

                        <Typography>
                          {sprint.description.substring(0, 80)}
                          {sprint.description.length > 80 && "..."}
                        </Typography>
                      </div>
                      {isStudent && (
                        <div>
                          {!sprint.closed && !sprint.started && (
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => startsprint(sprint.id)}
                            >
                              Start Sprint
                            </Button>
                          )}
                          {sprint.started && sprint.closed && (
                            <Button disabled>Sprint Closed</Button>
                          )}
                          {sprint.started && !sprint.closed && (
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => Endsprint(sprint.id)}
                            >
                              End Sprint
                            </Button>
                          )}
                          <Tooltip title="Modify">
                            {" "}
                            <IconButton
                              onClick={() => handleModifySprint(sprint)}
                            >
                              <EditIcon />{" "}
                            </IconButton>{" "}
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton onClick={() => Delete(sprint.id)}>
                              <CancelOutlinedIcon />
                            </IconButton>{" "}
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Reorder.Group
                      axis="y"
                      values={sprint.userStories}
                      onReorder={setItems}
                    >
                      {sprint.userStories.length == 0 && (
                        <Alert
                          severity="info"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <AlertTitle>
                            No userStories in this sprint yet.
                          </AlertTitle>
                        </Alert>
                      )}
                      {sprint.userStories.map((item) => (
                        <Reorder.Item
                          key={item.id}
                          value={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            margin: 5,
                            backgroundColor:
                              mode === "dark"
                                ? "rgba(255, 255, 255 , .1)"
                                : "rgba(0, 0, 0,.1)",
                            borderRadius: 5,
                            cursor: "pointer",
                            height: 50,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              display: "flex",
                              width: "170px",
                            }}
                            color="textSecondary"
                          >
                            <SchoolIcon
                              sx={{ color: "green", marginRight: 2 }}
                            ></SchoolIcon>
                            {item.name}
                          </Typography>
                          <Tooltip
                            title={item.description}
                            sx={{ width: "100%" }}
                          >
                            <Typography color="textSecondary" fontSize="14px">
                              {isbigScreen && item.description.substring(0, 65)}
                              {!isbigScreen &&
                                !isSmallScreen &&
                                item.description.substring(
                                  0,
                                  isStudent ? 85 : 110
                                )}
                              {item.description.length > 20 && "..."}
                            </Typography>
                          </Tooltip>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography id="fade-button" aria-haspopup="true">
                              <Tooltip title={item.status}>
                                {Statuticon(item.status)}
                              </Tooltip>
                            </Typography>

                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                                width: 20,
                                ml: 1,
                              }}
                            >
                              {" "}
                              <Tooltip title={"priority " + item.priority}>
                                {Priorityicon(item.priority)}{" "}
                              </Tooltip>
                            </Typography>

                            <IconButton
                              aria-controls="filter-menu"
                              aria-haspopup="true"
                              onClick={(event) =>
                                handleFilterClick(event, item.id)
                              }
                            >
                              {item.developer == null && (
                                <Tooltip title="Not assigned">
                                  <Avatar
                                    sx={{ fontSize: 14, width: 35, height: 35 }}
                                  >
                                    NA
                                  </Avatar>
                                </Tooltip>
                              )}
                              {item.developer != null && (
                                <Tooltip
                                  title={
                                    item.developer.firstName +
                                    " " +
                                    item.developer.lastName
                                  }
                                >
                                  <Avatar
                                    sx={{ width: 35, height: 35 }}
                                    src={
                                      membersImages.find(
                                        (member) =>
                                          member.id === item.developer.id
                                      )?.url
                                    }
                                  />
                                </Tooltip>
                              )}
                            </IconButton>
                            {isStudent &&
                              (sprint.closed && sprint.started ? (
                                <></>
                              ) : (
                                <Menu
                                  id="long-menu"
                                  MenuListProps={{
                                    "aria-labelledby": "long-button",
                                  }}
                                  TransitionComponent={Fade}
                                  anchorEl={anchorEl[item.id]}
                                  open={Boolean(anchorEl[item.id])}
                                  onClose={() => handleClose(item.id)}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemClick(0, item.id)
                                    }
                                  >
                                    Not assigned
                                  </MenuItem>
                                  {Membres.map((member) => (
                                    <MenuItem
                                      key={member.id}
                                      onClick={() =>
                                        handleMenuItemClick(member.id, item.id)
                                      }
                                    >
                                      {member.firstName} {member.lastName}
                                    </MenuItem>
                                  ))}
                                </Menu>
                              ))}
                            {isStudent &&
                              (sprint.closed && sprint.started ? (
                                <></>
                              ) : (
                                <>
                                  <Tooltip title="Modify">
                                    {" "}
                                    <IconButton
                                      onClick={() => handleModifyStory(item)}
                                    >
                                      <EditIcon />{" "}
                                    </IconButton>{" "}
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() =>
                                        handleremovefromSprint(item.id)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>{" "}
                                  </Tooltip>
                                </>
                              ))}
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            {isStudent && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  endIcon={<AddCircleOutlineIcon />}
                  onClick={handleClickOpen}
                >
                  Create Sprint
                </Button>
              </Box>
            )}
            <CreateSprintDialog
              setRender={setRender}
              projectId={projectID}
              token={token}
              SprintDialogOpen={SprintDialogOpen}
              handleModalClose={handleModalClose}
              sprintData={SprintData}
              setSnackbarMessage={setsnackbarDeleteMessage}
              setSnackbarOpen={setSnackbarDeleteOpen}
            ></CreateSprintDialog>
          </Box>
          {/* ///////////////////////////BackLog///////////////////////////////////////////////////////// */}

          <Box
            gap={4}
            p={2}
            sx={{
              marginTop: 4,
              border: "dashed gray",
              borderRadius: "10px",
              minWidth: "100%",
            }}
          >
            <Box
              my={4}
              // display="flex"
              // alignItems="center"
              sx={{
                minWidth: "100%",
                overflow: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
              }}
            >
              {!backlogShow && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography>BackLog</Typography>

                  <Typography s>( {0} Stories)</Typography>
                </div>
              )}

              {backlogShow && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Typography style={{ fontWeight: 900, marginRight: 15 }}>
                      BackLog
                    </Typography>

                    <Typography style={{ marginRight: 5 }}>
                      {console.log(backlogData)}({" "}
                      {backlogData &&
                        Object.keys(backlogData).length > 0 &&
                        backlogData.userStories.length > 0 &&
                        backlogData.userStories.filter(
                          (story) => story.sprintId === null
                        ).length}{" "}
                      Stories)
                    </Typography>
                  </div>

                  <Reorder.Group
                    axis="y"
                    values={
                      backlogData && Object.keys(backlogData) > 0
                        ? backlogData.userStories
                        : {}
                    }
                    onReorder={setItem2}
                  >
                    {backlogData &&
                      Object.keys(backlogData).length > 0 &&
                      backlogData.userStories
                        .filter((story) => story.sprintId === null)
                        .map((story) => (
                          <Reorder.Item
                            key={story.id}
                            value={story}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              // justifyContent: "space-between",
                              gap: 10,
                              padding: 10,
                              margin: 5,
                              backgroundColor:
                                mode === "dark"
                                  ? "rgba(255, 255, 255 , .07)"
                                  : "rgba(0, 0, 0,.07)",

                              borderRadius: 5,
                              cursor: "pointer",
                              height: 50,

                              minWidth: 845,
                              width: "100%",
                            }}
                            //  onHoverStart={() => setHoveredItem(story)}
                            //  onHoverEnd={() => setHoveredItem(null)}
                          >
                            <Typography
                              color="textSecondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 900,
                                minWidth: 100,
                              }}
                            >
                              <SchoolIcon
                                sx={{ color: "green", marginRight: 2 }}
                              ></SchoolIcon>
                              {story.name}
                            </Typography>

                            <Tooltip
                              title={story.description}
                              sx={{ width: "100%" }}
                            >
                              <Typography color="textSecondary" fontSize="14px">
                                {isbigScreen &&
                                  story.description.substring(0, 65)}
                                {!isbigScreen &&
                                  !isSmallScreen &&
                                  story.description.substring(
                                    0,
                                    isStudent ? 85 : 110
                                  )}
                                {story.description.length > 20 && "..."}
                              </Typography>
                            </Tooltip>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  width: isSmallScreen ? 30 : 150,
                                }}
                              >
                                {Statuticon(story.status)}
                                {!isSmallScreen && (
                                  <div style={{ marginLeft: 5 }}>
                                    {story.status}
                                  </div>
                                )}
                              </Typography>
                              <Tooltip title={`Priority: ${story.priority}`}>
                                <Typography
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {Priorityicon(story.priority)}
                                </Typography>
                              </Tooltip>
                              {isStudent && (
                                <>
                                  <Tooltip title="Modify">
                                    {" "}
                                    <IconButton
                                      onClick={() => handleModifyStory(story)}
                                    >
                                      <EditIcon />{" "}
                                    </IconButton>{" "}
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() => Deletestory(story.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>{" "}
                                  </Tooltip>
                                  <Tooltip title="Affecter to Sprint">
                                    <IconButton
                                      onClick={(event) =>
                                        handleClick2(event, story.id)
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>{" "}
                                  </Tooltip>
                                </>
                              )}
                            </div>

                            <Menu
                              id="basic-menu"
                              anchorEl={anchorE2[story.id]}
                              open={Boolean(anchorE2[story.id])}
                              onClose={() => handleClose2(story.id)}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              {SprintData.filter(
                                (sprint) => sprint.closed === false
                              ).length == 0 && (
                                <MenuItem>No sprints Yet </MenuItem>
                              )}
                              {SprintData.filter(
                                (sprint) => sprint.closed === false
                              ).map((sprint) => (
                                <MenuItem
                                  key={sprint.id}
                                  onClick={() =>
                                    handleaffectTosprint(story.id, sprint.id)
                                  }
                                >
                                  {sprint.name}
                                </MenuItem>
                              ))}
                            </Menu>
                          </Reorder.Item>
                        ))}
                  </Reorder.Group>
                </>
              )}
              {!backlogShow && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Alert
                    severity="info"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <AlertTitle> Your Backlog is empty.</AlertTitle>
                  </Alert>
                </Box>
              )}
            </Box>
            {
              isStudent && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    endIcon={<AddCircleOutlineIcon />}
                    onClick={handleClickOpenStory}
                  >
                    Create Story
                  </Button>
                </Box>

              )
            }

            <CreateStoryDialog
              setRender={setRender}
              token={token}
              backlogId={backlogID}
              StoryDialogOpen={StoryDialogOpen}
              handleModalCloseStory={handleModalCloseStory}
              setSnackbarOpen={snackbarDeleteOpen}
              setSnackbarMessage={snackbarDeleteMessage}
            />

            <CreateModifyStoryDialog
              setRender={setRender}
              Story={StoryAmodify}
              token={token}
              StoryDialogOpen={StoryModifyDialogOpen}
              handleModalCloseStory={handleModalCloseStory}
              setSnackbarOpen={setsnackbarDeleteMessage}
              setSnackbarMessage={setsnackbarDeleteMessage}
            />

            <ModifySprint
              setRender={setRender}
              sprint={SprintAmodify}
              token={token}
              open={Modifysprintopen}
              handleModalClosesprint={handleModalCloseStory}
            />
            <Snackbar
              open={snackbarDeleteOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarDeleteClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarDeleteClose}
                severity={
                  snackbarDeleteMessage &&
                  snackbarDeleteMessage.includes("success")
                    ? "success"
                    : "error"
                }
                sx={{ width: "100%" }}
              >
                {snackbarDeleteMessage}
              </Alert>
            </Snackbar>
            <ConfirmationDialog
              id={idSprintDelete}
              message={massege}
              openDialog={openDeleteDialogue}
              setOpenDialog={setopenDeleteDialogue}
              handleConfirmClick={removeSprint}
              setLoading={setloadingDialogue}
              loading={loadingDialogue}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this Story ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteConfirmation(StoryIdDelete)}
                  color="error"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "60px",
            alignItems: "center",
          }}
        >
          <img src="/src/assets/document.png" height={200} width={200} />
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
      )
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
          {user &&
          Object.keys(user).length > 0 &&
          user.authorities.find(
            (auth) => auth.authority === "ROLE_SUPERVISOR"
          ) !== undefined
            ? "No team found for this project"
            : "You are not in a team"}
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center">
          {user &&
          Object.keys(user).length > 0 &&
          user.authorities.find(
            (auth) => auth.authority === "ROLE_SUPERVISOR"
          ) !== undefined
            ? "Wait until the a team is assigned to this project"
            : "Still have no team ,create one or wait till you're added to one"}
        </Typography>
      </div>
    );
  }
}

export default BackLog;
