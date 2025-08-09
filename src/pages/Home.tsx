import { AnalysisResults } from '@/components/AnalysisResults';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const {
    error,
    progress,
    processingProgress,
    processing,
    success,
    uploadFiles,
    uploading,
    jobId,
    results,
    reset,
  } = useFileUpload();

  const [showResults, setShowResults] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [dropzoneKey, setDropzoneKey] = useState(0);

  useEffect(() => {
    if (success && results && results.length > 0) {
      setShowResults(true);
    }
  }, [success, results]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setFilesCount(selectedFiles.length);
    }
  }, [selectedFiles]);

  const handleFilesAccepted = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFilesRemoved = (removedFiles: File[]) => {
    setSelectedFiles((prev) =>
      prev.filter(
        (file) =>
          !removedFiles.some(
            (removedFile) =>
              removedFile.name === file.name &&
              removedFile.size === file.size &&
              removedFile.lastModified === file.lastModified
          )
      )
    );
  };

  const handleFilesCleared = () => {
    setSelectedFiles([]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setShowResults(false);
    try {
      const response = await uploadFiles(selectedFiles);
      if (response && response.fileCount) {
        setFilesCount(response.fileCount);
      }
      setSelectedFiles([]);
      setDropzoneKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log(`Error subiendo archivos: ${error}`);
    }
  };

  const closeResults = () => {
    setShowResults(false);
    setSelectedFiles([]);
    reset();
    setDropzoneKey((prevKey) => prevKey + 1);
  };
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4-xl space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Validación de Revisión Técnica
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sube tus documentos PDF y fotografías JPG/JPEG para procesar tu
            revisión técnica
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Instrucciones
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="font-medium text-blue-600 mt-1">°</span>
            <span>Solo se aceptan archivos PDF, JPG Y JPEG</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium text-blue-600 mt-1">°</span>
            <span>Tamaño máximo por archivo: 10MB</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium text-blue-600 mt-1">°</span>
            <span>Puedes subir hasta 5 archivos a la vez</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium text-blue-600 mt-1">°</span>
            <span>Arrastra los archivos o haz clic para seleccionarlos</span>
          </li>
        </ul>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-x-6">
          <FileDropzone
            key={dropzoneKey}
            onFilesAccepted={handleFilesAccepted}
            onFilesCleared={handleFilesCleared}
            onFilesRemoved={handleFilesRemoved}
            maxFiles={5}
            className="mb-4"
          />

          {selectedFiles.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={uploading || processing}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analizar Documentos
                  </>
                )}
              </Button>
            </div>
          )}

          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subiendo archivos</span>
                <span>{Object.values(progress)[0] || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${Object.values(progress)[0] || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {processing && (
            <ProcessingProgress
              jobId={jobId}
              processingProgress={processingProgress}
              processedFilesCount={results ? results.length : 0}
              filesCount={filesCount}
            />
          )}

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && !showResults && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 mx-auto">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Archivos procesados exitosamente
              </span>
            </div>
          )}

          {showResults && results && results.length > 0 && (
            <AnalysisResults results={results} onClose={closeResults} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
