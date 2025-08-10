import type { ProcessingProgressProps } from '@/types';
import { Loader2 } from 'lucide-react';

export function ProcessingProgress({
  filesCount,
  jobId,
  processedFilesCount,
  processingProgress,
}: ProcessingProgressProps) {
  if (!jobId) return null;

  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base sm:text-lg font-semibold">
          Procesando archivos
        </h3>
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-500" />
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs sm:text-sm mb-1">
          <span>Progreso general</span>
          <span>{processingProgress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-600">
        <p className="truncate">
          ID del trabajo: <span className="font-mono">{jobId}</span>
        </p>
        <p>
          Archivos procesados: {processedFilesCount} de {filesCount}
        </p>
        <div>
          Estado:{' '}
          <span className="font-medium text-blue-600">
            Analizando documentos...
          </span>
          {processedFilesCount > 0 && filesCount > 0 && (
            <div className="mt-1">
              Tiempo estimado:{' '}
              <span className="font-medium">
                {Math.ceil((filesCount - processedFilesCount) * 2)} segundos
                restantes
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
