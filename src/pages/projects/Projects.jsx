import DeveloperBoardOffIcon from "@mui/icons-material/DeveloperBoardOff";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import BreadCrumb from "../../components/breadCrumb/breadCrump";
import {
 
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Card,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaceHolder from "../../components/placeHolder/PlaceHolder";
import { acceptProject, getAllProjects, getYearAcademique, rejectProject } from "../../services/projectService";
import { getUsers } from "../../services/userService";
import { stringAvatar } from "../../utils/generalUtils";
import { hasRole } from "../../utils/userUtiles";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import ProjectSkeleton from "./ProjectSkeleton";
// handleFilterSelect

const mode = localStorage.getItem("mode");
const isHOB = hasRole("ROLE_HEAD_OF_BRANCH");
function Projects() {
    console.log("rerender");
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setanchorEl2] = useState(null);
    const open = Boolean(anchorEl);
    const [page,setPage]=useState(1);
    const [yearSelected,setyearSelected]=useState("2023/2024");
    const [selectedProject, setSelectedProject] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isAcceptConfirmation, setIsAcceptConfirmation] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [years,setYears]=useState([]);
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  const handleClick = (event, Pro) => {
    console.time("handleClick"); // Start measuring time
    setAnchorEl(event.currentTarget);
    setSelectedProject(Pro);
    console.log(Pro.id);
    console.timeEnd("handleClick"); // End measuring time and log the result
  };
  const handleFilterClick =(event)=>{
    setanchorEl2(event.currentTarget);
  }
  

    const handleClose = () => {
      setSelectedProject(null);
      setAnchorEl(null);
    };
    const handleFilterClose =()=>{
      console.log("closed");
      setanchorEl2(null);
    }
    const handleFilterSelect=(Year)=>{
            if (Year!==yearSelected) {
              
              console.log(Year);
              setLoading2(true)
              setyearSelected(Year);
            }   
    }

    const handlPagination =(event, page)=>{
      if (page==1) {
        setLoading(true);
      }
         setLoading3(true);
          setPage(page);
        
      
    }

  const token = localStorage.getItem("token");

const cardColors = [
  mode === "dark" ? "rgba(173, 216, 230, 0.2)" : "rgba(173, 216, 230, 0.4)",
  mode === "dark" ? "rgba(216, 191, 216, 0.2)" : "rgba(216, 191, 216, 0.4)",
  mode === "dark" ? "rgba(144, 238, 144, 0.2)" : "rgba(144, 238, 144, 0.4)",
  mode === "dark" ? "rgba(255, 255, 153, 0.2)" : "rgba(255, 255, 153, 0.4)",
  mode === "dark" ? "rgba(255, 204, 153, 0.2)" : "rgba(255, 204, 153, 0.4)",
  mode === "dark" ? "rgba(255, 182, 193, 0.2)" : "rgba(255, 182, 193, 0.4)",
  mode === "dark" ? "rgba(255, 0, 0, 0.2)" : "rgba(255, 0, 0, 0.4)",
  mode === "dark" ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 255, 0, 0.4)",
  mode === "dark" ? "rgba(0, 0, 255, 0.2)" : "rgba(0, 0, 255, 0.4)",
  mode === "dark" ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 255, 0, 0.4)",
  mode === "dark" ? "rgba(255, 0, 255, 0.2)" : "rgba(255, 0, 255, 0.4)",
  mode === "dark" ? "rgba(0, 255, 255, 0.2)" : "rgba(0, 255, 255, 0.4)",
];

