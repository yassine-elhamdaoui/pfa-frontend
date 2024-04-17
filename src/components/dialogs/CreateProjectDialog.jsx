import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef, useEffect, useState } from "react";
import { Alert, Autocomplete, Avatar, AvatarGroup, Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Snackbar, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { deepOrange, green } from "@mui/material/colors";
import PersonIcon from '@mui/icons-material/Person';
import { LoadingButton } from "@mui/lab";
import Addproject from "../../services/projectService";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
// eslint-disable-next-line react/prop-types
function CreateProjectDialog({ projectDialogOpen, handleModalClose }) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const[isSupervisor , setSupervisor]=useState([]);
  const[Sdata , setdata]=useState([]);
  const [projectType, setProjectType] = useState('new');
  const [display, setDisplay] = useState('none');
  const jwtToken =localStorage.getItem("token");
  // const jwtToken ='eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiLCJST0xFX1NVUEVSVklTT1IiXSwic3ViIjoiYXlvdWJ5YWtvdWJpMjIyQGdtYWlsLmNvbSIsImlhdCI6MTcxMzEyODUwNSwiZXhwIjoxNzEzMjE0OTA1fQ.cioq2vRrWJjwrEECe-QssF5vgcRXQjeAA7sQzkaFiKk';
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    techStack: '',
    codeLink: '',
    branch: 1,
    supervisors: [],
    files:[],
    report:null
   
  });
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [selectedTech, setselectedTech] = useState([]);

  //////////////////////////fetch USers/////////////////////

  useEffect(()=>{async function fetchUsers() {
    try {
          const response = await fetch('http://localhost:8081/api/users', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setdata(data);
      
      const supervisors = data
      .filter(user => user.authorities.some(authority => authority.authority === 'ROLE_SUPERVISOR'))
      .map(user => ({
        Fullname: user.firstName +' '+ user.lastName
      }));
      setSupervisor(supervisors);
      
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  fetchUsers();}
  ,[]) ;

//////////////////////////Tech Stack///////////////
  const tech = [
    { title: 'JavaScript' },
    { title: 'React' },
    { title: 'Node.js' },
    { title: 'Express.js' },
    { title: 'Vue.js' },
    { title: 'Angular'},
    { title: 'Python' },
    { title: 'Django' },
    { title: 'Ruby on Rails'},
    { title: 'React Native' },
    { title: 'Flutter'  },
    { title: 'MongoDB' },
    { title: 'MySQL' },
    { title: 'PostgreSQL' },
    { title: 'Git'},
    { title: 'Docker'},
    { title: 'Kubernetes' },
    { title: 'Symgony' },
    { title: 'SpringBoot' }
  ];
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  const handleProjectTypeChange = (event) => {
    setProjectType(event.target.value);
    if (event.target.value === 'old') {
      setDisplay("block"); 
      
    }
    else {
      setDisplay("none")
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  //////////////////////////////////save Data////////////////
   

  const handleChange = (event) => {
    
    setFormData({ ...formData, title: event.target.value });
  };

  const handleDescriptionChange = (event) => {
    setFormData({ ...formData, description: event.target.value });
  };
  const handlestatusChange = (event) => {
    setFormData({ ...formData, status:  event.target.value });
  };
  const handleDateChange = (event) => {
    // setFormData({ ...formData, year: event.target.value });
  };
  // const handlebranchChanges = (event) => {
  //   setFormData({ ...formData, branch: event.target.value });
  // };

  const handleCodelinkChange = (event) => {
    if (projectType=="new") {
      setFormData({...formData,codeLink:null})
    } else {
      
      setFormData({ ...formData, codeLink: event.target.value });
    }
  };
  const handleSupervisorChange = (event,value) => {
    setSelectedSupervisors(value); 
  };
  const handleTechChange = (event,value) => {
    setselectedTech(value); 
  };

  const handleReportFileChange = (event) => {
    setFormData({ ...formData, report: event.target.files[0] });
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData({
      ...formData,
      files: files.slice(0, 10),
    });
    ;
  };
/////////////Sending //////////////////
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const sentence = selectedTech.map(tech => tech.title).join(" , ");
    const idAndFullname = Sdata
      .filter(user => user.authorities.some(authority => authority.authority === 'ROLE_SUPERVISOR'))
      .map(user => ({
        Fullname: user.firstName +' '+ user.lastName,
        UserId:  user.id
        
      }));
     
      const ids = [];

          idAndFullname.forEach(supervisor => {
              selectedSupervisors.forEach(sup=>{
                if (sup.Fullname===supervisor.Fullname) {
                  ids.push(supervisor.UserId);
              }
              })
              
          });
      
      

    const updatedFormData = {
      ...formData,
      techStack: sentence,
      supervisors: ids
    };
    
    setFormData(updatedFormData);
   
      const form = new FormData();
      console.log(updatedFormData);
      form.append("title",updatedFormData.title);
      // Append each property to formData
      Object.entries(updatedFormData).forEach(([key, value]) => {
        
       
        if (Array.isArray(value)) {  // If the property is an array
          // Append each element in the array
          value.forEach((element, index) => {
            console.log(key);
            form.append(`${key}[${index}]`, element);
          });
        } else {
          console.log(key);
          form.append(key, value);
        }
      });
      
      console.log(form.get("title"));
      console.log(form.get("description"));
      console.log(form.get("status"));
      console.log(form.get("codeLink"));
      console.log(form.get("files[0]"));
      console.log(form.get("report"));
      console.log(form.get("supervisors[0]"));
      console.log(form.get("branch"));
   

    setLoading(true);
    const response = await Addproject(jwtToken,form,setSnackbarMessage,setSnackbarOpen,setLoading);
   
    
  };
  ///////////////////////////////////////////////////////////
  return (
    <Dialog
      open={projectDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleModalClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle align="center"  fontStyle={"italic"} fontSize={30}>{"Create Project"}</DialogTitle>

      <form onSubmit={handleFormSubmit}>
      <DialogContent>
        
         <RadioGroup row value={projectType} onChange={handleProjectTypeChange}>
        <FormControlLabel value="new" control={<Radio />} label="New Project" />
        <FormControlLabel value="old" control={<Radio />} label="Old Project" />
          </RadioGroup>
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Title "
          type="text"
          // value={formData.title}
          onChange={handleChange}
          variant="outlined"
          // InputLabelProps={{ shrink: true }}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="description"
          name="description"
          label="Description "
          type="text"
          fullWidth
          variant="outlined"
          // value={formData.description}
          onChange={handleDescriptionChange}
          // InputLabelProps={{ shrink: true }}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="status"
          name="status"
          label="Status "
          type="text"
          fullWidth
          variant="outlined"
          // value={formData.status}
          onChange={handlestatusChange}
          InputLabelProps={{ shrink: true }}
        />
        {/* <TextField
          autoFocus
          required
          margin="normal"
          id="year"
          name="year"
          label="Year "
          type="date"
          InputLabelProps={{ shrink: true }}
          // value={formData.year}
          onChange={handleDateChange}
         
        /> */}
        <Autocomplete
          multiple
          
          id="checkboxes-tags-demo"
          options={tech}
          disableCloseOnSelect
          getOptionLabel={(option) => option.title}
          onChange={handleTechChange}
          renderOption={(props, option, { selected }) => (
                    <li {...props}  >
                       
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected} // Set the 'checked' prop to the 'selected' value
                        />
                        {option.title}
                    </li>
                )}
          style={{ width: 500 }}
          renderInput={(params) => (
                  <TextField   {...params}  label="TechStack" placeholder="TechStack" />
              )}
   
        />

        <TextField
          style={{display:display}}
          fullWidth
          autoFocus
          
          margin="normal"
          id="codeLink"
          name="codeLink"
          label="codeLink "
          type="url"
          InputLabelProps={{ shrink: true }}
          // value={formData.codeLink}
          onChange={handleCodelinkChange}
         
        />
        <TextField
         fullWidth
          autoFocus
          required
          margin="normal"
          id="branch"
          name="branch"
          label="branch "
          type="text"
          InputLabelProps={{ shrink: true }}
          // value={formData.branch}
          // onChange={handlebranchChanges}
        />
       <Autocomplete
            multiple
            id="multiple-limit-tags"
            options={isSupervisor}
            getOptionLabel={(isSupervisor) => (isSupervisor.Fullname)}
            onChange={handleSupervisorChange}
            renderOption={(props, isSupervisor, { selected }) => (
              <div style={{ display: 'flex', alignItems: 'center' }}
              {...props} color="primary">
                <div style={{margin:'10px'}}><Avatar {...stringAvatar(isSupervisor.Fullname)} /></div>
                <div>{isSupervisor.Fullname}</div>
              </div>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Supervisor" placeholder="Supervisor" sx={{ color: 'blue' }} />
            )}
            sx={{ width: '500px' }}
          />

            <TextField
                 
                fullWidth
                  autoFocus
                  required
                  margin="normal"
                  id="report"
                  name="report"
                  label="Report "
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleReportFileChange}
                />
            <input
              style={{display:display}}
              
              multiple
              
              autoFocus
              required
              margin="normal"
              id="files"
              name="files"
              label="files "
              type="file"
              
              onChange={handleFilesChange}
          />
          
          
          
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose}>Cancel</Button>
        <LoadingButton
            type="submit"
            loading={loading}
            loadingIndicator="Loading…"
            
            sx={{ mt: 3, mb: 2 }}
            variant="contained"
          >
            <span>Create</span>
          </LoadingButton>
      </DialogActions>
      </form>
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
    </Dialog>
    
  );
  
}

export default CreateProjectDialog;
