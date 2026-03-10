import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onUpload: (files: File[]) => void;
    isUploading?: boolean;
    accept?: Record<string, string[]>;
    maxSize?: number;
}

const DEFAULT_ACCEPT = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
};

export function FileUpload({
    onUpload,
    isUploading = false,
    accept = DEFAULT_ACCEPT,
    maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploadProps): React.ReactElement {
    const handleDrop = useCallback(
        (accepted: File[]) => {
            if (accepted.length > 0) onUpload(accepted);
        },
        [onUpload],
    );

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            onDrop: handleDrop,
            accept,
            maxSize,
            disabled: isUploading,
        });

    return (
        <div className="space-y-3">
            <div
                {...getRootProps()}
                className={cn(
                    'flex flex-col items-center justify-center gap-3 p-8',
                    'border-2 border-dashed rounded-xl cursor-pointer transition-all',
                    isDragActive
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]',
                    isUploading && 'pointer-events-none opacity-50',
                )}
            >
                <input {...getInputProps()} />
                {isUploading ? (
                    <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                ) : (
                    <Upload className="w-8 h-8 text-[var(--color-muted-foreground)]" />
                )}
                <div className="text-center">
                    <p className="text-sm font-medium">
                        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                        PDF, DOCX, TXT — max 10MB
                    </p>
                </div>
            </div>

            {acceptedFiles.length > 0 && (
                <div className="space-y-2">
                    {acceptedFiles.map((file) => (
                        <div
                            key={file.name}
                            className="flex items-center gap-3 p-3 bg-[var(--color-surface-elevated)] rounded-lg"
                        >
                            <FileText className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-[var(--color-muted-foreground)]">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
