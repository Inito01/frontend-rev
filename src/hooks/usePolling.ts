import { useState, useEffect } from 'react';
import { getJobStatus } from '@/services/api';

export function usePolling(jobId: string | null, pollingInterval = 2000) {
  const [jobStatus, setJobStatus] = useState('pending');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const checkJobStatus = async () => {
      try {
        const response = await getJobStatus(jobId);
        const job = response.data.job;

        if (job) {
          setJobStatus(job.status);

          if (
            job.processedFiles !== undefined &&
            job.totalFiles !== undefined
          ) {
            setProcessingProgress(
              Math.round((job.processedFiles / job.totalFiles) * 100)
            );
          } else if (job.results && job.files) {
            setProcessingProgress(
              Math.round((job.results.length / job.files.length) * 100)
            );
          } else if (job.progress !== undefined) {
            setProcessingProgress(job.progress);
          }

          if (job.results) {
            setResults(job.results);
          }

          if (job.error) {
            setError(job.error);
          }

          if (job.status === 'completed' || job.status === 'failed') {
            setIsPolling(false);
          }
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            'Error al consultar el estado del trabajo'
        );
        setIsPolling(false);
      }
    };

    setIsPolling(true);
    checkJobStatus();

    const intervalId = setInterval(() => {
      checkJobStatus();
    }, pollingInterval);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [jobId]);

  const resetStates = () => {
    setJobStatus('pending');
    setProcessingProgress(0);
    setResults([]);
    setError(null);
    setIsPolling(false);
  };

  return {
    jobStatus,
    processingProgress,
    results,
    error,
    isPolling,
    resetStates,
  };
}
