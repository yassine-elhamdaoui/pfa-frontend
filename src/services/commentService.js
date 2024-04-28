export const getCommentById = async (commentId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Comments/${commentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
  
      const comments = await response.json();
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  };