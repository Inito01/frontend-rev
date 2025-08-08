import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const uploadDocuments = async (
  files: File[],
  onUploadProgress?: (progressEvent: any) => void
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('documents', file);
  });

  const response = api.post('/api/documents/verify-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  console.log((await response).data);
  return response;
};

export default api;
