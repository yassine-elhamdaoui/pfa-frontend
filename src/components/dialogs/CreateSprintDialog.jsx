/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useVelocity } from 'framer-motion';
import { CreateSprint } from '../../services/backLogService';
import { forEach } from 'lodash';

export default function CreateSprintDialog({sprintData, setRender,projectId,token,SprintDialogOpen, handleModalClose, setSnackbarOpen, setSnackbarMessage }) {
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

  // Check for duplicate sprint name
  const duplicateName = sprintData.some(
    (sprint) => formData.name === sprint.name
  );
  if (duplicateName) {
    setSnackbarMessage("Sprint with same name already exists");
    setSnackbarOpen(true);
    return;
  }

  // Check for overlapping sprint dates
  const overlappingDates = sprintData.some(
    (sprint) =>
      (formData.start_date < sprint.starDate &&
        formData.end_date > sprint.endDate) || // New sprint encompasses existing sprint
      (formData.start_date > sprint.starDate &&
        formData.end_date < sprint.endDate) || // New sprint is within existing sprint
      (formData.start_date < sprint.starDate &&
        formData.end_date < sprint.endDate &&
        formData.end_date > sprint.starDate) || // New sprint overlaps the start of existing sprint
      (formData.start_date > sprint.starDate &&
        formData.start_date < sprint.endDate &&
        formData.end_date > sprint.endDate) // New sprint overlaps the end of existing sprint
  );
  if (overlappingDates) {
    setSnackbarMessage("Sprint dates overlap with existing sprint");
    setSnackbarOpen(true);
    return;
  }

  console.log(projectId);
  // setLoading(true);
  console.log(formData);
  try {
    await CreateSprint(formData, token);
    setRender((prev) => !prev);
  } catch (error) {
    console.error("Error creating sprint:", error);
  } finally {
    setLoading(false);
    handleModalClose();
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
