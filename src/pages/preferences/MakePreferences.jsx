// import { Typography } from '@mui/material'
// import React from 'react'

// function MakePreferences() {
//   return (
//     <div>
//       <Typography variant='h3'>makePreferences</Typography>

//     </div>
//   )
// }

// export default MakePreferences


// import React, { useEffect, useState } from 'react';
// import { Typography, TextField, Button, Box, Autocomplete } from '@mui/material';
// import { getAllProjects } from '../../services/projectService'; // Adjust the import path to where your API functions are defined

// function MakePreferences() {
//     const [projects, setProjects] = useState([]);
//     const [preferences, setPreferences] = useState({});
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         const loadProjects = async () => {
//             const fetchedProjects = await getAllProjects(token);
//             setProjects(fetchedProjects);
//             console.log(fetchedProjects)
//             initializePreferences(fetchedProjects);
//         };
//         loadProjects();
//     }, [token]);

//     const initializePreferences = (projects) => {
//         const initialPrefs = {};
//         projects.forEach((project, index) => {
//             console.log(project)
//             initialPrefs[project.id] = index + 1; // Assigns a starting rank based on index
//         });
//         // console.log(initialPrefs)
//         setPreferences(initialPrefs);
//     };

//     const handleRankChange = (projectId, newRank) => {
//         setPreferences(prev => ({
//             ...prev,
//             [projectId]: newRank
//         }));
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         console.log('Preferences to submit:', preferences);
//         // Submit these preferences to your API
//     };

//     return (
//         <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
//             <Typography variant="h3" gutterBottom>
//                 Set Project Preferences
//             </Typography>
//             <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//                 {projects.map((project, index) => (
//                     <Autocomplete
//                         key={project.id}
//                         disablePortal
//                         options={Array.from({length: projects.length}, (_, i) => i + 1)}
//                         value={preferences[project.id]}
//                         onChange={(event, newValue) => handleRankChange(project.id, newValue)}
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 label={`${project.title} Rank`}
//                                 variant="outlined"
//                                 fullWidth
//                                 margin="normal"
//                             />
//                         )}
//                     />
//                 ))}
//                 <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//                     Submit Preferences
//                 </Button>
//             </Box>
//         </Box>
//     );
// }

// export default MakePreferences;

import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box ,Autocomplete} from '@mui/material';
import { getAllProjects } from '../../services/projectService'; 
import { Snackbar, Alert } from '@mui/material';

function MakePreferences() {


  ///create the  snackbar for the result of submit team__preferemce operation
  
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);


  const [projects, setProjects] = useState([]);
  const [projectSelections, setProjectSelections] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
      const loadProjects = async () => {
          const fetchedProjects = await getAllProjects(token);
          setProjects(fetchedProjects);
          // Initialize project selections with null for each project
          setProjectSelections(Array(fetchedProjects.length).fill(null));
      };
      loadProjects();
  }, [token]);

  const handleSelectionChange = (value, index) => {
      const updatedSelections = [...projectSelections];
      updatedSelections[index] = value;
      setProjectSelections(updatedSelections);
  };

  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     const preferences = {};
  //     // Convert project names back to IDs and assign ranks
  //     projectSelections.forEach((selection, index) => {
  //         if (selection) {
  //             preferences[selection.id] = index + 1;
  //         }
  //     });
  //     console.log('Submitted Preferences:', preferences);
  //     // Submit these preferences to  API


  //     const submitPrferencesToAPI=async(preferences,token)=>{
  //       const response=await fetch("http://localhost:8080/api/projects/preferences",{
  //           method:'POST',
  //           headers:{
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //           body:JSON.stringify(preferences)
  //       })
  //     }
  //     // console.log(JSON.stringify(preferences))
  //     submitPrferencesToAPI(preferences,token)

  // };




  const handleSubmit = async (event) => {
    event.preventDefault();
    const preferences = {};
    projectSelections.forEach((selection, index) => {
        if (selection) {
            preferences[selection.id] = index + 1;
        }
    });

    try {
        const response = await fetch("http://localhost:8080/api/projects/preferences", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(preferences)
        });

        if (!response.ok) throw new Error(await response.text());
        setSnackPack((prev) => [...prev, { message: 'Preferences submitted successfully!', key: new Date().getTime(), severity: 'success' }]);
    } catch (error) {
        setSnackPack((prev) => [...prev, { message: error.message, key: new Date().getTime(), severity: 'error' }]);
    }
};

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpen(false);
};

const handleExited = () => {
  setMessageInfo(undefined);
};




  return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
          <Typography variant="h3" gutterBottom>
              Set Project Preferences
          </Typography>
          <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            message={messageInfo ? messageInfo.message : undefined}
          >
            {messageInfo ? <Alert onClose={handleClose} severity={messageInfo.severity} sx={{ width: '100%' }}>
              {messageInfo.message}
            </Alert> : null}
          </Snackbar>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {projectSelections.map((selection, index) => (
                  <Autocomplete
                      key={index}
                      disablePortal
                      options={projects}
                      getOptionLabel={(option) => option.title}
                      value={selection}
                      onChange={(event, newValue) => handleSelectionChange(newValue, index)}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              label={`Project Preference ${index + 1}`}
                              variant="outlined"
                              fullWidth
                          />
                      )}
                      sx={{ mb: 2 }}
                  />
              ))}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Submit Preferences
              </Button>
          </Box>
      </Box>
  );
}

export default MakePreferences;
