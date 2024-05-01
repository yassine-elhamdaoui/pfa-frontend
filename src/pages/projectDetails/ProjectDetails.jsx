import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { getUserById } from "../../services/userService";
import { getTeamById } from "../../services/teamService";
import { Avatar, Button, Typography, Card, Grid, Paper, CardHeader, Box, AvatarGroup } from "@mui/material";
import { hasRole } from "../../utils/userUtiles"; 
import { stringAvatar,stringToColor } from "../../utils/generalUtils";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import GetAppIcon from '@mui/icons-material/GetApp';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import TxtIcon from '@mui/icons-material/Description';
import PptIcon from '@mui/icons-material/Slideshow';
import XlsIcon from '@mui/icons-material/TableChart';
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import IpynbIcon from '@mui/icons-material/Code';
import DocIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import ZipIcon from '@mui/icons-material/Archive';
import CsvIcon from '@mui/icons-material/TableChart';
import JsonIcon from '@mui/icons-material/Code';
import EventIcon from '@mui/icons-material/Event';
import CodeIcon from '@mui/icons-material/Code';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { DataGrid } from "@mui/x-data-grid";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";
// import { downloadFile } from "../../services/documentService";
// import ProjectDetailsSkeleton from "./ProjectDetailsSkeleton";





function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const mode = localStorage.getItem("mode")
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  const [team, setTeam] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [report, setReport] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProject = await getProjectById(id, token);
        setProject(fetchedProject);

        const supervisorPromises = fetchedProject.supervisorIds.map((supervisorId) =>
        getUserById(supervisorId, token)
      );
      const fetchedSupervisors = await Promise.all(supervisorPromises);
      setSupervisors(fetchedSupervisors);
      if (fetchedProject.teamId) {
        const fetchedTeam = await getTeamById(fetchedProject.teamId, token);
        console.log(fetchedTeam);
        setTeam(fetchedTeam);
    } else {
        console.error("Team is null for the project:", fetchedProject);
    }
    
      // Récupération des documents du projet s'il est ancien
      if (fetchedProject.status === "old") {
        setDocuments(fetchedProject.documentIds);
        setReport(fetchedProject.reportId);
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
  if (loading) {
    return <div>Loading</div>;
  }

  if (!project) {
    return <div>Project not found!</div>;
  }

  const isTeamMember =  Object.keys(team).length > 0 && team.members.some(member => member.id === parseInt(userId));
  const isOldProject = project.status === "old";
  const canViewDocuments =
    isOldProject &&
    Object.keys(project).length > 0 &&
    ((hasRole("ROLE_SUPERVISOR") &&
      project.supervisorIds.some((id) => (id === parseInt(userId)))) ||
      hasRole("ROLE_HEAD_OF_BRANCH") ||
      (hasRole("ROLE_STUDENT") && isTeamMember));


  const hasReport = report !== null;

  const hasDocuments = documents.length > 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <div style={{display:"flex" , justifyContent:"space-between",alignItems:"center"}}>
        <BreadCrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Projects", link: "/projects" },
            { label: project.title, link: "#" },
          ]}
        />
        {
          hasRole("ROLE_SUPERVISOR") && project.supervisorIds.some((id) => (id === parseInt(userId))) && (
          <Button
            component={Link}
            variant="text"
            startIcon={<BorderColorOutlinedIcon />}
          >
            Edit
          </Button>
          )
        }
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
            elevation={3}
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
              elevation={3}
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
              elevation={3}
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
              elevation={3}
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
                        ? `${(params.row.size / 1024).toFixed(2)} KB`
                        : `${(params.row.size / 1024).toFixed(2)} KB`,
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
              height: "100%",
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
            {team && (
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
                  <Typography variant="body1">{team.name}</Typography>
                </div>
                <AvatarGroup max={5}>
                  {team.members.map((member) => (
                    <Avatar
                      key={member.id}
                      {...stringAvatar(
                        `${member.firstName} ${member.lastName}`
                      )}
                    />
                  ))}
                </AvatarGroup>
              </Card>
            )}
            {project.codeLink && (
              <>
                <BreadCrumb items={[{ label: "Code Repository", link: "#" }]} />
                <Card
                  sx={{
                    backgroundColor:
                      mode === "dark" ? "#121212" : "rgba(0,0,0,0.06)",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1">{project.codeLink}</Typography>
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


function renderFileTypeIcon(fileType) {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PdfIcon />;
    case 'txt':
      return <TxtIcon />;
    case 'ppt':
      return <PptIcon />;
    case 'xls':
      return <XlsIcon />;
    case 'ipynb':
      return <IpynbIcon />;
    case 'doc':
    case 'docx':
      return <DocIcon />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <ImageIcon />;
    case 'zip':
      return <ZipIcon />;
    case 'csv':
      return <CsvIcon />;
    case 'json':
      return <JsonIcon />;
    default:
      return null;
  }
}

export default ProjectDetails;