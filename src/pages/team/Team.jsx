import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Button,
  Divider,
  Snackbar,
  Alert,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamById } from "../../services/teamService";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { stringAvatar } from "../../utils/generalUtils";
import BadgeIcon from "@mui/icons-material/Badge";
import { hasRole } from "../../utils/userUtiles";
import { getAllPreferences, getAllProjects, getAssignment, getTeamPreferences } from "../../services/projectService";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import MakePreferencesDialog from "../../components/dialogs/MakePreferencesDialog";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import TeamSkeleton from "./TeamSkeleton";
import { useTheme } from "@mui/material/styles";
import { forEach, set } from "lodash";
import { downLoadProfileImage } from "../../services/userService";


const isResponsible = hasRole("ROLE_RESPONSIBLE");
function Team() {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team");
  const userId = localStorage.getItem("userId");
  const [render,setRender]=useState(false);
  const initialRender = useRef(true);
  const mode = localStorage.getItem("mode");
  const navigate = useNavigate();
  const [team, setTeam] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});

  const [membersImages , setMembersImages] = useState([])
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };


  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setPreferencesDialogOpen(false);
  };

  const handleMakePreferencesClicked = () => {
    setPreferencesDialogOpen(true);
  }



  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (initialRender.current) {
          setLoading(true);
        }
        const fetchedTeam = await getTeamById(teamId, token);
        const fetchedPreferences = await getTeamPreferences(teamId, token);
        const fetchedProjects = await getAllProjects(
          token,
          undefined,
          undefined,
          20
        );
        const fetchedAssignment = await getAssignment(token);
        forEach(fetchedTeam.members, async (member) => {
          console.log(member.firstName);
          const response = await downLoadProfileImage(member.id, token);
          console.log(member.firstName);
          setMembersImages((prev) => [
            ...prev,
            {
              id: member.id,
              name: member.firstName + " " + member.lastName,
              url: response,
            },
          ]);
          console.log(member.firstName);
        });
        setProjects(fetchedProjects);
        setTeam(fetchedTeam);
        setPreferences(fetchedPreferences);
        setAssignment(fetchedAssignment);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team:", error);
                if (!initialRender.current) {
                  setLoading(false);
                }
      } finally {
        if (!initialRender.current) {
          setLoading(false);
        }
      }
    };
    if (teamId !== "undefined" && teamId !== "null") {
      fetchTeam();
    }else {
      setLoading(false)

    }
  }, [render]);
console.log(membersImages);
  return loading ? (
    <TeamSkeleton />
  ) : Object.keys(team).length > 0 ? (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BreadCrumb
          items={[
            { link: "/", label: "Home" },
            { link: "#", label: "Team" },
            { link: "#", label: team.name },
          ]}
        />
        {isResponsible && team.responsible.id === parseInt(userId) && (
          <Button>edit</Button>
        )}
      </div>
      <Grid container spacing={1} marginTop={2}>
        {team.members.map((member, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <CardHeader
                  sx={{ padding: "0px" }}
                  avatar={
                    <Avatar
                      // {...stringAvatar(
                      //   `${member.firstName} ${member.lastName}`
                      // )}
                      src={membersImages.find((image) => image.id === member.id)?.url}
                      height={40}
                      width={40}
                    />
                  }
                  title={`${member.firstName} ${member.lastName}`}
                />
                {member.authorities.some(
                  (authority) =>
                    authority.authority === "ROLE_RESPONSIBLE" &&
                    team.responsible.id === member.id
                ) ? (
                  <BadgeIcon sx={{ marginLeft: "10px" }} />
                ) : null}
              </div>
              <CardContent sx={{ padding: "10px" }}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {member.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginTop: "25px", marginBottom: "25px" }} />
      {team &&
      preferences &&
      preferences.some(
        (preference) => preference.user.id === team.responsible.id
      ) ? (
        preferences.map(
          (preference, index) =>
            preference.user.id === team.responsible.id && (
              <>
                {Object.keys(assignment).length !== 0 ? (
                  <BreadCrumb items={[{ link: "#", label: "Project" }]} />
                ) : (
                  <BreadCrumb items={[{ link: "#", label: "Preferences" }]} />
                )}
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "30px",
                  }}
                >
                  <List
                    sx={{
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.up("md")]: {
                        width: "70%",
                      },
                    }}
                  >
                    {Object.entries(preference.projectPreferenceRanks)
                      .sort(([, a], [, b]) => a - b) // Sort preferences from smaller to bigger
                      .map(([projectId, ranking], index) => {
                        const project = projects.find(
                          (project) => project.id === parseInt(projectId)
                        );
                        return (
                          <ListItem
                            key={index}
                            alignItems="flex-start"
                            onClick={() =>
                              navigate(`/dashboard/projects/${projectId}`)
                            }
                            sx={{
                              cursor: "pointer",
                              borderTop: `solid 0.2px `,
                              borderLeft: `solid 0.2px `,
                              borderRight: `solid 0.2px `,
                              borderBottom:
                                index ===
                                Object.entries(
                                  preference.projectPreferenceRanks
                                ).length -
                                  1
                                  ? `solid 0.2px white`
                                  : "none", // Add borderBottom for the last item

                              borderColor:
                                mode === "dark"
                                  ? "rgba(255, 255, 255, 0.12)"
                                  : "rgba(0, 0, 0, 0.12)",
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <StarBorderPurple500Icon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                >{`Preference ${ranking}: ${project.title}`}</Typography>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {project.description.slice(0, 150)+"..."}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
              </>
            )
        )
      ) : isResponsible && team.responsible.id === parseInt(userId) ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          {/* <CommentsDisabledIcon sx={{ fontSize: 150 }} /> */}
          <img src="/src/assets/preferences.png" alt="" height={150} />
          <Typography variant="body1" color="textSecondary">
            You haven't make any preferences yet
          </Typography>
          <Button
            onClick={handleMakePreferencesClicked}
            variant="outlined"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Make Preferences
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <CommentsDisabledIcon sx={{ fontSize: 150 }} />
          <Typography variant="body1" color="textSecondary">
            The responsible has not made preferences yet
          </Typography>
        </div>
      )}
      <MakePreferencesDialog
        projects={projects}
        preferencesDialogOpen={preferencesDialogOpen}
        handleModalClose={handleDialogClose}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setRender={setRender}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage && snackbarMessage.includes("successfully")
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "100px",
        alignItems: "center",
      }}
    >
      <img
        src="/src/assets/team.png"
        height={200}
        width={200}
        style={{ marginBottom: "10px" }}
      />
      <Typography variant="h5" color="textSecondary" textAlign="center">
        No team found
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        Please make sure you have selected a team
      </Typography>
    </div>
  );
}

export default Team;
