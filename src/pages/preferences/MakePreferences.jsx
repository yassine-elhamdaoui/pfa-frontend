import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box ,Autocomplete} from '@mui/material';
import { getAllProjects } from '../../services/projectService'; 
import { Snackbar, Alert } from '@mui/material';

function MakePreferences() {
    const [snackPack, setSnackPack] = useState([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);
    const [projects, setProjects] = useState([]);
    const [projectSelections, setProjectSelections] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch projects
    useEffect(() => {
        const loadProjects = async () => {
            const fetchedProjects = await getAllProjects(token);
            setProjects(fetchedProjects);
            // Initialize project selections with null for each project
            setProjectSelections(Array(fetchedProjects.length).fill(null));
        };
        loadProjects();
    }, [token]);

    // Function to handle selection changes-->when the user selects a projectthat one should not appearing in the next fields options
    const handleSelectionChange = (value, index) => {
        const updatedSelections = [...projectSelections];
        updatedSelections[index] = value;
        setProjectSelections(updatedSelections);
    };

    //  to get filtered options (for each Autocomplete field))
    const getFilteredOptions = (index) => {
        return projects.filter(proj => !projectSelections.includes(proj) || projectSelections[index] === proj);
    };

    //  to handle form submission
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

    // Snackbar exited
    const handleExited = () => {
        setMessageInfo(undefined);
    };

    ////Snackbar display
    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

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
                        options={getFilteredOptions(index)}
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
