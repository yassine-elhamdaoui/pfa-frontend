import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import { getAllProjects } from "../../services/projectService";
import { Avatar, Box, Button,useMediaQuery, Card, Divider, Stack, Tooltip, Typography ,Skeleton  } from "@mui/material";
import AvatarGroup from '@mui/material/AvatarGroup';
import { stringAvatar } from "../../utils/generalUtils";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import { hasRole } from "../../utils/userUtiles";
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import DeveloperBoardOffIcon from '@mui/icons-material/DeveloperBoardOff';

function Projects() {

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const token = localStorage.getItem("token");
  const cardColors = [
    "rgba(173, 216, 230, 0.5)",
    "rgba(216, 191, 216, 0.5)",
    "rgba(144, 238, 144, 0.5)",
    "rgba(255, 255, 153, 0.5)",
    "rgba(255, 204, 153, 0.5)",
    "rgba(255, 182, 193, 0.5)",
    "rgba(255, 0, 0, 0.5)", 
    "rgba(0, 255, 0, 0.5)", 
    "rgba(0, 0, 255, 0.5)", 
    "rgba(255, 255, 0, 0.5)", 
    "rgba(255, 0, 255, 0.5)", 
    "rgba(0, 255, 255, 0.5)", 
  ];
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ds,setDS]=useState("block");
  const Uid=localStorage.getItem('userId');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUsers = await getUsers(token);
        setUsers(fetchUsers);

        const fetchProjects = await getAllProjects(token);
        setProjects(fetchProjects);
      } catch (err) {
        console.error("Error fetching Users And Projects", err);
        
      } finally {
        
        setLoading(false);
        
      }
    };
    if (!hasRole("ROLE_HEAD_OF_BRANCH")) {
      setDS("none");
    } 
    
    
    fetchData();
    
  }, [token]);

  
  
  

  if (loading) {
    return(
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {[...Array(10)].map((_, index) => (
          
          <Card 
         
            
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: '10px',
              flexGrow: 1,
              maxWidth: 360,
              margin: 2,
              cursor: 'pointer'
            }}
            key={index}
          >
            <Box sx={{ p: 2}}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={150} height={40} />
               
              </Stack>
              <Divider />
              <Skeleton variant="text" width={300} height={200} />
              
              <Stack direction="row" spacing={1} marginTop={3}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              </Stack>
            </Box>
            <Box sx={{ p: 2 , display:ds}}  >
            <Divider />
            <Stack direction="row" spacing={2} justifyContent="end" marginTop={2}>
                
                  <>
                  <Skeleton variant="rounded" width={100} height={30} />
                  <Skeleton variant="rounded" width={100} height={30} />
                  </>
              </Stack>
            </Box>
          </Card>
          
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      
      <PlaceHolder icon={DeveloperBoardOffIcon} title="No Projects Yet" message="no projects published at the moment" />
    );
  }
  else{
  return (
    
    <div style={{ display: 'flex', flexWrap:'wrap' }}>
      {projects.map((Pro, index) => (
          <Card
                sx={{
                  
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin:2,
                  '&:hover': {
                    boxShadow: 6, // More pronounced shadow on hover
                  }
                
                }}
          
          >
            <Box  sx={{bgcolor: cardColors[index % cardColors.length],width:20}}  />
            <Box 
            
                  variant="elevation"
                  sx={{
                    // bgcolor: cardColors[index % cardColors.length],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '10px',
                    flexGrow: 1,
                    maxWidth: 360,
                    margin: 2,
                    cursor: 'pointer',
                    
                  }}
                  key={index}
             >  
        
            <Box sx={{ p: 2,  }}  onClick={() => {
              navigate(`/project/${Pro.id}`);
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography gutterBottom variant="h5" component="div" fontWeight={900} sx={{ display:'flex',alignItems:"center",}}>
                  <StickyNote2Icon/>
                {Pro.title.substring(0, 20)} 
                {Pro.title.length > 20 && "..." }
                </Typography>
                        {Pro.status === "new" && (
                            <FiberNewIcon fontSize="large" />
                          )}
              </Stack>
              <Divider />
              <Typography color="text.secondary" variant="body2" marginTop={2} fontWeight={600}>
                {Pro.description.substring(0, 150)} 
                {Pro.description.length > 100 && "..." }
              </Typography>
              
              <Stack direction="row" spacing={1} marginTop={3}>
                <AvatarGroup>
                {Pro.supervisorIds.map((SId) => {
                  const user = users.find((user) => user.id === SId);
                  if (user) {
                    const Fullname = `${user.firstName} ${user.lastName}`;
                    return <Tooltip title={Fullname}><Avatar {...stringAvatar(Fullname)} /></Tooltip>;
                  } else {
                    return null;
                  }
                })}
                </AvatarGroup>
              </Stack>
            </Box>
            <Box sx={{ p: 2 , display:ds}}  >
            <Divider />
            <Stack direction="row" spacing={2} justifyContent="end" marginTop={2}>
                {!isSmallScreen && (
                  <>
                    <Button variant="outlined" color="error">
                      Refuse
                    </Button>
                    <Button variant="contained" color="success">
                      Accepte
                    </Button>
                  </>
                )}
                {isSmallScreen && (
                  <>
                    <Button variant="outlined" color="error">
                      <CloseIcon />
                    </Button>
                    <Button variant="contained" color="success">
                      <DoneOutlineIcon />
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
            </Box>
          </Card>
      ))}
    </div>
  );
            }
}

export default Projects;