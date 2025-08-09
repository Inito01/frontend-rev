import { uploadDocuments } from '@/services/api';
import type { UploadProgress, UseFileUploadReturn } from '@/types';
import { useEffect, useState } from 'react';
import { usePolling } from './usePolling';

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState(null);

  const {
    jobStatus,
    processingProgress,
    results,
    error: pollingError,
    resetStates: resetPolling,
  } = usePolling(jobId);

  useEffect(() => {
    if (pollingError) {
      setError(pollingError);
    }
  }, [pollingError]);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(null);
    setProgress({});
    setJobId(null);

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

      if (response.data?.jobId) {
        setJobId(response.data.jobId);
      }
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al subir archivos');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress({});
    setError(null);
    setJobId(null);
    resetPolling();
  };

  return {
    uploadFiles,
    uploading,
    progress,
    uploadProgress: progress,
    processingProgress,
    processing: jobStatus === 'processing',
    success: jobStatus === 'completed',
    error: error || pollingError,
    jobId,
    results,
    reset,
  };
}
