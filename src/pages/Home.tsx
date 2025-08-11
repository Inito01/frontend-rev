import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FileDropzone } from '@/components/FileDropzone';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Container } from '@/components/ui/container';
import { Navigate } from 'react-router-dom';

export function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    uploadFiles,
    uploading,
    uploadProgress,
    processing,
    processingProgress,
    results,
    jobId,
    reset,
  } = useFileUpload();

  const isUploading = uploading && Object.keys(uploadProgress).length > 0;
  const isProcessing = processing && jobId;
  const hasResults = results && results.length > 0;

  const processedFilesCount = results?.length || 0;
  const filesCount = Object.keys(uploadProgress).length || processedFilesCount;

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Container>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Validación de Revisión Técnica
          </h1>
          <p className="text-gray-600">
            Sube tus documentos PDF y fotografías JPG/JPEG para procesar tu
            revisión técnica
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!isUploading && !isProcessing && !hasResults && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Instrucciones</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Solo se aceptan archivos PDF, JPG y JPEG</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Tamaño máximo por archivo: 10MB</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Puedes subir hasta 5 archivos a la vez</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Arrastra los archivos o haz clic para seleccionarlos
                    </span>
                  </li>
                </ul>
              </div>

              <FileDropzone onFilesAccepted={uploadFiles} />
            </div>
          )}

          {(isUploading || isProcessing) && (
            <ProcessingProgress
              jobId={jobId}
              filesCount={filesCount}
              processedFilesCount={processedFilesCount}
              processingProgress={processingProgress}
            />
          )}

          {hasResults && <AnalysisResults results={results} onClose={reset} />}
        </div>
      </Container>
    </div>
  );
}
