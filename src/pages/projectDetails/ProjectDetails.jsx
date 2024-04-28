import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { getSupervisorById } from "../../services/userService";
import { getTeamById } from "../../services/teamService";
import { Avatar, Button, Typography, Card, Grid } from "@mui/material";
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





function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
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
        getSupervisorById(supervisorId, token)
      );
      const fetchedSupervisors = await Promise.all(supervisorPromises);
      setSupervisors(fetchedSupervisors);
      if (fetchedProject.teamId) {
        const fetchedTeam = await getTeamById(fetchedProject.teamId, token);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found!</div>;
  }

  // Vérifier si l'utilisateur est membre de l'équipe du projet
  const isTeamMember = team && team.members.some(member => member.id === userId);

  // Vérifier si le projet est ancien ou nouveau
  const isOldProject = project.status === "old";

  // Déterminer si l'utilisateur peut voir les documents
  const canViewDocuments = isOldProject && (hasRole("ROLE_SUPERVISOR") || hasRole("ROLE_HEAD_OF_BRANCH") || (hasRole("ROLE_STUDENT") && isTeamMember));

  // Déterminer si l'utilisateur peut voir les commentaires
  const canViewComments = (hasRole("ROLE_SUPERVISOR") || (hasRole("ROLE_STUDENT") && isTeamMember));

  // Déterminer si le rapport existe
  const hasReport = report !== null;

  // Déterminer si des documents existent
  const hasDocuments = documents.length > 0;

  return (
    <div style={{ margin: '20px' }}>
<h1 style={{ display: "flex", alignItems: "center" }}><StickyNote2Icon style={{ marginRight: "10px", fontSize: "2rem" }} />{project.title}</h1>
<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
<div style={{ padding: "10px" }}>
  <Typography variant="h6">Description</Typography>
  <Typography variant="body1">{project.description}</Typography>
</div>
        <div style={{ border: "2px solid #ccc", borderRadius: "5px", padding: "10px" }}>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>Status <TimelapseIcon style={{ marginLeft: '5px' }} /></Typography>
          <Typography variant="body1">{project.status}</Typography>
        </div>
        <div style={{ border: "2px solid #ccc", borderRadius: "5px", padding: "10px" }}>
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>Academic Year <EventIcon style={{ marginLeft: '5px' }} /></Typography>
          <Typography variant="body1">{project.academicYear}</Typography>
        </div>
        <div style={{ border: "2px solid #ccc", borderRadius: "5px", padding: "10px" }}>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>Technologies <CodeIcon style={{ marginLeft: '5px' }}/></Typography>
          <Typography variant="body1">{project.techStack}</Typography>
        </div>
        
      </div>
      <h2 style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: '#e6f7ff', border: '1px solid #ccc', padding: '5px', display: 'inline-block', color: '#000', width: 'fit-content' }}>Supervisors</h2>
      <ul style={{ marginBottom: '20px' }}>
      <Grid container spacing={2}>
        {supervisors.map((supervisor) => (
          <Grid item key={supervisor.id} xs={12} sm={6} md={4} lg={3}> 
            <Card sx={{ width: "fit-content" }}> 
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: stringToColor(`${supervisor.firstName} ${supervisor.lastName}`) }}>
                    {stringAvatar(`${supervisor.firstName} ${supervisor.lastName}`).children}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography>{supervisor.firstName} {supervisor.lastName}</Typography>
                  <Typography>{supervisor.email}</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      </ul>



      {team && (
  <div style={{ marginBottom: '20px' }}>
    <h2 style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: '#e6f7ff', border: '1px solid #ccc', padding: '5px', display: 'inline-block', color: '#000', width: 'fit-content' }}>Team</h2>
    <div style={{ marginBottom: '20px' }}>
  <Typography variant="body1" style={{ border: "2px solid #ADD8E6", padding: "10px", borderRadius: "5px", backgroundColor: "#F0F8FF", color: "black", marginBottom: "10px", display: "inline-block" }}>Team Name</Typography>
  <div style={{ display: 'inline-block', marginRight: '10px' }}> </div> {/* Ajouter un espace */}
  <Typography variant="body1">{team.name}</Typography>
</div>
<Typography variant="body1" style={{ border: "2px solid #ADD8E6", padding: "10px", borderRadius: "5px", backgroundColor: "#F0F8FF", color: "black", marginTop: "20px", marginBottom: "10px", display: "inline-block" }}>Members</Typography>
    <Grid container spacing={2}>
    {team.members.map((member) => (
        <Grid item key={member.id} xs={12} sm={6} md={4} lg={3}> 
          <Card sx={{ width: "fit-content" }}> 
            <Grid container direction="row" spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: stringToColor(`${member.firstName} ${member.lastName}`) }}>
                  {stringAvatar(`${member.firstName} ${member.lastName}`).children}
                </Avatar>
              </Grid>
              <Grid item>
                <Typography>{member.firstName} {member.lastName}</Typography>
                <Typography>{member.email}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  </div>
)}



{canViewDocuments && hasDocuments && (
  <div style={{ marginBottom: '20px' }}>
<h2 style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: '#e6f7ff', border: '1px solid #ccc', padding: '5px', display: 'inline-block', color: '#000' }}>Documents</h2>
    <Grid container spacing={2}>
      {documents.map((document) => {
        // Split du nom du fichier pour obtenir l'extension
        const fileNameParts = document.docName.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

        return (
          <Grid item key={document.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">{document.docName}</Typography>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    {renderFileTypeIcon(fileExtension)}
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">{fileExtension.toUpperCase()}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  href={document.downloadLink}
                  download
                >
                  Télécharger
                </Button>
              </CardActions>
              {canViewComments && document.comments.length > 0 && (
                <CardContent>
                  <Typography variant="subtitle1">Commentaires:</Typography>
                  <ul>
                    {document.comments.map((comment, index) => (
                      <li key={index}>
                        <Typography variant="body2">{comment.text}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </div>
)}


{isOldProject && hasReport && (
  <div style={{ marginBottom: '20px' }}>
    <h2 style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: '#e6f7ff', border: '1px solid #ccc', padding: '5px', display: 'inline-block', color: '#000', width: 'fit-content' }}>Report</h2>
    <Grid container spacing={2}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">{report.docName}</Typography>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                {report.docName && renderFileTypeIcon(report.docName.split('.').pop())}
              </Grid>
              <Grid item>
                <Typography variant="body2">{report.docName.split('.').pop().toUpperCase()}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              href={report.downloadLink}
              download
            >
              Télécharger 
            </Button>
          </CardActions>
          {canViewComments && report.comments && report.comments.length > 0 && (
            <CardContent>
              <Typography variant="subtitle1">Commentaires:</Typography>
              <ul>
                {report.comments.map((comment, index) => (
                  <li key={index}>
                    <Typography variant="body2">{comment.text}</Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </Grid>
    </Grid>
  </div>
)}


      {hasRole("ROLE_SUPERVISOR") && (
        <Button sx={{ position: 'fixed', bottom: 16, right: 16 }} component={Link} to={`/edit-project/${id}`} variant="contained" color="primary">
          Edit Project Details <BorderColorOutlinedIcon/>
        </Button>
      )}

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
