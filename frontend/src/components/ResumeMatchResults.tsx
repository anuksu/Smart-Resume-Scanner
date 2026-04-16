import React from 'react';
import './ResumeMatchResults.css';

interface ResumeMatchResultsProps {
  onBack: () => void;
  analysisResults?: any;
}

const ResumeMatchResults: React.FC<ResumeMatchResultsProps> = ({ onBack, analysisResults }) => {
  const data = analysisResults || {};

  const overallScore = data.overallScore ?? 0;

  const experience = data.experience || {
    required: 'N/A',
    resume: 'N/A',
    match: false,
  };

  const education = data.education || {
    required: 'N/A',
    resume: 'N/A',
    match: false,
  };

  const location = data.location || {
    required: 'N/A',
    resume: 'N/A',
    match: false,
    applicable: false,
  };

  const certifications = data.certifications || [];
  const skills = data.skills || [];
  const responsibilities = data.responsibilities || [];
  const missingKeywords = data.missingKeywords || [];
  const rewriteSuggestions = data.rewriteSuggestions || [];
  const atsBulletPoints = data.atsBulletPoints || [];

  const resumeUpdateGuide = data.resumeUpdateGuide || {};
  const atsOptimizedSkills = resumeUpdateGuide.atsOptimizedSkills || { current: '', suggested: '', changes: [] };

  const matchedSkills = skills.filter((s: any) => s.match).length;
  const matchedResponsibilities = responsibilities.filter((r: any) => r.match).length;
  const matchedCerts = certifications.filter((c: any) => c.match).length;

  return (
    <div className="rmr-container">
      <div className="rmr-page">
        <div className="rmr-hero">
          <div className="rmr-hero-content">
            <h2>Resume Match Results</h2>
            <p className="rmr-hero-subtitle">
              Detailed comparison of your resume against the job description
            </p>
          </div>
        </div>

        <div className="rmr-content">
          {/* Overall Score */}
          <div className="rmr-overall-card">
            <div className="rmr-overall-score">
              <div className={`rmr-circle ${overallScore >= 80 ? 'rmr-circle-good' : overallScore >= 60 ? 'rmr-circle-medium' : 'rmr-circle-low'}`}>
                <span className="rmr-circle-value">{overallScore}%</span>
              </div>
              <div className="rmr-overall-info">
                <h3>Overall Match Score</h3>
                <p>Your resume matches <strong>{overallScore}%</strong> of the job requirements. Below is a detailed breakdown.</p>
              </div>
            </div>
            <div className="rmr-legend">
              <div className="rmr-legend-item">
                <span className="rmr-dot rmr-dot-green"></span> Matching
              </div>
              <div className="rmr-legend-item">
                <span className="rmr-dot rmr-dot-red"></span> Not Matching
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="rmr-section-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Experience
              </h3>
              <span className={`rmr-badge ${experience.match ? 'rmr-badge-match' : 'rmr-badge-miss'}`}>
                {experience.match ? 'Match' : 'Gap Found'}
              </span>
            </div>
            <div className="rmr-compare">
              <div className="rmr-compare-row">
                <span className="rmr-compare-label">Required:</span>
                <span className="rmr-compare-value">{experience.required}</span>
              </div>
              <div className="rmr-compare-row">
                <span className="rmr-compare-label">Your Resume:</span>
                <span className={`rmr-compare-value ${experience.match ? 'rmr-text-green' : 'rmr-text-red'}`}>{experience.resume}</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="rmr-section-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
                </svg>
                Education
              </h3>
              <span className={`rmr-badge ${education.match ? 'rmr-badge-match' : 'rmr-badge-miss'}`}>
                {education.match ? 'Match' : 'Gap Found'}
              </span>
            </div>
            <div className="rmr-compare">
              <div className="rmr-compare-row">
                <span className="rmr-compare-label">Required:</span>
                <span className="rmr-compare-value">{education.required}</span>
              </div>
              <div className="rmr-compare-row">
                <span className="rmr-compare-label">Your Resume:</span>
                <span className={`rmr-compare-value ${education.match ? 'rmr-text-green' : 'rmr-text-red'}`}>{education.resume}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          {location.applicable && (
            <div className="rmr-section-card">
              <div className="rmr-section-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Location
                </h3>
                <span className={`rmr-badge ${location.match ? 'rmr-badge-match' : 'rmr-badge-miss'}`}>
                  {location.match ? 'Match' : 'Gap Found'}
                </span>
              </div>
              <div className="rmr-compare">
                <div className="rmr-compare-row">
                  <span className="rmr-compare-label">Required:</span>
                  <span className="rmr-compare-value">{location.required}</span>
                </div>
                <div className="rmr-compare-row">
                  <span className="rmr-compare-label">Your Resume:</span>
                  <span className={`rmr-compare-value ${location.match ? 'rmr-text-green' : 'rmr-text-red'}`}>{location.resume}</span>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="rmr-section-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                Skills
              </h3>
              <span className="rmr-badge rmr-badge-count">{matchedSkills}/{skills.length} matched</span>
            </div>
            <div className="rmr-skills-grid">
              {skills.map((skill: any, index: number) => (
                <div key={index} className={`rmr-skill-tag ${skill.match ? 'rmr-skill-match' : 'rmr-skill-miss'}`}>
                  <span className={`rmr-skill-icon ${skill.match ? 'rmr-icon-check' : 'rmr-icon-x'}`}>
                    {skill.match ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </span>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* ATS-Optimized Skills Section */}
          {atsOptimizedSkills.suggested && (
            <div className="rmr-section-card rmr-ats-skills-card">
              <div className="rmr-section-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  ATS-Optimized Skills — Copy & Replace
                </h3>
              </div>
              <p className="rmr-ats-skills-intro">Replace your current skills section with this ATS-friendly version. Every skill is a standalone keyword that any ATS can scan.</p>

              {atsOptimizedSkills.current && (
                <div className="rmr-ats-skills-block rmr-ats-skills-before">
                  <div className="rmr-ats-skills-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Your Current Skills Section
                  </div>
                  <p className="rmr-ats-skills-text">{atsOptimizedSkills.current}</p>
                </div>
              )}

              <div className="rmr-rewrite-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>

              <div className="rmr-ats-skills-block rmr-ats-skills-after">
                <div className="rmr-ats-skills-label rmr-ats-skills-label-good">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  ATS-Optimized — Copy This
                </div>
                <p className="rmr-ats-skills-text">{atsOptimizedSkills.suggested}</p>
                <button
                  className="rmr-copy-btn rmr-copy-btn-large"
                  onClick={() => navigator.clipboard.writeText(atsOptimizedSkills.suggested)}
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Skills
                </button>
              </div>

              {atsOptimizedSkills.changes && atsOptimizedSkills.changes.length > 0 && (
                <div className="rmr-ats-skills-changes">
                  <strong>What changed:</strong>
                  <ul>
                    {atsOptimizedSkills.changes.map((change: string, i: number) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Responsibilities */}
          <div className="rmr-section-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Roles & Responsibilities
              </h3>
              <span className="rmr-badge rmr-badge-count">{matchedResponsibilities}/{responsibilities.length} matched</span>
            </div>
            <div className="rmr-responsibility-list">
              {responsibilities.map((item: any, index: number) => (
                <div key={index} className={`rmr-responsibility-item ${item.match ? 'rmr-resp-match' : 'rmr-resp-miss'}`}>
                  <span className="rmr-resp-icon">
                    {item.match ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </span>
                  <span className="rmr-resp-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="rmr-section-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"/>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
                Certifications
              </h3>
              <span className="rmr-badge rmr-badge-count">{matchedCerts}/{certifications.length} matched</span>
            </div>
            <div className="rmr-cert-list">
              {certifications.map((cert: any, index: number) => (
                <div key={index} className={`rmr-cert-item ${cert.match ? 'rmr-cert-match' : 'rmr-cert-miss'}`}>
                  <span className="rmr-cert-icon">
                    {cert.match ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </span>
                  <div className="rmr-cert-info">
                    <span className="rmr-cert-name">{cert.name}</span>
                    <span className="rmr-cert-tag">{cert.required ? 'Required' : 'Preferred'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="rmr-section-card rmr-keywords-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Missing Keywords — Add These to Your Resume
              </h3>
              <span className="rmr-badge rmr-badge-miss">{missingKeywords.length} missing</span>
            </div>
            <div className="rmr-keywords-list">
              {missingKeywords.map((item: any, index: number) => (
                <div key={index} className="rmr-keyword-item">
                  <div className="rmr-keyword-header">
                    <span className="rmr-keyword-name">{item.keyword}</span>
                    <span className="rmr-keyword-section">Add to: {item.section}</span>
                  </div>
                  <p className="rmr-keyword-example">{item.example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rewrite Suggestions */}
          <div className="rmr-section-card rmr-rewrite-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Rewrite Your Bullet Points
              </h3>
            </div>
            <p className="rmr-rewrite-intro">Your resume bullet points can be improved with better keywords and quantifiable results. Here's how:</p>
            <div className="rmr-rewrite-list">
              {rewriteSuggestions.map((item: any, index: number) => (
                <div key={index} className="rmr-rewrite-item">
                  <div className="rmr-rewrite-before">
                    <span className="rmr-rewrite-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Your Current
                    </span>
                    <p>{item.original}</p>
                  </div>
                  <div className="rmr-rewrite-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <polyline points="19 12 12 19 5 12"/>
                    </svg>
                  </div>
                  <div className="rmr-rewrite-after">
                    <span className="rmr-rewrite-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Suggested Rewrite
                    </span>
                    <p>{item.improved}</p>
                    <div className="rmr-rewrite-keywords">
                      {item.keywords.map((kw: string, i: number) => (
                        <span key={i} className="rmr-rewrite-kw">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ATS-Ready Bullet Points */}
          <div className="rmr-section-card rmr-ats-card">
            <div className="rmr-section-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <path d="M12 11h4"/>
                  <path d="M12 16h4"/>
                  <path d="M8 11h.01"/>
                  <path d="M8 16h.01"/>
                </svg>
                ATS-Ready Bullet Points — Copy & Use
              </h3>
            </div>
            <p className="rmr-ats-intro">Add these bullet points to your resume to fill the gaps and improve your ATS match score:</p>
            <div className="rmr-ats-list">
              {atsBulletPoints.map((bullet: string, index: number) => (
                <div key={index} className="rmr-ats-item">
                  <span className="rmr-ats-bullet">•</span>
                  <p className="rmr-ats-text">{bullet}</p>
                  <button
                    className="rmr-copy-btn"
                    onClick={() => navigator.clipboard.writeText(bullet)}
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="rmr-actions">
            <button className="rmr-btn rmr-btn-primary" onClick={onBack}>Analyze Another Job</button>
            <button className="rmr-btn rmr-btn-outline" onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeMatchResults;
