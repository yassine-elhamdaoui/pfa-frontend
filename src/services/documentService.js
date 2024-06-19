export const downloadFile = async (projectId, docId, docName, token) => {
  try {
    // Fetch the file content from the endpoint
    const response = await fetch(
      `http://localhost:8080/api/projects/${projectId}/docs/${docId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const fileExtension = docName.split(".").pop(); 
    a.download = `${docName.split(".")[0].slice(0,-37)}.${fileExtension}`; 

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const addComment = async (docId, text, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: text, documentId: docId }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to add comment:", data);
      throw new Error("Failed to add comment");
    }

    console.log("Comment added with success here is Backend response:", data);
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}