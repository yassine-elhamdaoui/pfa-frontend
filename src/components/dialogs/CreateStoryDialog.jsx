import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { StyledDialog } from './createProjectDialog';
import { CreateStory } from '../../services/backLogService';
import { LoadingButton } from '@mui/lab';

export default function CreateStoryDialog({  setreorder,token, backlogId, StoryDialogOpen, handleModalCloseStory, setSnackbarOpen, setSnackbarMessage }) {
 
 
  // State variables for form data
  const [storyName, setStoryName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [storyPoints, setStoryPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    priority: 0,
    storyPoints: 0,
    backlogId: 0
  });
 
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      
      await CreateStory(data, token);
      setSnackbarMessage('Story created successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving user story:', error);
      setSnackbarMessage('The story was not created');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleModalCloseStory();
      // setreorder(prev=>!prev);
      
    }
    handleModalCloseStory();
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
      backlogId: backlogId
    }));
  };

  return (
    <>
     
        <div>
          <StyledDialog
            fullWidth={true}
            maxWidth={'xs'}
            open={StoryDialogOpen}
            onClose={handleModalCloseStory}
            PaperProps={{
              component: 'form',
              onSubmit: handleSubmit,
            }}
          >
            <DialogTitle>Create Sprint</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill in the details to create a new Story.
              </DialogContentText>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Story Name"
                  type="text"
                  value={data.name}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder='EX : User Story 1'
                  
                />
                <TextField
                  required
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={data.description}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  required
                  margin="dense"
                  id="priority"
                  name="priority"
                  label="Priority"
                  type="number"
                  value={data.priority}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  required
                  margin="dense"
                  id="storyPoints"
                  name="storyPoints"
                  label="Story Points"
                  type="number"
                  value={data.storyPoints}
                  onChange={handleChange}
                  variant="outlined"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalCloseStory} variant="outlined">Cancel</Button>
              <LoadingButton
                type="submit"
                loading={loading}
                loadingIndicator="creating..."
                sx={{ paddingLeft: "15px", paddingRight: "15px" }}
                variant="contained"
              >
                <span>Create Story</span>
              </LoadingButton>

            </DialogActions>
          </StyledDialog>
        </div>
     
                  
                 
    </>
  );
}
