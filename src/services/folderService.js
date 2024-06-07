export const createFolder = async ( token,projectId,name, setSnackbarOpen, setSnackbarMessage) => {
    try {
        console.log(projectId);
        console.log(name);
        const response = await fetch('http://localhost:8080/api/folders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name : name,  
                projectId : projectId,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to create folder:', data);
            throw new Error('Failed to create folder');
        }
        console.log('Folder created with success here is Backend response:', data);
        setSnackbarMessage("Folder created successfully"); 
        setSnackbarOpen(true); 
        return data;
    } catch (error) {
        console.error('Error creating folder:', error);
        setSnackbarMessage("Failed to create folder");
        setSnackbarOpen(true); 
        throw error;
    }
}
export const uploadFiles = async (token, folderId, files, setSnackbarOpen, setSnackbarMessage) => {
    try {
        const response = await fetch(
          `http://localhost:8080/api/folders/${folderId}/upload-files`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: files,
          }
        );
        console.log(folderId);
        console.log(files);

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to upload files:', data);
            throw new Error('Failed to upload files');
        }
        console.log('Files uploaded with success here is Backend response:', data);
        setSnackbarMessage("Files uploaded successfully"); 
        setSnackbarOpen(true); 
        return data;
    } catch (error) {
        console.error('Error uploading files:', error);
        setSnackbarMessage("Failed to upload files"); 
        setSnackbarOpen(true); 
        throw error;
    }
}
export const deleteFolder = async (token, folderId, setSnackbarOpen, setSnackbarMessage) => {
    try {
        const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to delete folder:', data);
            throw new Error('Failed to delete folder');
        }
        console.log('Folder deleted with success here is Backend response:', data);
        setSnackbarMessage("Folder deleted successfully");
        setSnackbarOpen(true);
        return data;
    }
    catch (error) {
        console.error('Error deleting folder:', error);
        setSnackbarMessage("Failed to delete folder");
        setSnackbarOpen(true);
        throw error;
    }
}

export const updateFolder = async (token, folderId, name, setSnackbarOpen, setSnackbarMessage) => {
    try {
        const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to update folder:', data);
            throw new Error('Failed to update folder');
        }
        console.log('Folder updated with success here is Backend response:', data);
        setSnackbarMessage("Folder updated successfully");
        setSnackbarOpen(true);
        return data;
    }
    catch (error) {
        console.error('Error updating folder:', error);
        setSnackbarMessage("Failed to update folder");
        setSnackbarOpen(true);
        throw error;
    }
}

export const deleteFiles = async (token, folderId, fileIds, setSnackbarOpen, setSnackbarMessage) => {
    try {
        console.log(fileIds);
        const response = await fetch(`http://localhost:8080/api/folders/${folderId}/delete-files`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                documentIds: fileIds,
            }),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            console.error('Failed to delete files:', data);
            throw new Error('Failed to delete files');
        }
        console.log('Files deleted with success here is Backend response:', data);
        setSnackbarMessage("Files deleted successfully");
        setSnackbarOpen(true);
        return data;
    }
    catch (error) {
        console.error('Error deleting files:', error);
        setSnackbarMessage("Failed to delete files");
        setSnackbarOpen(true);
        throw error;
    }
}
