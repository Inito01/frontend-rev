export interface ValidationResult {
  status: 'valid' | 'invalid';
  message: string;
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  onFilesRemoved?: (removedFiles: File[]) => void;
  onFilesCleared?: () => void;
  maxFiles?: number;
  className?: string;
}

export interface UploadProgress {
  [fileName: string]: number;
}

export interface UseFileUploadReturn {
  uploadFiles: (files: File[]) => Promise<any>;
  uploading: boolean;
  progress: UploadProgress;
  uploadProgress: UploadProgress;
  processingProgress: number;
  processing: boolean;
  success: boolean;
  error: string | null;
  jobId: string | null;
  results: any[];
  reset: () => void;
}

export interface AnalysisResultProps {
  results: any[];
  onClose: () => void;
}

export interface ProcessingProgressProps {
  jobId: string | null;
  filesCount: number;
  processedFilesCount: number;
  processingProgress: number;
}

// Auth
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick: () => void;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

// History
export interface Document {
  id: string;
  originalName: string;
  status: string;
  confidence: number;
  createdAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
