import React from 'react';
import './About.css';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="about-container">
      <div className="about-card">
        <div className="hero-section">
          <div className="hero-content">
            <h2>Hire Better, Hire Faster</h2>
            <p className="hero-subtitle">AI-powered resume validation that cuts screening time by 80% and finds your perfect candidates</p>
          </div>
        </div>
        
        <div className="content-section">
          {/* What We Help You Achieve */}
          <div className="about-section">
            <h3>What We Help You Achieve</h3>
            <p className="section-description">
              Transform your hiring process with intelligent resume validation that saves time, reduces bias, 
              and finds the perfect candidates faster. Our AI-powered system analyzes resumes in seconds, 
              not hours, giving you instant insights and match scores.
            </p>
          </div>

          {/* How It Validates */}
          <div className="about-section">
            <h3>How It Validates Resumes</h3>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>OCR Text Extraction</h4>
                  <p>Our OCR technology accurately extracts text from PDF, DOC, and DOCX files, 
                     converting unstructured resume data into structured information.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI-Powered Analysis</h4>
                  <p>Advanced AI algorithms analyze extracted data to identify skills, experience, 
                     education, and qualifications with 95%+ accuracy.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Smart Matching</h4>
                  <p>Our system automatically matches candidate profiles against job requirements, 
                     calculating match scores and highlighting missing qualifications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Used */}
          <div className="about-section">
            <h3>Technology Behind the Magic</h3>
            <div className="tech-grid">
              <div className="tech-item">
                <div className="tech-icon">OCR</div>
                <h4>Optical Character Recognition</h4>
                <p>Extracts text from various document formats with high accuracy</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">AI</div>
                <h4>Artificial Intelligence</h4>
                <p>Machine learning models for intelligent data analysis and pattern recognition</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">NLP</div>
                <h4>Natural Language Processing</h4>
                <p>Understands and processes human language from resume content</p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="about-section">
            <h3>Key Benefits That Make a Difference</h3>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">Save Time</div>
                <h4>Reduce Screening Time by 80%</h4>
                <ul>
                  <li>Analyze 100+ resumes in under 5 minutes</li>
                  <li>Instant match scores and rankings</li>
                  <li>Automated candidate shortlisting</li>
                  <li>Eliminate manual resume review</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Better Matches</div>
                <h4>Find Perfect Candidates Faster</h4>
                <ul>
                  <li>AI-powered skill matching</li>
                  <li>Experience level verification</li>
                  <li>Cultural fit assessment</li>
                  <li>Predictive success scoring</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Reduce Bias</div>
                <h4>Fair and Objective Evaluation</h4>
                <ul>
                  <li>Blind resume screening</li>
                  <li>Standardized scoring criteria</li>
                  <li>Diversity-friendly algorithms</li>
                  <li>Compliance with hiring standards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Helps Users Get Selected */}
          <div className="about-section">
            <h3>How It Helps You Get Selected</h3>
            <div className="benefits-container">
              <div className="benefit-item">
                <div className="benefit-icon">highlight</div>
                <h4>Highlights Missing Qualifications</h4>
                <p>Our system identifies gaps in your resume compared to job requirements, 
                   helping you add missing skills and experiences before applying.</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">score</div>
                <h4>Provides Match Scores</h4>
                <p>Get instant feedback on how well your resume matches specific positions, 
                   with detailed breakdowns of strengths and weaknesses.</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">optimize</div>
                <h4>Optimizes Your Resume</h4>
                <p>Receive AI-powered suggestions to improve your resume content, 
                   formatting, and keyword optimization for ATS systems.</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">competitive</div>
                <h4>Competitive Advantage</h4>
                <p>Stand out from other applicants with data-driven insights 
                   and professionally validated resume content.</p>
              </div>
            </div>
          </div>

          {/* Resume Optimization */}
          <div className="about-section">
            <h3>Transform Your Resume into a Winner</h3>
            <div className="missing-skills-grid">
              <div className="feature">
                <div className="feature-icon">Boost</div>
                <h4>ATS Optimization</h4>
                <ul>
                  <li><strong>Keyword Integration:</strong> Match job description perfectly</li>
                  <li><strong>Format Enhancement:</strong> ATS-friendly structure</li>
                  <li><strong>Content Optimization:</strong> Compelling language</li>
                  <li><strong>Technical Keywords:</strong> Industry-specific terms</li>
                  <li><strong>Score Improvement:</strong> 90%+ ATS match rate</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Impact</div>
                <h4>Stand Out from Competition</h4>
                <ul>
                  <li>Quantify your achievements with metrics</li>
                  <li>Highlight measurable business impact</li>
                  <li>Showcase leadership and growth</li>
                  <li>Demonstrate problem-solving skills</li>
                  <li>Present unique value proposition</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Success</div>
                <h4>Proven Results</h4>
                <ul>
                  <li><strong>4x More Interviews:</strong> Higher response rates</li>
                  <li><strong>3x Better Matches:</strong> Perfect job alignment</li>
                  <li><strong>50% Faster Hiring:</strong> Quicker process</li>
                  <li><strong>85% Recruiter Approval:</strong> Professional quality</li>
                  <li><strong>2.5x Salary Negotiation:</strong> Better offers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="about-section">
            <h3>Why Choose Our Platform</h3>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">95%</div>
                <h4>95% Accuracy Rate</h4>
                <ul>
                  <li>Industry-leading OCR and AI technology</li>
                  <li>Advanced machine learning algorithms</li>
                  <li>Continuous model improvement</li>
                  <li>Validated by Fortune 500 companies</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Time</div>
                <h4>Save 80% Time</h4>
                <ul>
                  <li>Reduce resume screening from hours to minutes</li>
                  <li>Automated candidate ranking</li>
                  <li>Instant match scores</li>
                  <li>Bulk processing capabilities</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Data</div>
                <h4>Data-Driven Decisions</h4>
                <ul>
                  <li>Make informed hiring choices with analytics</li>
                  <li>Detailed candidate insights</li>
                  <li>Performance tracking</li>
                  <li>ROI measurement tools</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Scale</div>
                <h4>Scalable Solution</h4>
                <ul>
                  <li>Handle from 10 to 10,000+ resumes efficiently</li>
                  <li>Cloud-based infrastructure</li>
                  <li>Enterprise-grade performance</li>
                  <li>24/7 availability</li>
                </ul>
              </div>
              
              <div className="feature">
                <div className="feature-icon">Lock</div>
                <h4>Privacy First</h4>
                <ul>
                  <li>Your data is encrypted and never shared</li>
                  <li>GDPR and CCPA compliant</li>
                  <li>SOC 2 Type II certified</li>
                  <li>Regular security audits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <h3>Start Hiring Smarter Today</h3>
            <p>Join 500+ companies that reduced their hiring time by 80% with our AI-powered resume validation.</p>
            <div className="cta-buttons">
              <button className="primary-btn">Try It Free</button>
              <button className="secondary-btn">See Results</button>
            </div>
          </div>
        </div>

        </div>
    </div>
  );
};

export default About;
