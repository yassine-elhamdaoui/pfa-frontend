import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArticleIcon from "@mui/icons-material/Article";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from '@mui/icons-material/Delete';
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, IconButton, Menu, MenuItem, Skeleton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Reorder } from "framer-motion";
import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import CreateModifyStoryDialog from '../../components/dialogs/CreateModifyStoryDialog';
import CreateSprintDialog from '../../components/dialogs/CreateSprintDialog';
import CreateStoryDialog from '../../components/dialogs/CreateStoryDialog';
import ModifySprint from '../../components/dialogs/ModifySprint';
import { AffecteToSprint, Affectedevelop, DeleteSprint, DeleteStory, closesprint, getBacklog, getSprint, removefromsprint } from '../../services/backLogService';
import { getProjectById } from '../../services/projectService';
import { getTeamById } from '../../services/teamService';
import { stringAvatar } from '../../utils/generalUtils';
import { hasRole } from '../../utils/userUtiles';
import 'ldrs/hourglass'

function BackLog() {
  const description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis egetsit amet blandit leo lobortis egetsit amet blandit leo lobortis eget.";
  const isRespo =hasRole("ROLE_RESPONSIBLE");
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('md'));
  const isbigScreen = useMediaQuery(useTheme().breakpoints.down('lg'));
  const mode =localStorage.getItem('mode');
  const initialItems = [
    { id: 1, name: "User 1", description: description,Status:'Done',priority:12,nameDev: "Developer1 de"},
    { id: 2, name: "User 2", description: description ,Status:'To Do',priority:5,nameDev: "Developer1 de"},
    { id: 3, name: "User 3", description: description ,Status:'In Progress',priority:8,nameDev: "Developer1 ed"},
    { id: 4, name: "User 4", description: description ,Status:'Done',priority:10,nameDev: "Developer1 ed"}
  ];
  
  const [items, setItems] = useState(initialItems)
  const [item2, setItem2] = useState(initialItems)

  const [anchorEl, setAnchorEl] = useState({});

  const [backlogShow,setbacklogShow]=useState();
  const [SprintShow,setSprintShow]=useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const teamId = localStorage.getItem("team");
  const token = localStorage.getItem("token");
  const [backlogData , setBacklogData]=useState(null);
  const [SprintData , setSprintData]=useState([]);
  const [Membres , setMembres]=useState([]);
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false);
  const [snackbarDeleteMessage, setsnackbarDeleteMessage] = useState('');
  const [backlogID ,setBacklogID]=useState();
  const [projectID ,setprojectID]=useState();
  const [loading ,setloading]=useState();

  const [anchorElArray, setAnchorElArray] = useState(new Array(Membres.length).fill(null));
  const[reorder,setReorder]=useState(false);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const monthNames = [
      "janv", "fév", "mars", "avr", "mai", "juin",
      "juil", "août", "sept", "oct", "nov", "déc"
    ];
    const formattedDate = dayOfMonth + ' ' + monthNames[month];
  
    return formattedDate;
  }

 
  //////////Menu 1////////////////////////
  const handleFilterClick = (event, itemId) => {
    setAnchorEl({ ...anchorEl, [itemId]: event.currentTarget });
  };
  const handleClose = (itemId) => {
    setAnchorEl({ ...anchorEl, [itemId]: null });
  };
  const handleMenuItemClick =async (Devid, itemId) => {
  
    try {
      
      const resp = await Affectedevelop(itemId,Devid,token);
      
    } catch (error) {
      console.error("Error ",error)
      setsnackbarDeleteMessage('Error Affecting dev to user. Please try again.');
    }finally{setReorder(prev => !prev)}
    
    
    handleClose(itemId);
  };
/////////////Menu 2////////////////////////
const [anchorE2, setAnchorE2] = useState({});
  
  const handleClick2 = (event,storyid) => {
    
    setAnchorE2({ ...anchorE2, [storyid]: event.currentTarget });
  };
  const handleClose2 = (storyid) => {
    // const selectedStatus = Status.find(item => item.label === event.target.innerText);

    
    setAnchorE2({ ...anchorE2, [storyid]: null });
  };
