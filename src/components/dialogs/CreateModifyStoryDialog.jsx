import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { StyledDialog } from './createProjectDialog';
import { CreateStory, ModifyStory } from '../../services/backLogService';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';

export default function CreateModifyStoryDialog({
  setRender,
  Story = {}, // default value if Story prop is not provided
  token,
  StoryDialogOpen,
  handleModalCloseStory,
  setSnackbarOpen,
  setSnackbarMessage
}) {
  // State variables for form data
  const [data, setData] = useState({
    name: '',
    description: '',
    priority: 0,
    storyPoints: 0,
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // UseEffect to initialize state with Story data
  useEffect(() => {
    if (Story) {
      setData({
        name: Story.name || '',
        description: Story.description || '',
        priority: Story.priority || 0,
        storyPoints: Story.storyPoints || 0,
      });
    }
  }, [Story]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await ModifyStory(Story.id, data, token);
      setRender(prev=>!prev);
      setSnackbarMessage('User story saved successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving user story:', error);
      setSnackbarMessage('Error saving user story');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleModalCloseStory();
      
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModifyStory = () => {
    setIsDisabled(!isDisabled);
  };

  return (
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
      <DialogTitle>Edit Story</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to edit the Story?
          <Button onClick={handleModifyStory}>
            <EditIcon />
          </Button>
        </DialogContentText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <TextField
            disabled={isDisabled}
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
          />
          <TextField
            disabled={isDisabled}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
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
          loadingIndicator="Updating..."
          sx={{ paddingLeft: "15px", paddingRight: "15px" }}
          variant="contained"
        >
          <span>Update Story</span>
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}
