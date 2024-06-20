import { useEffect, useRef, useState } from "react";
import "./board.scss";

import {
  ColumnDirective,
  ColumnsDirective,
  KanbanComponent,
} from "@syncfusion/ej2-react-kanban";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/navBar/navBar";
import SearchIcon from "@mui/icons-material/Search";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { stringAvatar } from "../../utils/generalUtils";
import { updateUserStory } from "../../services/userStoryService";
import { getTeamById } from "../../services/teamService";
import { getProjectById } from "../../services/projectService";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArticleIcon from "@mui/icons-material/Article";
import { getUserStories } from "../../services/backlog";
import { Link, useSearchParams } from "react-router-dom";
import { downLoadProfileImage, getUserById } from "../../services/userService";
import { forEach, set } from "lodash";

function Board() {
  const mode = localStorage.getItem("mode");
  const [params] = useSearchParams();
  let teamId = params.get("teamId");
  const token = localStorage.getItem("token");
  const currentUserName = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  const [team, setTeam] = useState({});
  const [user,setUser] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [project, setProject] = useState([{}]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [membersImages , setMembersImages] = useState([{}]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        setLoading(true);
        const fetchedUser = await getUserById(userId, token);
        console.log(fetchedUser);
        setUser(fetchedUser);
        if (fetchedUser.authorities.find((auth) => auth.authority === "ROLE_SUPERVISOR") !== undefined) {
          console.log("here");
          const fetchedTeam = await getTeamById(teamId , token);
          console.log(fetchedUser);
          console.log(fetchedTeam);
          setTeam(fetchedTeam);
          const membersStuff = [];
          forEach(fetchedTeam.members, async (member) => {
            const url = await downLoadProfileImage(member.id, token);
            console.log(member.firstName);
            membersStuff.push({
              id: member.id,
              name: member.firstName + " " + member.lastName,
              url: url,
            });
          });
          setMembersImages(membersStuff);
          setProject(fetchedTeam.project);
          console.log(fetchedTeam.project);
          const fetchedUserStories = await getUserStories(
            fetchedTeam.project.backlogId,
            token
          );
          setUserStories(fetchedUserStories);
        }else{
          teamId = fetchedUser.teamId;
          if (teamId !== null) {
            console.log(teamId );
            const fetchedTeam = await getTeamById(teamId , token);
            console.log(fetchedTeam);
            setTeam(fetchedTeam);
            setProject(fetchedTeam.project);
            console.log(fetchedTeam.project);
            const fetchedUserStories = await getUserStories(
              fetchedTeam.project.backlogId,
              token
            );
            console.log(userStories);
            setUserStories(fetchedUserStories);


            forEach(team.members, async (member) => {
              console.log(member.firstName);
              const url = await downLoadProfileImage(
                member.id,
                token
              );
              console.log(member.firstName);
              setMembersImages((prev) => [
                ...prev,
                {
                  id: member.id,
                  name: member.firstName + " " + member.lastName,
                  url: url,
                },
              ]);
            });



            
            setLoading(false);
          } else {
            throw new Error("User is not in a team");
          }
        }
      } catch (error) {
        console.error("Error fetching user stories: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStories();
  }, [teamId]);

  const handleCardDoubleClick = (args) => {
    setSelectedCard(args.data); // Store the selected card data
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };
  const updateStoryStatus = (storyId, newStatus) => {
    const newUserStory = { status: newStatus };
    const updatedUserStory = updateUserStory(newUserStory, storyId, token);
    console.log(`Updating story ${storyId} to status ${newStatus}`);
  };

  const swimlaneTemplate =  (data) => {
    console.log(data);
    console.log(membersImages);
    
    if (data && data.keyField !== "") {
      console.log(data);
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px",
          }}
        >
          <Avatar
            src={
              membersImages.find(
                (member) => member.id === parseInt(data.keyField)
              )?.url
            }
            sx={{ width: 30, height: 30 }}
          />

          <span>
            {membersImages.length > 0 &&
              membersImages.find(
                (member) => member.id === parseInt(data.keyField)
              )?.name}
          </span>
          <Typography variant="body3" color="textSecondary">
            {data.count} items
          </Typography>
        </div>
      );
    }
    return null;
  };

  const filteredUserStories = userStories && userStories.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={mode === "dark" ? "dark-theme-kanban" : "light-theme-kanban"}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {!loading ? (
        team && Object.keys(team).length > 0 ? (
          project && Object.keys(project).length > 0 ? (
            userStories && userStories.length > 0 ? (
              <>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    justifyContent: "space-between",
                    flexWrap:"wrap"
                  }}
                >
                  <BreadCrumb
                    items={[
                      { label: "Home", url: "/" },
                      { label: "Board", url: "/board" },
                    ]}
                  />
                  <Search
                    sx={{
                      margin: 0,
                      backgroundColor: mode === "dark" ? "#333" : "#f5f5f5",
                      "&:hover": {
                        backgroundColor:
                          mode === "dark" ? "#33333390" : "#33333320",
                      },
                    }}
                  >
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search for a story..."
                      inputProps={{ "aria-label": "search" }}
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </Search>
                </Box>
                <KanbanComponent
                  allowSearch={true}
                  className="kanban-container"
                  dataSource={filteredUserStories}
                  keyField="status"
                  dialogOpen={false}
                  cardSettings={{
                    contentField: "description",
                    headerField: "name",
                    grabberField: "developerName",
                    tagsField: "tags",
                  }}
                  cardClick={handleCardDoubleClick}
                  cardRendered={(args) => {
                    const { data } = args;
                    const { developerName } = data;
                    const avatarColor = stringAvatar(developerName).sx.bgcolor;
                    const lightColor = avatarColor.concat("90");
                    args.element.style.borderLeft = `5px solid ${lightColor}`;
                  }}
                  dragStop={(args) => {
                    const { data } = args;
                    console.log(args);
                    if (data[0].developerName !== currentUserName) {
                      args.cancel = true;
                      setSnackbarMessage(
                        "You can only update the state of your task"
                      );
                      setSnackbarOpen(true);
                    } else {
                      const storyId = data[0].id;
                      const newStatus = data[0].status;
                      updateStoryStatus(storyId, newStatus);
                    }
                  }}
                  swimlaneSettings={{
                    template: swimlaneTemplate,
                    keyField: `developerId`,
                    showItemCount: false,
                  }}
                  enableTooltip={openDialog ? false : true}
                  height="100%"
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      allowToggle={true}
                      keyField="ToDo"
                      headerText="ToDo"
                    ></ColumnDirective>
                    <ColumnDirective
                      allowToggle={true}
                      keyField="In Progress"
                      headerText="In Progress"
                    ></ColumnDirective>
                    <ColumnDirective
                      allowToggle={true}
                      keyField="Done"
                      headerText="Done"
                    ></ColumnDirective>
                  </ColumnsDirective>
                </KanbanComponent>
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
                <img src="/src/assets/agile.png" height={200} width={200} />
                <Typography
                  variant="h5"
                  color="textSecondary"
                  textAlign="center"
                >
                  {Object.keys(user).length > 0 &&
                  user.authorities.find(
                    (auth) => auth.authority === "ROLE_SUPERVISOR"
                  ) !== undefined
                    ? "No user stories found"
                    : "Get started in the backlog"}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                >
                  {Object.keys(user).length > 0 &&
                  user.authorities.find(
                    (auth) => auth.authority === "ROLE_SUPERVISOR"
                  ) !== undefined ? (
                    "Wait for the team to add some user stories and start the sprint"
                  ) : (
                    <>
                      Plan and start the sprint in the{" "}
                      <Link to="/project/backlog">Backlog</Link> then come back
                      here
                    </>
                  )}
                </Typography>
              </div>
            )
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
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
              >
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
              {Object.keys(user).length > 0 &&
              user.authorities.find(
                (auth) => auth.authority === "ROLE_SUPERVISOR"
              ) !== undefined
                ? "No team found for this project"
                : "You are not in a team"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              {Object.keys(user).length > 0 &&
              user.authorities.find(
                (auth) => auth.authority === "ROLE_SUPERVISOR"
              ) !== undefined
                ? "Wait until the a team is assigned to this project"
                : "Still have no team ,create one or wait till you're added to one"}
            </Typography>
          </div>
        )
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            height={25}
            width={180}
            sx={{ borderRadius: "30px" }}
          />
          <Skeleton
            variant="rectangular"
            height={40}
            width={250}
            sx={{ borderRadius: "5px" }}
          />
          <Grid container style={{ display: "flex", gap: "0px" }}>
            <Grid
              item
              sm={4}
              md={4}
              lg={4}
              sx={{
                padding: "0 5px 0 0",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                height="calc(100svh - 250px)"
                sx={{ borderRadius: "5px" }}
              />
            </Grid>
            <Grid
              item
              sm={4}
              md={4}
              lg={4}
              sx={{
                padding: "0 5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                height="calc(100svh - 250px)"
                sx={{ borderRadius: "5px" }}
              />
            </Grid>
            <Grid
              item
              sm={4}
              md={4}
              lg={4}
              sx={{
                padding: "0 0 0 5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "5px" }}
              />
              <Skeleton
                variant="rectangular"
                height="calc(100svh - 250px)"
                sx={{ borderRadius: "5px" }}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCard?.name}</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{
              paddingTop: "10px",
            }}
          >
            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
                elevation={3}
              >
                <BreadCrumb items={[{ label: "description", link: "/" }]} />
                <Typography variant="body1" color="textSecondary">
                  {selectedCard?.description}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "10px",
                  display: "flex",
                  gap: "10px",
                }}
                elevation={3}
              >
                <BreadCrumb items={[{ label: "Developer", link: "/" }]} />
                <Typography variant="body1" color="textSecondary">
                  {selectedCard?.developerName}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "10px",
                  display: "flex",
                  gap: "10px",
                }}
                elevation={3}
              >
                <BreadCrumb items={[{ label: "Priority", link: "/" }]} />
                {selectedCard?.priority > 15 && (
                  <>
                    <Typography variant="body1" color="error">
                      Too High
                    </Typography>
                    <KeyboardDoubleArrowUpIcon color="error" />
                  </>
                )}
                {selectedCard?.priority <= 15 &&
                  selectedCard?.priority > 10 && (
                    <>
                      <Typography variant="body1" color="orange">
                        Medium
                      </Typography>
                      <DensityMediumIcon color="warning" />
                    </>
                  )}
                {selectedCard?.priority <= 10 && selectedCard?.priority > 5 && (
                  <>
                    <Typography variant="body1" color="lightgreen">
                      Low
                    </Typography>
                    <KeyboardDoubleArrowDownIcon sx={{ color: "lightgreen" }} />
                  </>
                )}
                {selectedCard?.priority <= 5 && (
                  <>
                    <Typography variant="body1" color="lightgreen">
                      Very Low
                    </Typography>
                    <KeyboardDoubleArrowDownIcon sx={{ color: "lightgreen" }} />
                  </>
                )}
                <Typography variant="body1" color="textSecondary">
                  {selectedCard?.priority}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "10px",
                  display: "flex",
                  gap: "10px",
                }}
                elevation={3}
              >
                <BreadCrumb items={[{ label: "StoryPoints", link: "/" }]} />
                <Typography variant="body1" color="textSecondary">
                  {selectedCard?.storyPoints}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "10px",
                  display: "flex",
                  gap: "10px",
                }}
                elevation={3}
              >
                <BreadCrumb items={[{ label: "Status", link: "/" }]} />
                {selectedCard?.status === "ToDo" && (
                  <>
                    <ArticleIcon />
                    <Typography variant="body1" color="textSecondary">
                      {selectedCard?.status}
                    </Typography>
                  </>
                )}
                {selectedCard?.status === "In Progress" && (
                  <>
                    <AutoModeIcon sx={{ color: "lightblue" }} />
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        backgroundColor: "rgba(173, 216, 230,0.5)",
                        padding: "0 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {selectedCard?.status}
                    </Typography>
                  </>
                )}
                {selectedCard?.status === "Done" && (
                  <>
                    <CheckCircleOutlineIcon color="success" />
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        backgroundColor: "rgba(0,255,0,0.3)",
                        padding: "0 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {selectedCard?.status}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
            {/* Add more Grid items for additional information */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage && snackbarMessage.includes("You can only update")
              ? "info"
              : "success"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Board;
