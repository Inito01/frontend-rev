import { cn } from '@/lib/utils';
import type { FileDropzoneProps, FileWithPreview } from '@/types';
import { AlertCircle, FileText, Image, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';

export function FileDropzone({
  onFilesCleared,
  onFilesRemoved,
  onFilesAccepted,
  maxFiles = 5,
  className,
}: FileDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<any[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // previews
      const filesWithPreviews = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        });
        return fileWithPreview;
      });

      setUploadedFiles((prev) => [...prev, ...filesWithPreviews]);
      setRejectedFiles(rejectedFiles);
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const removeFile = (fileToRemove: FileWithPreview) => {
    setUploadedFiles((files) => {
      const newFiles = files.filter((file) => file !== fileToRemove);
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      onFilesRemoved?.([fileToRemove as File]);
      return newFiles;
    });
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
    setRejectedFiles([]);

    onFilesCleared?.();
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, //10 megas
  });

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <Image className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all duration-200 ease-in-out',
          'hover:border-primary/50 hover:bg-primary/10',
          isDragActive && 'border-primary bg-primary/10 scale-105',
          isDragAccept && 'border-green-500 bg-green-50',
          isDragReject && 'border-red-500 bg-red-50',
          !isDragAccept && 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
          <div
            className={cn(
              'p-3 sm:p-4 rounded-full transition-colors duration-200',
              isDragActive ? 'bg-primary/20' : 'bg-transparent'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-200',
                isDragActive ? 'text-primary' : 'text-gray-500'
              )}
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <p className="text-base sm:text-lg font-medium text-gray-700">
              {isDragActive
                ? 'Suelta los archivos aqui...'
                : 'Arrastra archivos o haz clic para seleccionar'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Solo archivos PDF, JPG Y JPEG (máximo 10MB cada uno)
            </p>
          </div>

          <Button
            variant={'outline'}
            type="button"
            className="mt-2 sm:mt-4 text-sm sm:text-base hover:cursor-pointer"
          >
            Seleccionar archivos
          </Button>
        </div>
      </div>

      {/* rechazados */}
      {rejectedFiles.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-800">Archivos rechazados</h3>
          </div>
          <ul>
            {rejectedFiles.map((rejection, index) => (
              <li key={index} className="text-sm text-red-700">
                <span className="font-medium">{rejection.file.name}</span>
                {rejection.errors.map((error: any, errorIndex: number) => (
                  <span key={errorIndex} className="ml-2">
                    -{' '}
                    {error.code === 'file-invalid-type'
                      ? 'Tipo de archivo no valido'
                      : error.code === 'file-too-large'
                        ? 'Archivo demasiado grande'
                        : error.message}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* aceptados */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2 text-sm sm:text-base">
              <span>Archivos listos ({uploadedFiles.length})</span>
            </h3>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={clearAllFiles}
              className="text-red-600 hover:text-red-700 hover:cursor-pointer text-xs sm:text-sm"
            >
              Limpiar todo
            </Button>
          </div>

          <div className="grid gap-2 sm:gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg border"
                    />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatFileSize(file.size)} ° {file.type}
                  </p>
                </div>

                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => removeFile(file)}
                  className="text-gray-400 hover:text-red-500 hover:cursor-pointer p-1 sm:p-2"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
