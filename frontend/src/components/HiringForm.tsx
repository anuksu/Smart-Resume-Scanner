import React, { useState } from 'react';
import './HiringForm.css';

interface HiringFormProps {
  onBack: () => void;
}

const HiringForm: React.FC<HiringFormProps> = ({ onBack }) => {
  const [showOptional, setShowOptional] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="hf-container">
        <div className="hf-page">
          <div className="hf-hero">
            <div className="hf-hero-content">
              <h2>Job Posted Successfully</h2>
              <p className="hf-hero-subtitle">Your job requirements have been submitted. Our AI will start matching candidates.</p>
            </div>
          </div>
          <div className="hf-content">
            <div className="hf-success-card">
              <div className="hf-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Your job listing is live!</h3>
              <p>We'll notify you when matching resumes are found. You can manage your listings from your dashboard.</p>
              <div className="hf-success-actions">
                <button className="hf-btn hf-btn-primary" onClick={() => setSubmitted(false)}>Post Another Job</button>
                <button className="hf-btn hf-btn-outline" onClick={onBack}>Back to Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hf-container">
      <div className="hf-page">
        <div className="hf-hero">
          <div className="hf-hero-content">
            <h2>Post a Job</h2>
            <p className="hf-hero-subtitle">
              Define your job requirements and let AI find the best matching candidates
            </p>
          </div>
        </div>

        <div className="hf-content">
          <div className="hf-form-card">
            <form className="hf-form" onSubmit={handleSubmit}>
              {/* Job Profile */}
              <div className="hf-section">
                <div className="hf-section-header">
                  <span className="hf-section-number">1</span>
                  <h3>Job Profile</h3>
                </div>
                <div className="hf-form-row">
                  <div className="hf-form-group">
                    <label htmlFor="jobTitle">Job Title *</label>
                    <input type="text" id="jobTitle" placeholder="e.g. Senior Software Engineer" required />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="department">Department *</label>
                    <input type="text" id="department" placeholder="e.g. Engineering" required />
                  </div>
                </div>
                <div className="hf-form-row">
                  <div className="hf-form-group">
                    <label htmlFor="jobType">Employment Type *</label>
                    <select id="jobType" required>
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="location">Location *</label>
                    <input type="text" id="location" placeholder="e.g. San Francisco, CA or Remote" required />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="hf-section">
                <div className="hf-section-header">
                  <span className="hf-section-number">2</span>
                  <h3>Experience Required</h3>
                </div>
                <div className="hf-form-row">
                  <div className="hf-form-group">
                    <label htmlFor="minExp">Minimum Experience *</label>
                    <select id="minExp" required>
                      <option value="">Select minimum</option>
                      <option value="0">Fresher (0 years)</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="5">5 years</option>
                      <option value="7">7 years</option>
                      <option value="10">10+ years</option>
                    </select>
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="maxExp">Maximum Experience *</label>
                    <select id="maxExp" required>
                      <option value="">Select maximum</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="5">5 years</option>
                      <option value="7">7 years</option>
                      <option value="10">10 years</option>
                      <option value="15">15+ years</option>
                    </select>
                  </div>
                </div>
                <div className="hf-form-group">
                  <label htmlFor="education">Minimum Education *</label>
                  <select id="education" required>
                    <option value="">Select education level</option>
                    <option value="high-school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="hf-section">
                <div className="hf-section-header">
                  <span className="hf-section-number">3</span>
                  <h3>Required Skills</h3>
                </div>
                <div className="hf-form-group">
                  <label htmlFor="mustHaveSkills">Must-Have Skills *</label>
                  <input type="text" id="mustHaveSkills" placeholder="e.g. React, Node.js, TypeScript (comma separated)" required />
                  <span className="hf-field-hint">Candidates must have these skills to be shortlisted</span>
                </div>
                <div className="hf-form-group">
                  <label htmlFor="niceToHaveSkills">Nice-to-Have Skills</label>
                  <input type="text" id="niceToHaveSkills" placeholder="e.g. AWS, Docker, GraphQL (comma separated)" />
                  <span className="hf-field-hint">These skills will boost a candidate's match score</span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="hf-section">
                <div className="hf-section-header">
                  <span className="hf-section-number">4</span>
                  <h3>Key Responsibilities</h3>
                </div>
                <div className="hf-form-group">
                  <label htmlFor="responsibilities">Job Responsibilities *</label>
                  <textarea id="responsibilities" rows={5} placeholder="Describe the key responsibilities for this role. Enter each responsibility on a new line." required></textarea>
                </div>
                <div className="hf-form-group">
                  <label htmlFor="jobDescription">Job Description *</label>
                  <textarea id="jobDescription" rows={4} placeholder="Provide a detailed description of the role, team, and what success looks like..." required></textarea>
                </div>
              </div>

              {/* Optional Section Toggle */}
              <div className="hf-optional-toggle" onClick={() => setShowOptional(!showOptional)}>
                <span className="hf-toggle-icon">{showOptional ? '−' : '+'}</span>
                <span>Additional Details (Optional)</span>
              </div>

              {/* Optional Fields */}
              {showOptional && (
                <div className="hf-section hf-optional-section">
                  <div className="hf-form-row">
                    <div className="hf-form-group">
                      <label htmlFor="salaryMin">Salary Range - Min</label>
                      <input type="text" id="salaryMin" placeholder="e.g. $80,000" />
                    </div>
                    <div className="hf-form-group">
                      <label htmlFor="salaryMax">Salary Range - Max</label>
                      <input type="text" id="salaryMax" placeholder="e.g. $120,000" />
                    </div>
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" id="companyName" placeholder="e.g. TechCorp Inc." />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="companyWebsite">Company Website</label>
                    <input type="url" id="companyWebsite" placeholder="https://yourcompany.com" />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="benefits">Benefits & Perks</label>
                    <textarea id="benefits" rows={3} placeholder="e.g. Health insurance, 401k, Remote work, Stock options..."></textarea>
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="deadline">Application Deadline</label>
                    <input type="date" id="deadline" />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="openings">Number of Openings</label>
                    <input type="number" id="openings" placeholder="e.g. 3" min="1" />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="certifications">Preferred Certifications</label>
                    <input type="text" id="certifications" placeholder="e.g. AWS Certified, PMP, Scrum Master" />
                  </div>
                  <div className="hf-form-group">
                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea id="additionalNotes" rows={3} placeholder="Any other details or instructions for candidates..."></textarea>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="hf-form-actions">
                <button type="submit" className="hf-btn hf-btn-primary">Post Job & Find Candidates</button>
                <button type="button" className="hf-btn hf-btn-outline" onClick={onBack}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringForm;
