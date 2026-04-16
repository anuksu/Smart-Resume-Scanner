import React from 'react';
import './RoleSelection.css';

interface RoleSelectionProps {
  onSelectRole: (role: 'seeker' | 'hiring') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="role-container">
      <div className="role-page">
        <div className="role-hero">
          <h2>Welcome to SRS</h2>
          <p className="role-subtitle">How would you like to use our platform?</p>
        </div>

        <div className="role-cards">
          <div className="role-card" onClick={() => onSelectRole('seeker')}>
            <div className="role-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>I'm a Job Seeker</h3>
            <p>Upload your resume, get AI-powered analysis, and optimize it for your dream job</p>
            <ul className="role-features">
              <li>Upload & scan your resume</li>
              <li>Get ATS optimization score</li>
              <li>AI-powered improvement tips</li>
              <li>Match with job openings</li>
            </ul>
            <button className="role-btn role-btn-primary">Get Started</button>
          </div>

          <div className="role-card" onClick={() => onSelectRole('hiring')}>
            <div className="role-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3>I'm Hiring</h3>
            <p>Post your job requirements and let AI find the best matching candidates from resumes</p>
            <ul className="role-features">
              <li>Define job requirements</li>
              <li>Bulk resume screening</li>
              <li>AI-powered candidate ranking</li>
              <li>Automated shortlisting</li>
            </ul>
            <button className="role-btn role-btn-primary">Start Hiring</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
