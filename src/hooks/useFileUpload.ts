import { uploadDocuments } from '@/services/api';
import type { UploadProgress, UseFileUploadReturn } from '@/types';
import { useState } from 'react';

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress({});

    try {
      const response = await uploadDocuments(files, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          const newProgress: UploadProgress = {};
          files.forEach((file) => {
            newProgress[file.name] = percentCompleted;
          });
          setProgress(newProgress);
        }
      });

      setSuccess(true);
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al subir archivos');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFiles,
    uploading,
    progress,
    success,
    error,
  };
}
