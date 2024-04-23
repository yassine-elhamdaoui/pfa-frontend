import React, { useEffect, useState } from 'react';
import { getAllPreferences, getProjectName } from '../../services/projectService'; 
import { hasRole } from '../../utils/userUtiles'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';



const token = localStorage.getItem("token");

const Preferences = () => {
    const [prefs, setPreferences] = useState([]);
    const {id} = useParams();  // This matches the dynamic segment name in the route path
    const [teamId, setTeamId] = useState(1);

    useEffect(() => {
    //     // Check if the user is a HEAD_OF_BRANCH and there is a token
        if (hasRole("ROLE_HEAD_OF_BRANCH")) {
            fetchPreferences(token,id);//id==>for id of the team passed in the url we use useParam Router Hooks!!!
        }
    }, [token]); // Reacting to changes in user, especially user.token


    const fetchPreferences = async (token, id) => {
        const prefs = await getAllPreferences(token);
        if (prefs) {
            const projectsWithTitles = await Promise.all(prefs.map(async pref => {
                const projectTitles = await Promise.all(Object.keys(pref.projectPreferenceRanks).map(async projectId => {
                    const title = await getProjectName(token, projectId);
                    return { projectId, title };  // Store project ID and title
                }));
                return { ...pref, projectTitles: Object.fromEntries(projectTitles.map(item => [item.projectId, item.title])) };
            }));
    
            setPreferences(projectsWithTitles);
            setTeamId(id);
        } else {
            console.log('No preferences received or error occurred');
        }
    };

    return (
      <TableContainer component={Paper}>
      <Table>
          <TableHead>
              <TableRow>
                  {/* <TableCell>Preference ID/rank</TableCell> */}
                  <TableCell>Projects (sorted by Ranks)</TableCell>
                  <TableCell >Preference responsible</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
                   
              {prefs.filter(pref => pref.user.teamId == teamId).map((pref) => (
                  <TableRow key={pref.id}>
                      {/* <TableCell component="th" scope="row">
                          {pref.id}
                      </TableCell> */}
                      <TableCell>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Project ID</TableCell>
                                        <TableCell>Project Title</TableCell>
                                        {/* <TableCell>Rank</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(pref.projectPreferenceRanks)
                                    .sort((a, b) => a[1] - b[1]) // Sorting by rank
                                    .map(([projectId, rank]) => (
                                        <TableRow key={projectId}>
                                            <TableCell>{projectId}</TableCell>
                                            <TableCell>{
                                            //     getProjectName(token,projectId)
                                            //    .then(title=>console.log(title))
                                            pref.projectTitles[projectId]  
                                            }
                                            </TableCell>
                                            {/* <TableCell>{rank}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                      </TableCell>
                      <TableCell >
                          {pref.user.email} {/* Assuming 'detail' is a field in your preferences object */}
                      </TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
  </TableContainer>
    );
};

export default Preferences;


