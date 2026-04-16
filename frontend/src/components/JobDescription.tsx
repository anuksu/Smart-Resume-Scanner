import React, { useState } from 'react';
import './JobDescription.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface JobDescriptionProps {
  onBack: () => void;
  onNext: (results: any) => void;
  resumeFile?: File | null;
  authToken?: string | null;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ onBack, onNext, resumeFile, authToken }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    if (!resumeFile) {
      setError('No resume uploaded. Please go back and upload a resume first.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = typeof data.detail === 'string' ? data.detail : data.detail?.message || 'Analysis failed.';
        throw new Error(msg);
      }

      onNext(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="jd-container">
      <div className="jd-page">
        <div className="jd-hero">
          <div className="jd-hero-content">
            <h2>Paste Job Description</h2>
            <p className="jd-hero-subtitle">
              Copy and paste the job description from the job portal to analyze your resume against it
            </p>
          </div>
        </div>

        <div className="jd-content">
          <div className="jd-form-card">
            <form className="jd-form" onSubmit={handleAnalyze}>
              {error && <div className="jd-error" style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #feb2b2' }}>{error}</div>}
              <div className="jd-instructions">
                <div className="jd-instruction-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div className="jd-instruction-text">
                  <h4>How to get the job description:</h4>
                  <ol>
                    <li>Go to the job portal (LinkedIn, Indeed, Naukri, etc.)</li>
                    <li>Find the job you want to apply for</li>
                    <li>Select and copy the entire job description</li>
                    <li>Paste it in the text box below</li>
                  </ol>
                </div>
              </div>

              <div className="jd-form-group">
                <label htmlFor="jobDesc">Job Description *</label>
                <textarea
                  id="jobDesc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here. Include all details like responsibilities, requirements, qualifications, skills, and any other relevant information..."
                  rows={12}
                  required
                  disabled={isAnalyzing}
                />
                <div className="jd-char-count">
                  {jobDescription.length} characters
                </div>
              </div>

              <div className="jd-tips">
                <h4>Tips for best results:</h4>
                <ul>
                  <li>Include the complete job description from start to finish</li>
                  <li>Make sure to include all requirements and qualifications</li>
                  <li>The more detailed the description, the better the optimization</li>
                  <li>Don't worry about formatting - we'll handle that</li>
                </ul>
              </div>

              {isAnalyzing && (
                <div className="jd-progress">
                  <div className="jd-progress-bar">
                    <div className="jd-progress-fill"></div>
                  </div>
                  <p>Analyzing your resume against the job description...</p>
                </div>
              )}

              <div className="jd-actions">
                <button
                  type="submit"
                  className="jd-btn jd-btn-primary"
                  disabled={!jobDescription.trim() || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze My Resume'}
                </button>
                <button type="button" className="jd-btn jd-btn-outline" onClick={onBack} disabled={isAnalyzing}>
                  Back to Resume Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
