import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { StyledDialog } from './createProjectDialog';
import { CreateStory, updateSprint } from '../../services/backLogService';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';

export default function ModifySprint({
  setRender,
  sprint = {}, // default value if Story prop is not provided
  token,
  open,
  handleModalClosesprint,
  setSnackbarOpen,
  setSnackbarMessage
}) {
  // State variables for form data
  const [data, setData] = useState({
    name: '',
    description: '',
    endDate: '',
    starDate:'' ,
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const convertToDateInputFormat = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };
  // UseEffect to initialize state with Story data
  useEffect(() => {
    if (sprint) {
      setData({
        name: sprint.name || '',
        description: sprint.description || '',
        end_date: convertToDateInputFormat(sprint.endDate) || '',
        start_date: convertToDateInputFormat(sprint.starDate) || '',
      });

    }
  }, [sprint]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
       
      await updateSprint(sprint.id, data, token);
      setRender((prev) => !prev);
      setSnackbarMessage('Sprint Modified successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving sprint:', error);
      setSnackbarMessage('Error Modify Sprint');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleModalClosesprint();

      
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field ${name} changed to ${value}`);
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
      open={open}
      onClose={handleModalClosesprint}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Edit Sprint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to edit Sprint?
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
            label="Sprint Name"
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
            id="start_date"
            name="start_date"
            label="start_date"
            type="date"
            value={data.start_date}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            disabled={isDisabled}
            required
            margin="dense"
            id="end_date"
            name="end_date"
            label="end_date"
            type="date"
            value={data.end_date}
            onChange={handleChange}
            variant="outlined"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClosesprint} variant="outlined">Cancel</Button>
        <LoadingButton
          type="submit"
          loading={loading}
          loadingIndicator="Updating..."
          sx={{ paddingLeft: "15px", paddingRight: "15px" }}
          variant="contained"
        >
          <span>Update Sprint</span>
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}
