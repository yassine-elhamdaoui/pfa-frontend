export default async function createProject(token, data, setSnackbarOpen, setSnackbarMessage) {
  const response = await fetch("http://localhost:8080/api/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (response.ok) {
    setSnackbarMessage("Project created successfully");
    setSnackbarOpen(true);
    return await response.json();
  } else {
    console.log(await response.json());
    setSnackbarMessage("Failed to create project");
    setSnackbarOpen(true);
    return await response.json();
  }
} 
export const getProjectById = async (projectId, token) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status}`);
      }

      const project = await response.json();
      return project;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
};
export const getAllProjects = async (token,years,pageNumber,pageSize) => {
    let academicYear = years;
    if (academicYear === undefined) {
          const year = new Date().getFullYear();
          const month = new Date().getMonth();
          if (month >= 9 && month <= 12) {
            academicYear = `${year}/${year + 1}`;
          } else if (month >= 1 && month <= 7) {
            academicYear = `${year - 1}/${year}`;
          }
    }
    console.log(academicYear);
    const projects = await fetch(
      `http://localhost:8080/api/projects?academicYear=${academicYear}${pageSize !== undefined ? `&pageSize=${pageSize}` : ""}${pageNumber !== undefined ? `&pageNumber=${pageNumber}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
      console.log(projects);
    return projects;
}
export const getAllProjectsForCurrentYear = async (token) => {
    let academicYear 
          const year = new Date().getFullYear();
          const month = new Date().getMonth();
          if (month >= 9 && month <= 12) {
            academicYear = `${year}/${year + 1}`;
          } else if (month >= 1 && month <= 7) {
            academicYear = `${year - 1}/${year}`;
          }
    console.log(academicYear);
    const projects = await fetch(
      `http://localhost:8080/api/projects/all?academicYear=${academicYear}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
      console.log(projects);
    return projects;
}
export const getAllPreferences = async (token) => {
    const preferences = await fetch("http://localhost:8080/api/projects/preferences", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    if (preferences.ok) {
        return await preferences.json();
    } else {
        throw new Error("Failed to fetch preferences");
    }
}
export const updateProjectPreferences = async (
  token,
  preferences,
  setSnackbarOpen,
  setSnackbarMessage
) => {
  const response = await fetch(
    "http://localhost:8080/api/projects/preferences",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    }
  );
  if (response.ok) {
    setSnackbarMessage("Preferences updated successfully");
    setSnackbarOpen(true);
    return await response.json();
  } else {
    setSnackbarMessage("Failed to update preferences");
    setSnackbarOpen(true);
    throw new Error("Failed to update preferences");
  }
};
export const getTeamPreferences = async (teamId,token) => { 
    const preferences = await fetch(`http://localhost:8080/api/projects/preferences/team?teamId=${teamId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    if (preferences.ok) {
        return await preferences.json();
    } else {
        throw new Error("Failed to fetch preferences");
    }
}


export const makeAssignment = async (
  token,
  setSnackbarOpen,
  setSnackbarMessage,
  setAssignmentLoading
) => {
  const response = await fetch("http://localhost:8080/api/projects/assign", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  try {
    if (response.ok) {
      setSnackbarMessage((await response.json()).message);
      setSnackbarOpen(true);
      setAssignmentLoading(false);
      return response;
    } else {
      throw new Error("Error during assignment");
    }
  } catch (error) {
    setSnackbarMessage("Error during assignment");
    setSnackbarOpen(true);
    setAssignmentLoading(false);
    console.error("Error during assignment:", error);
    throw error;
  }
};

export const getAssignment = async (token) => {
      let academicYear;
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      if (month >= 9 && month <= 12) {
        academicYear = `${year}/${year + 1}`;
      } else if (month >= 1 && month <= 7) {
        academicYear = `${year - 1}/${year}`;
      }
  const assignment = await fetch(
    `http://localhost:8080/api/assignments?academicYear=${academicYear}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (assignment.ok) {
    return await assignment.json();
  }else{
    return {};
  }
};

export const validateAssignments = async (
  token,
  setSnackbarOpen,
  setSnackbarMessage,
  setAssignmentLoading
) => {
  const response = await fetch(
    `http://localhost:8080/api/projects/assign/validate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    setSnackbarMessage((await response.json()).message);
    setSnackbarOpen(true);
    setAssignmentLoading(false);
    return await response.json();
  } else {
        setSnackbarMessage("Error during assignment");
        setSnackbarOpen(true);
        setAssignmentLoading(false);
    return {};
  }
};

export const acceptProject = async (token, projectId,setSnackbarOpen,setSnackbarMessage,setConfirmLoading) => {
  const response = await fetch(
    `http://localhost:8080/api/projects/${projectId}/accept`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    setSnackbarMessage("Project accepted successfully");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    return await response.json();
  } else {
    setSnackbarMessage("Error accepting project");
    setSnackbarOpen(true);
    setConfirmLoading(false);
    throw new Error("Error accepting project");
  }
}

export const rejectProject = async (token, projectId) => {
  const response = await fetch(
    `http://localhost:8080/api/projects/${projectId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error rejecting project");
  }
}

export const makePreferences = async (token, ranking, setSnackbarOpen, setSnackbarMessage) => {
  const response = await fetch("http://localhost:8080/api/projects/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ranking),
  });
  if (response.ok) {
    setSnackbarMessage("Preferences saved successfully");
    setSnackbarOpen(true);
    return await response.json();
  } else {
    setSnackbarMessage("Failed to save preferences");
    setSnackbarOpen(true);
    return await response.json();
  }}

// export const getProjectById = async (projectId, token) => {
//   try {
//     const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch project: ${response.status}`);
//     }

//     const project = await response.json();
//     return project;
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     throw error;
//   }
// }





export const getAcademicYear = async(token)=>{
  const response = await fetch(
    `http://localhost:8080/api/projects/academicYears`,
    {
      method:"GET",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
  );
  if (response.ok) {
    // console.log(await response.json());
    return await response.json();
  } else {
    throw new Error("Error rejecting project");
  }
}