//////////////////////////////////
useEffect(() => {
   const fetchteam = async ()=>{

    try {
      setloading(true);
      const teaminfo =await getTeamById(teamId,token );
      
      console.log(teaminfo);
      setprojectID(teaminfo.projectId)
      setMembres(teaminfo.members)
      const fetchProject = async ()=>{
        try {
          setloading(true);
    
          const Projectinfo = await getProjectById(teaminfo.projectId,token );
          
         
         const fetchBacklog = async ()=>{
          try {
            setloading(true);
      
            const Backloginfo = await getBacklog(Projectinfo.backlog,token );
            console.log(Backloginfo);
            setBacklogData(Backloginfo);
              setBacklogID(Backloginfo.id);
            if (Backloginfo.userStories[0]==null) {
              setbacklogShow(false);
            } else {
              setbacklogShow(true);
              
            }
            
          } catch (error) {
            console.error("Error fetching Backlog",error);
          }finally{
            setloading(false);
      
          }
          
        
          }
        
      
          fetchBacklog();
          
          
        } catch (error) {
          console.error("Error fetching Team",error);
        }finally{
          setloading(false);
        }
      
        }
    
        fetchProject();
        const fetchSprint = async ()=>{
          try {
            setloading(true);
            // const sprintinfo = await getSprint(teaminfo.projectId,token );
            // console.log(sprintinfo);
           setSprintData(await getSprint(teaminfo.projectId,token ));
            
      
            if (sprintinfo.length!=0) {
              setSprintShow(true);
            }
            
          } catch (error) {
            console.error("Error fetching Sprint",error);
          }finally{
            setloading(false);
          }
          
        
          }
      
          fetchSprint();
    } catch (error) {
      console.error("Error fetching Team",error);
    }finally{
      setloading(false);

    }
  
    }

   fetchteam();

  
  



}, [reorder]);



//////////////////////////////////////////HandleSprintDialog/////////////////////////
const [SprintAmodify, setSprintAmodify] = useState(null);
const [Modifysprintopen,setModifysprintopen]=useState(null);
const [SprintDialogOpen, setSprintDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setSprintDialogOpen(true);
  };
  const handleModalClose=()=>{
    setSprintDialogOpen(false);
  }
  //////////////////////////////////////////////HandleStoryDialog///////////////////////////////
  const [StoryDialogOpen, setStoryDialogOpen] = useState(false);
  const [StoryModifyDialogOpen, setStoryModifyDialogOpen] = useState(false);

  const handleClickOpenStory = () => {
  
    setStoryDialogOpen(true);
  };
  const handleModalCloseStory=()=>{
    setStoryDialogOpen(false);
    setStoryModifyDialogOpen(false);
    setStoryAmodify(false);
    setModifysprintopen(false)
  }
  ///////////////////////////////////handle CreateBacklog///////////////////////////////
  const handleDeleteConfirmation = async(id)=>{
    try {
      const resp = await DeleteStory(id,token);
      setsnackbarDeleteMessage('Story deleted successfully.');
      setSnackbarDeleteOpen(true);
    } catch (error) {
       console.error("Error ",error)
       setsnackbarDeleteMessage('Error deleting story. Please try again.');
       setSnackbarDeleteOpen(true);
    }finally{
      setDeleteDialogOpen(false);
      setReorder(prev => !prev);
    }
}
const handleSnackbarDeleteClose = () => {
  setSnackbarDeleteOpen(false);
};
const [StoryAmodify, setStoryAmodify] = useState(null);

const handleModifyStory = (story) => {
    setStoryAmodify(story);
    setStoryModifyDialogOpen(true);
   
};

const handleModifySprint= (sprint) => {
    setSprintAmodify(sprint);
    setModifysprintopen(true);
   
};
const [StoryIdDelete,setStoryIdDelete]=useState();
const Deletestory =(id)=>{
  setStoryIdDelete(id);
  setDeleteDialogOpen(true);
}
console.log(SprintData);

const handleaffectTosprint =async(id,sprintid)=>{
  try {
    
    const resp = await AffecteToSprint(id,sprintid,token);
    
  } catch (error) {
    console.error("Error ",error)
    setsnackbarDeleteMessage('Error Affecting to Sprint. Please try again.');
  }
  finally{
    handleClose2(id);
    setReorder(prev => !prev);
  }
}



// Handle close for closing menu

