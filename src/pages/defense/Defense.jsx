import AvailabilityCalendar from "../../components/availabilityCalendar/AvailabilityCalendar"
import TeamList from "./TeamList"
import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';

function Defense() {
  
  return (
    <div className="defense">
      defense
      <AvailabilityCalendar/>
      <TeamList/>    
    </div>
  )
}

export default Defense