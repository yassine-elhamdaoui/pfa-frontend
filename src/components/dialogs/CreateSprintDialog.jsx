import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useVelocity } from 'framer-motion';
import { CreateSprint } from '../../services/backLogService';

export default function CreateSprintDialog({ setreorder,projectId,token,SprintDialogOpen, handleModalClose, setSnackbarOpen, setSnackbarMessage }) {
  // State variables for form data

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '' ,
    end_date: '',
    projectId:0
  });
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(formData);
    try {
      await CreateSprint(formData, token);
      console.log('Sprint Created successfully');
     
     
    } catch (error) {
      console.error('Error creating sprint:', error);
    }
    finally{
      setLoading(false);
      handleModalClose();
       setreorder(prev=>!prev);
    }
    
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      projectId:projectId

    }));
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'xs'}
        open={SprintDialogOpen}
        onClose={handleModalClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Create Sprint</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details to create a new Sprint.
          </DialogContentText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Sprint Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              placeholder='EX : Sprint 1'
            />
            <TextField
              required
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              id="start_date"
              name="start_date"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              margin="dense"
              id="end_date"
              name="end_date"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">Cancel</Button>
          <Button type="submit" disabled={loading} variant="contained">Create Sprint</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
