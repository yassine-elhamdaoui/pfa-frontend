import { json } from "react-router-dom";

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
export const getAllProjects = async (token) => {
    const projects = await fetch("http://localhost:8080/api/projects", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching data:", error);
            throw error;
        }
    );
    return projects;
}


export const getProjectName = async (token, projectId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch project');
        }

        const project = await response.json();
        return project.title; // assuming the response JSON contains a title field
    } catch (error) {
        console.error("Error fetching project title:", error);
        return 'Project title unavailable'; // Provide a default or error-specific return value
    }

}


export const getAllPreferences = async (token) => {
    const preferences = await fetch("http://localhost:8080/api/projects/preferences", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
   try{
    if (preferences.ok) {
        return await preferences.json();
        return preferences
    } else {
        throw new Error("Failed to fetch preferences");
    }
   }
   catch(error){
      console.error("errrrror",token)
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
  console.log(new Date().getFullYear());
  const assignment = await fetch(
    `http://localhost:8080/api/assignments?year=${new Date().getFullYear()}`,
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
