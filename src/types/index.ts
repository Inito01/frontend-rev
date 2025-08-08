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
  error: string | null;
  success: boolean;
}
