import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadDocuments = async (
  files: File[],
  onUploadProgress?: (progressEvent: any) => void
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('documents', file);
  });

  const response = api.post('/documents/verify-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response;
};

export const getJobStatus = async (jobId: string) => {
  return api.get(`/documents/job/${jobId}`);
};

export default api;
