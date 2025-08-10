import type { AnalysisResultProps } from '@/types';
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
import { Button } from './ui/button';

export function AnalysisResults({ results, onClose }: AnalysisResultProps) {
  if (!results || results.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    if (status === 'valid') {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (status === 'probably_valid') {
      return <InfoIcon className="h-6 w-6 text-blue-500" />;
    } else {
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valido';
      case 'probably_valid':
        return 'Posiblemente valido';
      case 'suspicious':
        return 'Sospechoso';
      case 'invalid':
        return 'Invalido';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center">
        Resultado del analisis
      </h2>

      <div className="grid gap-3 sm:gap-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold truncate text-sm sm:text-base max-w-[75%]">
                {result.file.originalname}
              </h3>
              <div className="flex-shrink-0">
                {getStatusIcon(result.analysis.status)}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 mb-2">
              {result.file.mimetype} | {(result.file.size / 1024).toFixed(2)} KB
            </div>

            <div className="flex flex-wrap items-center space-x-2 mb-2">
              <span className="text-xs sm:text-sm font-medium">Estado:</span>
              <span
                className={`text-xs sm:text-sm ${
                  result.analysis.status === 'valid'
                    ? 'text-green-600'
                    : result.analysis.status === 'probably_valid'
                      ? 'text-blue-600'
                      : 'text-red-600'
                }`}
              >
                {getStatusText(result.analysis.status)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
              <span className="text-xs sm:text-sm font-medium">Confianza:</span>
              <div className="flex items-center w-full space-x-2">
                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      result.analysis.confidence >= 85
                        ? 'bg-green-500'
                        : result.analysis.confidence >= 70
                          ? 'bg-blue-500'
                          : result.analysis.confidence >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${result.analysis.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm flex-shrink-0">
                  {result.analysis.confidence}%
                </span>
              </div>
            </div>

            {result.analysis.summary && (
              <p className="text-xs sm:text-sm mt-2 text-gray-700">
                {result.analysis.summary}
              </p>
            )}

            {result.analysis.extractedData && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {result.analysis.extractedData.patente && (
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium">Patente: </span>
                    <span className="text-blue-700">
                      {result.analysis.extractedData.patente}
                    </span>
                  </div>
                )}
                {result.analysis.extractedData.dueno && (
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium">Dueño: </span>
                    <span className="break-words">
                      {result.analysis.extractedData.dueno}
                    </span>
                  </div>
                )}
                {result.analysis.extractedData.fechaEmision && (
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium">F. Emisión: </span>
                    <span>{result.analysis.extractedData.fechaEmision}</span>
                  </div>
                )}
                {result.analysis.extractedData.marca && (
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium">Marca: </span>
                    <span>
                      {result.analysis.extractedData.marca}{' '}
                      {result.analysis.extractedData.modelo}
                    </span>
                  </div>
                )}
              </div>
            )}

            {result.analysis.isAuthentic !== undefined && (
              <div className="mt-2 flex items-center flex-wrap">
                <span className="text-xs sm:text-sm font-medium mr-1">
                  Autenticidad:
                </span>
                {result.analysis.isAuthentic ? (
                  <span className="text-xs sm:text-sm text-green-600">
                    Documento auténtico
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-red-600">
                    Posible documento no auténtico
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          variant={'destructive'}
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2"
        >
          Cerrar resultados
        </Button>
      </div>
    </div>
  );
}
