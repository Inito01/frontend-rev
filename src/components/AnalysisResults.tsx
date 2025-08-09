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
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Resultado del analisis</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold truncate">
                {result.file.originalname}
              </h3>
              {getStatusIcon(result.analysis.status)}
            </div>

            <div className="text-sm text-gray-500 mb-2">
              {result.file.mimetype} | {(result.file.size / 1024).toFixed(2)} KB
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">Estado:</span>
              <span
                className={`text-sm ${
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

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">Confianza:</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
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
              <span className="text-sm">{result.analysis.confidence}%</span>
            </div>

            {result.analysis.details && result.analysis.details.analysis && (
              <p className="text-sm mt-2">{result.analysis.details.analysis}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button variant={'destructive'} onClick={onClose}>
          Cerrar resultados
        </Button>
      </div>
    </div>
  );
}
