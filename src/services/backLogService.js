export const getBacklog= async (backlogId ,token)=> {
    const backlogs  =await fetch(`http://localhost:8081/api/backlogs/${backlogId}`,
{
    method :"GET",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return backlogs;
};

export const CreateStory= async (storyDto ,token)=> {
    const story  =await fetch(`http://localhost:8081/api/user-stories`,
{
    method :"POST",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    },
    body:JSON.stringify(storyDto)
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return story;
};
export const DeleteStory= async (id ,token)=> {
    const story  =await fetch(`http://localhost:8081/api/user-stories/${id}`,
{
    method :"DELETE",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
    
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return story;
};
export const ModifyStory= async (id,data ,token)=> {
    const story  =await fetch(`http://localhost:8081/api/user-stories/${id}`,
{
    method :"PUT",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    },
    body:JSON.stringify(data)
    
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return story;
};

export const CreateSprint= async (sprintDto ,token)=> {
    const sprint  =await fetch(`http://localhost:8081/api/sprints`,
{
    method :"POST",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    },
    body:JSON.stringify(sprintDto)
}
)
.then((response) => response.json())
.catch((error) => {
    
        console.error("Error fetching data:", error);
        throw error;
      });  
      return sprint;
};

export const getSprint= async (projectId ,token)=> {
    const backlogs  =await fetch(`http://localhost:8081/api/sprints?projectId=${projectId}`,
{
    method :"GET",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return backlogs;
};

export const AffecteToSprint= async (id,sprintId ,token)=> {
    const sprint  =await fetch(`http://localhost:8081/api/user-stories/${id}/affect-sprint?sprintId=${sprintId}`,
{
    method :"POST",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
    
        console.error("Error fetching data:", error);
        throw error;
      });  
      return sprint;
};
export const Affectedevelop= async (id,developId ,token)=> {
    const sprint  =await fetch(`http://localhost:8081/api/user-stories/${id}/affect-developer?developId=${developId}`,
{
    method :"POST",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
    
        console.error("Error fetching data:", error);
        throw error;
      });  
      return sprint;
};
export const removefromsprint= async (id ,token)=> {
    const sprint  =await fetch(`http://localhost:8081/api/user-stories/${id}/removed-from-sprint`,
{
    method :"PUT",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
    
        console.error("Error fetching data:", error);
        throw error;
      });  
      return sprint;
};
export const DeleteSprint= async (id ,token)=> {
    const story  =await fetch(`http://localhost:8081/api/sprints/${id}`,
{
    method :"DELETE",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
    
}
)
.then((response) => response.json())
.catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });  
      return story;
};


export const closesprint= async (id ,token)=> {
    const sprint  =await fetch(`http://localhost:8081/api/sprints/${id}/closed`,
{
    method :"PUT",
    headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
    }
}
)
.then((response) => response.json())
.catch((error) => {
    
        console.error("Error fetching data:", error);
        throw error;
      });  
      return sprint;
};
export const updateSprint= async (id ,data,token)=> {


    const sprint  =await fetch(`http://localhost:8081/api/sprints/${id}`,
        {
            method :"PUT",
            headers:{
                Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
            
        }
        )
        .then((response) => response.json())
        .catch((error) => {
                console.error("Error fetching data:", error);
                throw error;
              });  
              return sprint;
        };