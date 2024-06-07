import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CodeIcon from '@mui/icons-material/Code';
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Avatar, AvatarGroup, Button, Card, CardActions, CardContent, CardHeader, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
import { downloadFile } from "../../services/documentService";
import { getProjectById } from "../../services/projectService";
import { getTeamById } from "../../services/teamService";
import { getUserById } from "../../services/userService";
import { stringAvatar, stringToColor } from "../../utils/generalUtils";
import { hasRole } from "../../utils/userUtiles";
import ProjectDetailsSkeleton from "./ProjectDetailsSkeleton";
import Groups2Icon from "@mui/icons-material/Groups2";





function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const mode = localStorage.getItem("mode")
  const [project, setProject] = useState({});
  const [user , setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  const [team, setTeam] = useState({});
  const [projectTeam, setProjectTeam] = useState({});
  const [documents, setDocuments] = useState([]);
  const [report, setReport] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await getUserById(userId, token);
        const fetchedTeam = await getTeamById(fetchedUser.teamId, token);
        setUser(fetchedUser);
        const fetchedProject = await getProjectById(id, token);
        console.log(fetchedProject);
        setProject(fetchedProject);

        const supervisorPromises = fetchedProject.supervisorIds.map((supervisorId) =>
        getUserById(supervisorId, token)
        );
        const fetchedSupervisors = await Promise.all(supervisorPromises);
        console.log(fetchedSupervisors);
        setSupervisors(fetchedSupervisors);
          console.log(fetchedTeam);
          setTeam(fetchedTeam);
          const fetchedProjectTeam = await getTeamById(fetchedProject.teamId, token);
          setProjectTeam(fetchedProjectTeam);
          console.error("Team is null for the project:", fetchedProject);
    
        // Récupération des documents du projet s'il est ancien
        if (fetchedProject.status === "old") {
          setDocuments(fetchedProject.folders.filter((folder) => folder.type === "DOCUMENTS")[0].documents);
          setReport(fetchedProject.folders.filter((folder) => folder.type === "REPORT")[0].documents[0]);
        }

      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);
  console.log(documents);
  console.log(projectTeam);
  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return <div>Project not found!</div>;
  }

  const isTeamMember =
    projectTeam &&
    Object.keys(projectTeam).length > 0 &&
    projectTeam.members.some((member) => member.id === parseInt(userId));
  const isOldProject = project.status === "old";
  const canViewDocuments =
    isOldProject &&
    Object.keys(project).length > 0 &&
    ((hasRole("ROLE_SUPERVISOR") &&
      project.supervisorIds.some((id) => (id === parseInt(userId)))) ||
      hasRole("ROLE_HEAD_OF_BRANCH") ||
      (hasRole("ROLE_STUDENT") && isTeamMember));


  const hasReport = report !== null;

  const hasDocuments = documents && documents.length > 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BreadCrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Projects", link: "/projects" },
            { label: project.title, link: "#" },
          ]}
        />
        {hasRole("ROLE_SUPERVISOR") &&
          project.supervisorIds.some((id) => id === parseInt(userId)) && (
            <Button
              component={Link}
              variant="text"
              startIcon={<BorderColorOutlinedIcon />}
            >
              Edit
            </Button>
          )}
      </div>
      <Grid container spacing={2} style={{ flex: 1 }}>
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Paper
            elevation={2}
            sx={{
              padding: "10px",
              backgroundColor: mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
            }}
          >
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1" color="textSecondary">
              {project.description}
            </Typography>
          </Paper>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Paper
              elevation={2}
              sx={{
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "rgba(255, 204, 153, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                style={{ display: "flex", alignItems: "center" }}
              >
                Status <TimelapseIcon style={{ marginLeft: "5px" }} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {project.status}
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "rgba(255, 182, 193, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                style={{ display: "flex", alignItems: "center" }}
              >
                Academic Year <EventIcon style={{ marginLeft: "5px" }} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {project.academicYear}
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "rgba(144, 238, 144, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                style={{ display: "flex", alignItems: "center" }}
              >
                Technologies <CodeIcon style={{ marginLeft: "5px" }} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {project.techStack}
              </Typography>
            </Paper>
          </div>
          {isOldProject && hasReport && (
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <BreadCrumb items={[{ label: "Documents", link: "#" }]} />
              <DataGrid
                rows={
                  canViewDocuments && hasDocuments
                    ? [report, ...documents]
                    : [report]
                }
                columns={[
                  {
                    field: "docName",
                    headerName: "Document Name",
                    width: 200,
                    valueGetter: (params) =>
                      params.row === report
                        ? `Report: ${params.row.docName
                            .split(".")[0]
                            .slice(0, -37)}`
                        : params.row.docName.split(".")[0].slice(0, -37),
                  },
                  {
                    field: "fileType",
                    headerName: "File Type",
                    width: 150,
                    valueGetter: (params) =>
                      params.row.docName.split(".").pop().toUpperCase(),
                  },
                  {
                    field: "size",
                    headerName: "Size",
                    width: 100,
                    valueGetter: (params) =>
                      params.row === report
                        ? `${(params.row.fileSize / 1024).toFixed(2)} KB`
                        : `${(params.row.fileSize / 1024).toFixed(2)} KB`,
                  },
                  {
                    field: "downloadLink",
                    headerName: "Download",
                    width: 150,
                    renderCell: (params) => (
                      <Button
                        variant="text"
                        onClick={() =>
                          downloadFile(
                            project.id,
                            params.row.id,
                            params.row.docName,
                            token
                          )
                        }
                      >
                        <GetAppIcon />
                      </Button>
                    ),
                  },
                ]}
                getRowClassName={(params) =>
                  params.row === report ? "report-row" : "normal-row"
                }
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
                disableRowSelectionOnClick
                disableSelectionOnClick
                disableColumnMenu
              />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            elevation={3}
            sx={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              height: "fit-content",
              maxHeight: "100%",
              backgroundColor: mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
            }}
          >
            <BreadCrumb items={[{ label: "Supervisors", link: "#" }]} />
            {supervisors.map((supervisor) => (
              <Card
                key={supervisor.id}
                sx={{
                  backgroundColor:
                    mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
                }}
              >
                <CardHeader
                  sx={{ padding: "10px" }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(
                          `${supervisor.firstName} ${supervisor.lastName}`
                        ),
                      }}
                    >
                      {
                        stringAvatar(
                          `${supervisor.firstName} ${supervisor.lastName}`
                        ).children
                      }
                    </Avatar>
                  }
                  title={`${supervisor.firstName} ${supervisor.lastName}`}
                  subheader={supervisor.email}
                />
              </Card>
            ))}
            <BreadCrumb items={[{ label: "Team", link: "#" }]} />
            {Object.keys(projectTeam).length > 0 ? (
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  backgroundColor:
                    mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
                }}
              >
                <div>
                  <Typography variant="body1">{projectTeam.name}</Typography>
                </div>
                <AvatarGroup max={5}>
                  {projectTeam.members.map((member) => (
                    <Avatar
                      key={member.id}
                      {...stringAvatar(
                        `${member.firstName} ${member.lastName}`
                      )}
                    />
                  ))}
                </AvatarGroup>
              </Card>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Groups2Icon sx={{ fontSize: 70, color: "lightgray" }} />
                <Typography variant="body1" textAlign="center">
                  No team assigned yet
                </Typography>
              </div>
            )}
            {project.codeLink &&
              Object.keys(team).length > 0 &&
              Object.keys(project).length > 0 &&
              team.id === project.teamId && (
                <>
                  <BreadCrumb
                    items={[{ label: "Code Repository", link: "#" }]}
                  />
                  <Card
                    sx={{
                      backgroundColor:
                        mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1">
                        {project.codeLink}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Repository
                      </Button>
                    </CardActions>
                  </Card>
                </>
              )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}





export default ProjectDetails;