useEffect(()=>{

    const fetchYears= async()=>{
      try{
        const Years = await getYearAcademique(token);
       
        setYears(Years);
    
      }
      catch (err) {
        console.error("Error fetching Users And Projects", err);
      }
    }
    fetchYears();
    
    
}
  ,[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUsers = await getUsers(token);
        setUsers(fetchUsers);

        const fetchProjects = await getAllProjects(token,yearSelected,page);
        setProjects(fetchProjects);
        console.log("/////////////////////////////////////////////////");
        console.log(fetchProjects);
        // setFilteredProjects(fetchProjects);
      } catch (err) {
        console.error("Error fetching Users And Projects", err);
      } finally {
        
        setLoading(false);
        setLoading2(false);
        setLoading3(false);
      }
    };

    fetchData();
  }, [yearSelected,page]);

  if (loading) {
    return(<ProjectSkeleton/>);
    
  }

  if (projects.length === 0 && page==1) {
    return (
      <PlaceHolder
        icon={DeveloperBoardOffIcon}
        title="No Projects Yet"
        message="no projects published at the moment"
      />
    );
  } 
  
  
  else {
    
    return (
    
      <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <BreadCrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Projects", link: "#" },
              {
                label: loading2 ? (
                  <Skeleton variant="text" width={150} height={40} />
                ) : (
                  yearSelected
                ),
                link: "#"
              }
            ]}
          />
          

            
            
          
          <IconButton
            aria-controls="filter-menu"
            aria-haspopup="true"
            onClick={handleFilterClick}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleFilterClose}
          >
            {years.map((year)=>(

                <MenuItem onClick={() => handleFilterSelect(year)}>
                  {year}
                </MenuItem>
            ))}
            
           
          </Menu>
        </Box>
      
        
        
      
        
        {loading3 ? (
                  <ProjectSkeleton/>
                ) : (
                  
                          
        
        <Grid container spacing={2} 
        style={projects.length === 0 && page > 1  ? { display: 'flex' ,justifyContent:'center'} : {}}
        >
          {projects.length === 0 && page > 1 && (
            <Box >
                     <Typography variant="h4">No more Projects</Typography>   
              </Box>        
                      )}
          {projects.map((Pro, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              gap={"10px"}
              key={Pro.id}
              sx={{ minWidth: "300px" }}
            >
              <Card
                key={Pro.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  minHeight: "250px",
                  flexGrow: 1,
                  "&:hover": {
                    boxShadow: 3, // More pronounced shadow on hover
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: cardColors[index % cardColors.length],
                    minWidth: "15px",
                  }}
                />
                <Box
                  variant="elevation"
                  sx={{
                    // bgcolor: cardColors[index % cardColors.length],
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    gap: "10px",
                    flexGrow: 1,
                    margin: 1,
                  }}
                  key={index}
                >
                  
                  <Box sx={{ p: 2 }}>
                    <Stack
                      display="flex"
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        fontWeight={900}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <StickyNote2Icon />
                        <Typography
                          variant="h5"
                          component="h2"
                          fontWeight={600}
                          onClick={() => {
                            navigate(`/projects/${Pro.id}`);
                          }}
                        >
                          {Pro.title.substring(0, 20)}
                          {Pro.title.length > 20 && "..."}
                        </Typography>
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {Pro.status === "new" && (
                          <FiberNewIcon fontSize="large" />
                        )}
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, Pro)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                    <Divider />
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      marginTop={2}
                      fontWeight={600}
                    >
                      {Pro.description.substring(0, 150)}
                      {Pro.description.length > 100 && "..."}
                    </Typography>

                    <Stack direction="row" spacing={1} paddingTop={3}>
                      <AvatarGroup>
                        {Pro.supervisorIds.map((SId) => {
                          const user = users.find((user) => user.id === SId);
                          if (user) {
                            const Fullname = `${user.firstName} ${user.lastName}`;
                            return (
                              <Tooltip key={user.id} title={Fullname}>
                                <Avatar {...stringAvatar(Fullname)} />
                              </Tooltip>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </AvatarGroup>
                    </Stack>
                  </Box>
                  
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>)
  }
        <Box sx={{ display: 'flex', justifyContent: 'center' , marginTop:2}}>
          <Pagination count={10} variant="outlined" color="primary" onChange={handlPagination} />
        </Box>
      
    
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => (
              navigate(`/projects/${selectedProject.id}`), handleClose()
            )}
          >
            View
          </MenuItem>
          {isHOB && selectedProject && !selectedProject.isPublic && (
            <MenuItem onClick={() => (setOpenDialog(true),setIsAcceptConfirmation(true))}>Accept</MenuItem>
          )}
          {isHOB && selectedProject && !selectedProject.isPublic && (
            <MenuItem
              onClick={() => (setOpenDialog(true), setIsAcceptConfirmation(false))}
            >
              Refuse
            </MenuItem>
          )}
        </Menu>
        <ConfirmationDialog
          message={
            isAcceptConfirmation
              ? "Are you sure you want to accept this project?"
              : "Are you sure you want to refuse this project?"
          }
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleConfirmClick={() =>
            isAcceptConfirmation
              ? acceptProject(
                  token,
                  selectedProject.id,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
              : rejectProject(
                  token,
                  selectedProject.id,
                  setSnackbarOpen,
                  setSnackbarMessage,
                  setConfirmLoading
                )
          }
          setLoading={setConfirmLoading}
          loading={confirmLoading}
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
      </Box>
    );
  }
}

export default Projects;
