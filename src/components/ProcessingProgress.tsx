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
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Procesando archivos</h3>
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso general</span>
          <span>{processingProgress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>ID del trabajo: {jobId}</p>
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