const handleremovefromSprint =async(id)=>{
  try {
    
    const resp = await removefromsprint(id,token);
    
  } catch (error) {
    console.error("Error ",error)
    setsnackbarDeleteMessage('Error Affecting dev to user. Please try again.');
  }finally{setReorder(prev => !prev)}
}
const Endsprint =async(sprintid)=>{
  try {

    const respo = await closesprint(sprintid,token);
    
  } catch (error) {
    console.error("Error ",error)
      setsnackbarDeleteMessage('Error close  Sprint. Please try again.');
    
  }finally{setReorder(prev => !prev)}
}
const[massege,setmessage]=useState('');
const[loadingDialogue,setloadingDialogue]=useState(false);
const[openDeleteDialogue,setopenDeleteDialogue]=useState(false);
const[idSprintDelete,setidSprintDelete]=useState(null);
const Delete =(id)=>{
  setmessage('Are you sure you want to delete this Sprint ?')
  setidSprintDelete(id);
  setopenDeleteDialogue(true);
  

}
const removeSprint =async(sprintid)=>{

try {

  const respo = await DeleteSprint(sprintid,token);
  
} catch (error) {
  console.error("Error ",error)
    setsnackbarDeleteMessage('Error Delete  Sprint. Please try again.');
  
}finally{setReorder(prev => !prev);setloadingDialogue(false);}

}
// Check if a specific menu is open
const isOpen = (index) => {
    return Boolean(anchorElArray[index]);
};
 const Priorityicon =(prioritu)=>{
  if (prioritu >= 0 && prioritu <= 5) {
    return(<KeyboardDoubleArrowDownIcon sx={{ color: 'green' }} />)
  } else if (prioritu > 5 && prioritu <= 10) {
    return(<DensityMediumIcon sx={{ color: 'rgb(235,144,46)' }} />)
  } else if (prioritu > 10 && prioritu <= 15) {
    return(<KeyboardDoubleArrowUpIcon sx={{ color: 'red' }} />)
  } 
 }
const Statuticon =(status)=>{
  if (status =='To Do') {
    return(<ArticleIcon sx={{color:'rgb(241,192,119)'}}/>)
  } else if (status=='In Progress') {
    return(<AutoModeIcon sx={{color:'rgb(119,205,241)'}}/>)
  } else if (status=='Done') {
    return(<CheckCircleOutlineIcon sx={{color:'green'}} />)
  }
}
if (loading) {
  return(
    <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', 
        }}
    
    >
          <l-hourglass
            size="150"
            bg-opacity="0.1"
            speed="1.75"
            color="#92ABD3" 
          ></l-hourglass>
    </Box>
  )
} else {
  return (
    <>

    <Box  >
    

 

    <Box
     sx={{
      overflow:'scroll',
      scrollbarWidth:'none',
      '&::-webkit-scrollbar': {
        display: 'none', 
      },
      msOverflowStyle: 'none',
    }}
my={4}
// display="flex"
// alignItems="center"
gap={4}
p={2}

>
  {SprintData.filter(sprint=>sprint.closed===false).length===0&&
     <Alert severity="info" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
     <AlertTitle>No Sprints Created Yet</AlertTitle>
     <Typography variant="body2">It looks like you haven't created any sprints yet. Click the button below to create your first sprint.</Typography>
   </Alert>}
  {SprintData.filter(sprint=>sprint.closed===false).map((sprint)=>(

    <Accordion 
    sx={{minWidth:800,marginBottom:.5}}
    >
<AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              
            >
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>

                <div style={{display:'flex', alignItems:'center' }}>
                    <Typography sx={{fontWeight:900,marginRight:5 }} >
                    {sprint.name}
                    </Typography> 
                    <Typography style={{marginRight:20}} >
                    ({sprint.userStories.length})
                    </Typography>
                  <Typography style={{marginRight:20}}>{formatDate(sprint.starDate)} - {formatDate(sprint.endDate)} </Typography>
                    
                    <Typography>" {sprint.description.substring(0,80)}{sprint.description.length>80 && '...'}"</Typography>
                </div>  
                <div>
                    {isRespo&&<Button  variant="outlined" color="success" onClick={()=>Endsprint(sprint.id)}>Terminer Sprint</Button>}
                    {!isRespo&&<Button disabled variant="outlined" color="success" onClick={()=>Endsprint(sprint.id)}>Terminer Sprint</Button>}
                    

                    <Tooltip title='Modify'> <Button onClick={()=>handleModifySprint(sprint)} ><EditIcon/> </Button> </Tooltip>
                   
                    <Tooltip title='Delete'><Button onClick={()=>Delete(sprint.id)}  ><CancelOutlinedIcon/></Button> </Tooltip>
                  </div>  
                </div>  

          </AccordionSummary>
          <AccordionDetails>
          <Reorder.Group axis="y" values={sprint.userStories} onReorder={setItems} >
{sprint.userStories.length==0&&

  <Alert severity="info"style={{display:'flex', justifyContent:'center', width:'100%'}}>
  <AlertTitle>No userStories Affect yet.</AlertTitle>
  
</Alert>

}            
{sprint.userStories.map((item) => (
  <Reorder.Item key={item.id} value={item} style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
    margin: 5,
    borderRight: '4mm ridge rgba(211, 220, 50, .6)',
    backgroundColor: mode === 'dark' ?'rgba(247, 247, 247 , .1)':"rgba(249, 252, 239)",
    borderRadius: 5,
    cursor:'pointer',
   height:50
  }}

  >
                <SchoolIcon sx={{color:"green", marginRight:2}}></SchoolIcon>
                 <Typography sx={{fontWeight:900}}>{item.name}</Typography>
            <Typography>
            {isbigScreen&&item.description.substring(0,50)}
              {!isbigScreen&&item.description.length>100 && item.description.substring(0,100)}
              {item.description.length>100 && '...'}
            </Typography>
               <Typography
                  id="fade-button"
                  
                  aria-haspopup="true"
                 

                >
                 
                  <Tooltip title={item.status}>{Statuticon(item.status)}</Tooltip>
                </Typography>

                
                <Typography sx={{display:'flex',alignItems:'center',justifyContent:'center',borderRadius: 4,width:20} }> <Tooltip title={item.priority}>{Priorityicon(item.priority)}  </Tooltip></Typography>
    

    <IconButton
      aria-controls="filter-menu"
      aria-haspopup="true"
     onClick={(event) => handleFilterClick(event, item.id)}

    >
      {item.developer ==null&&<Avatar><PersonIcon /></Avatar>}
      {item.developer !=null&&<Avatar {...stringAvatar(item.developer.firstName+' '+item.developer.lastName)}></Avatar>}
      
    </IconButton>
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
                      <MenuItem onClick={() => handleMenuItemClick(0,item.id)}>"Non assigné"</MenuItem>
    {Membres.map(member=>(<MenuItem onClick={() => handleMenuItemClick(member.id,item.id)}>{member.firstName} {member.lastName}</MenuItem>))}
           
    
  </Menu>

  <Tooltip title='Modify'> <Button onClick={()=>handleModifyStory(item)}><EditIcon/> </Button> </Tooltip>
  <Tooltip title='Delete'><Button onClick={()=>handleremovefromSprint(item.id)} ><DeleteIcon/></Button> </Tooltip> 
  
    
  </Reorder.Item>
))}
</Reorder.Group>


          </AccordionDetails>
  </Accordion>
  ))}



</Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" endIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>
          Create Sprint
        </Button>
    </Box>
    <CreateSprintDialog
     setreorder={setReorder}
      projectId={projectID}
      token={token}
      SprintDialogOpen={SprintDialogOpen}
      handleModalClose={handleModalClose}
    >

    </CreateSprintDialog>
    </Box>
    {/* ///////////////////////////BackLog///////////////////////////////////////////////////////// */}
    
    <Box 
    gap={4}
      p={2}
      sx={{marginTop:10, border: 'dashed gray',borderRadius: '10px', minWidth:'100%',
      }}>
 
    <Box
      my={4}
      // display="flex"
      // alignItems="center"
      sx={{ minWidth:'100%',overflow:'scroll'
        ,
      scrollbarWidth:'none',
      '&::-webkit-scrollbar': {
        display: 'none', 
      },
      msOverflowStyle: 'none',
       }}
      >
      {!backlogShow &&
      
     <div style={{display:'flex', alignItems:'center' }}>
      <Typography style={{fontWeight:900,marginRight:15}} >
       BackLog
      </Typography> 
      
      <Typography style={{marginRight:5}} >
       ( {0} Stories)
      </Typography>
      
      
      </div>}
      
      {backlogShow &&
      <>
     <div style={{display:'flex', alignItems:'center',marginBottom:20 }}>
      <Typography style={{fontWeight:900,marginRight:15}} >
       BackLog
      </Typography>
      
      <Typography style={{marginRight:5}} >
       ( {backlogData.userStories.filter(story => story.sprintId === null).length} Stories)
      </Typography>
      
      </div>
      
         <Reorder.Group axis="y" values={backlogData.userStories} onReorder ={setItem2}>
          
         { backlogData.userStories.filter(story => story.sprintId === null)
.map((story) => (
  
         <Reorder.Item 
         key={story.id} 
         value={story}
         style={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: 10,
          margin: 5,
          borderRight: '4mm ridge rgba(211, 220, 50, .6)',
          backgroundColor: mode === 'dark' ?'rgba(247, 247, 247 , .1)':"#F1FCEF",
          borderRadius: 5,
           cursor:'pointer',
           height:50,

          minWidth:845
          
         }}
        //  onHoverStart={() => setHoveredItem(story)}
        //  onHoverEnd={() => setHoveredItem(null)}
       >
           
                <Typography sx={{display:"flex",alignItems:'center',fontWeight:900}} >
                     <SchoolIcon sx={{color:"green", marginRight:2}}></SchoolIcon>
                     {story.name}
                     
                 </Typography>
     
                     <Tooltip title={story.description} >
                     <Typography >
                         
          
                         {isbigScreen&&story.description.substring(0,50)}
                         {!isbigScreen&&!isSmallScreen&&story.description.substring(0,110)}
                         {story.description.length>20&&"..."}
                         
                       </Typography>
                       </Tooltip>
                       <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                                {Statuticon(story.status)}
                                {!isSmallScreen&&<div  style={{marginLeft:5}}>{story.status}</div> }
                               
                              </Typography>
                              <Tooltip title={`Priority: ${story.priority}`}>
                              <Typography sx={{display: 'flex', justifyContent: 'center'}}>
                                {Priorityicon(story.priority)}
                                
                              </Typography>
                            </Tooltip>

                        

                           
                           
                                       
           
           <Tooltip title='Modify'> <Button onClick={()=>handleModifyStory(story)}><EditIcon/> </Button> </Tooltip>
            <Tooltip title='Delete'><Button  onClick={() => Deletestory(story.id)}><DeleteIcon/></Button> </Tooltip> 
            <Tooltip title='Affecter to Sprint'><Button  onClick={(event)=>handleClick2(event,story.id)}><CheckCircleOutlineIcon sx={{ color: 'green' }} /></Button> </Tooltip> 
            


            <Menu
                  id="basic-menu"
                  anchorEl={anchorE2[story.id]}
                  open={Boolean(anchorE2[story.id])}
                  onClose={()=>handleClose2(story.id)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {SprintData.filter(sprint => sprint.closed===false).length==0&&<MenuItem>No sprint Create Yet </MenuItem>}
                  {SprintData.filter(sprint => sprint.closed===false).map((sprint)=>(<MenuItem onClick={()=>handleaffectTosprint(story.id,sprint.id)}>{sprint.name}</MenuItem>))}
                  
                 
      </Menu>



            
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                  <DialogContentText>Are you sure you want to delete this Story ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                  <Button onClick={()=>handleDeleteConfirmation(StoryIdDelete)} color="error">Delete</Button>
                </DialogActions>
              </Dialog>
              
         </Reorder.Item>
         ))}
         
         </Reorder.Group> 
         

         </>}
         {!backlogShow &&
         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
           <Alert severity="info"style={{display:'flex', justifyContent:'center', width:'100%'}}>
            <AlertTitle> Your Backlog is empty.</AlertTitle>
            
          </Alert>
          </Box>
         }
         
         
    
    
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end'  }}>
            <Button variant="outlined" endIcon={<AddCircleOutlineIcon />} onClick={handleClickOpenStory}>
              Create Story
            </Button>
        </Box>

               <CreateStoryDialog
                        setreorder={setReorder}
                        token ={token}
                        backlogId = {backlogID}
                        StoryDialogOpen={StoryDialogOpen}
                        handleModalCloseStory={handleModalCloseStory}
                        setSnackbarOpen={snackbarDeleteOpen}
                        setSnackbarMessage={snackbarDeleteMessage}

                    /> 

              <CreateModifyStoryDialog
                  setreorder={setReorder}
                    Story={StoryAmodify}
                    token ={token}
                  StoryDialogOpen={StoryModifyDialogOpen}
                  handleModalCloseStory={handleModalCloseStory}
                  setSnackbarOpen={setsnackbarDeleteMessage}
                  setSnackbarMessage={setsnackbarDeleteMessage}
              />
     
               <ModifySprint
                     setreorder={setReorder}
                     sprint={SprintAmodify}
                     token={token}
                     open={Modifysprintopen}
                     handleModalClosesprint={handleModalCloseStory}
                   
                   
                   />
                <Snackbar
                      open={snackbarDeleteOpen}
                      autoHideDuration={6000}
                      onClose={handleSnackbarDeleteClose}
                      message={snackbarDeleteMessage}
                />
                <ConfirmationDialog
                  id={idSprintDelete}
                  message={massege}
                  openDialog={openDeleteDialogue}
                  setOpenDialog={setopenDeleteDialogue}
                  handleConfirmClick={removeSprint}
                  setLoading={setloadingDialogue}
                  loading={loadingDialogue}
                />
      

    


   
    
   
    </Box>
    
    </>
  )
}

  
}

export default BackLog









