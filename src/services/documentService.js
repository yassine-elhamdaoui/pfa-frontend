export const getDocumentById = async (documentId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${documentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }
  
      const documents = await response.json();
      return documents;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  };


  export const getReportById = async (reportId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${reportId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.status}`);
      }
  
      const report = await response.json();
      return report;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  };
  
    
    