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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamById } from "../../services/teamService";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { stringAvatar } from "../../utils/generalUtils";
import BadgeIcon from "@mui/icons-material/Badge";
import { hasRole } from "../../utils/userUtiles";
import { getAllPreferences, getAllProjects, getAssignment } from "../../services/projectService";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import MakePreferencesDialog from "../../components/dialogs/MakePreferencesDialog";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";


const isResponsible = hasRole("ROLE_RESPONSIBLE");
function Team() {
  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("team");
  const mode = localStorage.getItem("mode");
  const navigate = useNavigate();
  const [team, setTeam] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({})

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
        setLoading(true);
        const fetchedTeam = await getTeamById(token, teamId);
        const fetchedPreferences = await getAllPreferences(token);
        const fetchedProjects = await getAllProjects(token,undefined,undefined,20);
        const fetchedAssignment = await getAssignment(token);
        setProjects(fetchedProjects);
        setTeam(fetchedTeam);
        setPreferences(fetchedPreferences);
        setAssignment(fetchedAssignment);
        console.log(fetchedAssignment);
        console.log(fetchedTeam);
        console.log(fetchedPreferences);
        console.log(fetchedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team:", error);
        setLoading(false);
      }
    };
    if (teamId !== "undefined" && teamId !== "null") {
      fetchTeam();
    }else {
      setLoading(false)

    }
  }, []);

  return loading ? (
    <div>Loading...</div>
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
        {isResponsible && <Button>edit</Button>}
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
                      {...stringAvatar(
                        `${member.firstName} ${member.lastName}`
                      )}
                    />
                  }
                  title={`${member.firstName} ${member.lastName}`}
                />
                {member.authorities.some(
                  (authority) => authority.authority === "ROLE_RESPONSIBLE"
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
                  <List>
                    {Object.entries(preference.projectPreferenceRanks)
                      .sort(([, a], [, b]) => a - b) // Sort preferences from smaller to bigger
                      .map(([projectId, ranking], index) => {
                        const project = projects.find(
                          (project) => project.id === parseInt(projectId)
                        );
                        console.log(project);
                        return (
                          <ListItem
                            key={index}
                            alignItems="flex-start"
                            onClick={() => navigate(`/projects/${projectId}`)}
                            sx={{
                              cursor: "pointer",
                              borderTop: `solid 0.2px `,
                              borderLeft: `solid 0.2px `,
                              borderRight: `solid 0.2px `,
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
                                  {project.description}
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
      ) : isResponsible ? (
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
    <>no team yet</>
  );
}

export default Team;
