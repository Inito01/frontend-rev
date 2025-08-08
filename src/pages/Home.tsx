import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { error, progress, success, uploadFiles, uploading } = useFileUpload();

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

    try {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
    } catch (error) {
      console.log(`Error subiendo archivos: ${error}`);
    }
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
            onFilesAccepted={handleFilesAccepted}
            onFilesCleared={handleFilesCleared}
            onFilesRemoved={handleFilesRemoved}
            maxFiles={5}
            className="mb-4"
          />

          {selectedFiles.length > 0 && (
            <div className="flex flex-col space-y-4 mx-auto">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {selectedFiles.length} archivo(s) seleccionado(s)
                  </span>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivos
                    </>
                  )}
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  {Object.entries(progress).map(([fileName, percent]) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{fileName}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 mx-auto">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Archivos subidos exitosamente</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
