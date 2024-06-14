const uploadProfileImage = async (userId, imageFile, token) => {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/uploadProfileImage`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const updatedUser = await response.json();
      // Utilisez simplement le chemin de l'image renvoyé par le backend
      return updatedUser;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };
  
  export { uploadProfileImage };
  




