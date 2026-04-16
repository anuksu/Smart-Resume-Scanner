import React, { useState } from 'react';
import './ResumeUpload.css';

interface ResumeUploadProps {
  onBack: () => void;
  onNext: () => void;
  onFilesChange?: (files: File[]) => void;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onBack, onNext, onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFiles = (newFiles: File[]): File[] => {
    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);

      if (!isValidType) {
        errors.push(`"${file.name}" is not a valid resume file. Only PDF, DOC, DOCX are allowed.`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds 10MB limit.`);
      } else {
        valid.push(file);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
      setTimeout(() => setError(''), 5000);
    } else {
      setError('');
    }

    return valid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const valid = validateFiles(Array.from(e.target.files));
      if (valid.length > 0) {
        const updated = [...files, ...valid];
        setFiles(updated);
        onFilesChange?.(updated);
      }
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const valid = validateFiles(Array.from(e.dataTransfer.files));
      if (valid.length > 0) {
        const updated = [...files, ...valid];
        setFiles(updated);
        onFilesChange?.(updated);
      }
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="ru-container">
      <div className="ru-page">
        <div className="ru-hero">
          <div className="ru-hero-content">
            <h2>Upload Your Resume</h2>
            <p className="ru-hero-subtitle">
              Upload your resume first, then paste the job description to get AI-powered optimization
            </p>
          </div>
        </div>

        <div className="ru-content">
          <div className="ru-section">
            <div className="ru-upload-card">
              <div
                className={`ru-dropzone ${isDragging ? 'ru-dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="ru-drop-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <h3>Drag & drop your resume here</h3>
                <p className="ru-drop-formats">Supports PDF, DOC, DOCX only (Max 10MB)</p>
                <div className="ru-drop-divider">
                  <span>or</span>
                </div>
                <label className="ru-browse-btn">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    multiple
                    hidden
                  />
                </label>
              </div>

              {error && <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', margin: '16px 0 0', border: '1px solid #feb2b2', fontSize: '0.9rem' }}>{error}</div>}

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="ru-files-list">
                  <h4>Uploaded Files ({files.length})</h4>
                  {files.map((file, index) => (
                    <div key={index} className="ru-file-item">
                      <div className="ru-file-info">
                        <div className="ru-file-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <div className="ru-file-details">
                          <span className="ru-file-name">{file.name}</span>
                          <span className="ru-file-size">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <button className="ru-file-remove" onClick={() => removeFile(index)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="ru-actions">
                <button
                  className="ru-analyze-btn"
                  disabled={files.length === 0}
                  onClick={onNext}
                >
                  Next: Add Job Description
                </button>
                <button className="ru-back-btn" onClick={onBack}>Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
