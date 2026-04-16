import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import PersonalDetails from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import RoleSelection from './components/RoleSelection';
import ResumeUpload from './components/ResumeUpload';
import JobDescription from './components/JobDescription';
import ResumeMatchResults from './components/ResumeMatchResults';
import HiringForm from './components/HiringForm';
import SignIn from './components/SignIn';
import './App.css';

function App() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'personal' | 'about' | 'contact' | 'role' | 'resume-upload' | 'job-description' | 'match-results' | 'hiring-form' | 'home'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [resumeValidation, setResumeValidation] = useState<{[key: string]: 'selected' | 'not_selected' | 'pending'}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string, user: any) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    setScreen('role');
  };

  const handleSignOut = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUploadedResumes([]);
    setAnalysisResults(null);
    setScreen('home');
  };

  const handleNavigate = (screen: 'login' | 'signup' | 'personal' | 'about' | 'contact' | 'role' | 'resume-upload' | 'job-description' | 'match-results' | 'hiring-form' | 'home') => {
    setScreen(screen);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedResumes(prev => [...prev, ...files]);
    setIsProcessing(true);
    
    // Simulate AI/OCR validation process
    setTimeout(() => {
      const validation: {[key: string]: 'selected' | 'not_selected'} = {};
      files.forEach(file => {
        // Simulate AI validation logic (randomly select for demo)
        validation[file.name] = Math.random() > 0.5 ? 'selected' : 'not_selected';
      });
      setResumeValidation(prev => ({...prev, ...validation}));
      setIsProcessing(false);
    }, 2000);
  };

  const getValidationStatus = (fileName: string) => {
    return resumeValidation[fileName] || 'pending';
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} onNavigate={handleNavigate} currentScreen={screen} />
      <main className="main-content">
        {screen === 'role' ? (
          <RoleSelection onSelectRole={(role) => setScreen(role === 'seeker' ? 'resume-upload' : 'hiring-form')} />
        ) : screen === 'resume-upload' ? (
          <ResumeUpload onBack={() => setScreen('role')} onNext={() => setScreen('job-description')} onFilesChange={(files) => setUploadedResumes(files)} />
        ) : screen === 'job-description' ? (
          <JobDescription
            onBack={() => setScreen('resume-upload')}
            onNext={(results: any) => { setAnalysisResults(results); setScreen('match-results'); }}
            resumeFile={uploadedResumes[0] || null}
            authToken={authToken}
          />
        ) : screen === 'match-results' ? (
          <ResumeMatchResults onBack={() => setScreen('job-description')} analysisResults={analysisResults} />
        ) : screen === 'hiring-form' ? (
          <HiringForm onBack={() => setScreen('role')} />
        ) : screen === 'personal' ? (
          <PersonalDetails onBack={() => setScreen('login')} />
        ) : screen === 'about' ? (
          <About onBack={() => setScreen('home')} />
        ) : screen === 'contact' ? (
          <Contact onBack={() => setScreen('home')} />
        ) : screen === 'login' ? (
          <SignIn onLogin={handleLogin} onSignUp={() => setScreen('signup')} />
        ) : screen === 'signup' ? (
          <section className="auth-screen">
            <div className="auth-container">
              <SignUp onSwitchToLogin={() => setScreen('login')} />
            </div>
          </section>
        ) : (
          <div className="home-page">
            {/* Hero Banner */}
            <section className="hero-banner">
              <div className="hero-banner-content">
                <div className="hero-badge">Resume Intelligence System</div>
                <h1>Smart Resume Scanning</h1>
                <p>Upload your resume and let AI automatically extract your details to fill job applications instantly</p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => setScreen('login')}>Get Started</button>
                  <button className="btn-secondary">Learn More</button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">AI</div>
                  </div>
                  <h4>AI-Powered Analysis</h4>
                  <p>Advanced machine learning algorithms analyze resumes with 95% accuracy</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">OCR</div>
                  </div>
                  <h4>OCR Extraction</h4>
                  <p>Optical character recognition extracts data from any document format</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">+</div>
                  </div>
                  <h4>Smart Matching</h4>
                  <p>Automatically match candidates to job requirements with precision scoring</p>
                </div>
              </div>
            </section>

            {/* Demo Section */}
            <section className="demo-section">
              <div className="demo-section-header">
                <div className="section-label">Process Flow</div>
                <h2>Resume Validation Pipeline</h2>
                <p>Step-by-step process from upload to final decision</p>
              </div>

              <div className="process-flow">
                {/* Step 1: Upload Resume */}
                <div className="process-step">
                  <div className="step-header">
                    <div className="step-number">1</div>
                    <div className="step-title">Upload Resume</div>
                  </div>
                  <div className="step-content">
                    <div className="resume-document">
                      <div className="resume-doc-label">Uploaded</div>
                      <div className="resume-header">
                        <div className="resume-info">
                          <div className="resume-left">
                            <div className="resume-name">Alexander Chen</div>
                            <div className="resume-title">Senior Full Stack Developer</div>
                          </div>
                          <div className="resume-right">
                            <div className="resume-contact">
                              <span>alex.chen@email.com</span>
                              <span>XXX-XXX-9087</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="resume-content">
                        <div className="resume-section">
                          <div className="section-title">SUMMARY</div>
                          <div className="summary-content">
                            <p>Experienced senior full stack developer specializing in react & node.js, skilled in cloud technologies and team leadership, focused on performance optimization and modern architecture</p>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">EXPERIENCE</div>
                          <div className="experience-item">
                            <div className="company-name">TechCorp Solutions</div>
                            <div className="job-title">Senior Software Engineer</div>
                            <div className="job-duration">2021 - Present</div>
                            <ul className="experience-bullets">
                              <li>full-stack web applications using React, Node.js, and AWS</li>
                              <li>Led team of 5 developers in implementing microservices architecture</li>
                              <li>Improved application performance by 40% through optimization initiatives</li>
                            </ul>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">CERTIFICATIONS</div>
                          <div className="certification-list">
                            <div className="certification-item">
                              <div className="cert-name">AWS Certified Solutions Architect</div>
                            </div>
                            <div className="certification-item">
                              <div className="cert-name">Azure Fundamentals</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="process-arrow">→</div>

                {/* Step 2: AI Scanning */}
                <div className="process-step">
                  <div className="step-header">
                    <div className="step-number">2</div>
                    <div className="step-title">OCR and AI Scanning</div>
                  </div>
                  <div className="step-content">
                    <div className="resume-document scanning">
                      <div className="resume-doc-label">Scanning</div>
                      <div className="resume-header">
                        <div className="resume-info">
                          <div className="resume-left">
                            <div className="resume-name">Alexander Chen</div>
                            <div className="resume-title">Senior Full Stack Developer</div>
                          </div>
                          <div className="resume-right">
                            <div className="resume-contact">
                              <span>alex.chen@email.com</span>
                              <span>XXX-XXX-9087</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="resume-content">
                        <div className="resume-section">
                          <div className="section-title">SUMMARY</div>
                          <div className="summary-content">
                            <p>Experienced senior full stack developer specializing in react & node.js, skilled in cloud technologies and team leadership, focused on performance optimization and modern architecture</p>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">EXPERIENCE</div>
                          <div className="experience-item">
                            <div className="company-name">TechCorp Solutions</div>
                            <div className="job-title">Senior Software Engineer</div>
                            <div className="job-duration">2021 - Present</div>
                            <ul className="experience-bullets">
                              <li>full-stack web applications using React, Node.js, and AWS</li>
                              <li>Led team of 5 developers in implementing microservices architecture</li>
                              <li>Improved application performance by 40% through optimization initiatives</li>
                            </ul>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">CERTIFICATIONS</div>
                          <div className="certification-list">
                            <div className="certification-item">
                              <div className="cert-name">AWS Certified Solutions Architect</div>
                            </div>
                            <div className="certification-item">
                              <div className="cert-name">Azure Fundamentals</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="scan-line"></div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="process-arrow">→</div>

                {/* Step 3: Backend Validation */}
                <div className="process-step">
                  <div className="step-header">
                    <div className="step-number">3</div>
                    <div className="step-title">Validation</div>
                  </div>
                  <div className="step-content">
                    <div className="extraction-results">
                      <div className="results-header">
                        <div className="results-title">Validation Results</div>
                      </div>
                      <div className="result-item">
                        <div className="result-content">
                          <div className="result-label">Validation Status</div>
                          <div className="result-value">AI/OCR Analysis Complete</div>
                        </div>
                      </div>
                      <div className="result-item">
                        <div className="result-content">
                          <div className="result-label">Match Score</div>
                          <div className="result-value match-highlight">85% Match Found</div>
                        </div>
                      </div>
                      <div className="result-item">
                        <div className="result-content">
                          <div className="result-label">Key Skills Detected</div>
                          <div className="result-value">React, Node.js, AWS, Azure</div>
                        </div>
                      </div>
                      <div className="result-item">
                        <div className="result-content">
                          <div className="result-label">Experience Level</div>
                          <div className="result-value">Senior Developer</div>
                        </div>
                      </div>
                      <div className="result-item result-decision">
                        <div className="result-content">
                          <div className="result-label">Decision</div>
                          <div className="result-value decision-selected">SELECTED for Review</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="process-arrow">→</div>

                {/* Step 4: Final Decision */}
                <div className="process-step">
                  <div className="step-header">
                    <div className="step-number">4</div>
                    <div className="step-title">Final Decision</div>
                  </div>
                  <div className="step-content">
                    <div className="resume-document resume-selected">
                      <div className="resume-doc-label label-selected">Selected</div>
                      <div className="resume-header">
                        <div className="resume-info">
                          <div className="resume-left">
                            <div className="resume-name">Alexander Chen</div>
                            <div className="resume-title">Senior Full Stack Developer</div>
                          </div>
                          <div className="resume-right">
                            <div className="resume-contact">
                              <span>alex.chen@email.com</span>
                              <span>XXX-XXX-9087</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="resume-content">
                        <div className="resume-section">
                          <div className="section-title">SUMMARY</div>
                          <div className="summary-content">
                            <p>Experienced senior full stack developer specializing in react & node.js, skilled in cloud technologies and team leadership, focused on performance optimization and modern architecture</p>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">EXPERIENCE</div>
                          <div className="experience-item">
                            <div className="company-name">TechCorp Solutions</div>
                            <div className="job-title">Senior Software Engineer</div>
                            <div className="job-duration">2021 - Present</div>
                            <ul className="experience-bullets">
                              <li>full-stack web applications using React, Node.js, and AWS</li>
                              <li>Led team of 5 developers in implementing microservices architecture</li>
                              <li>Improved application performance by 40% through optimization initiatives</li>
                            </ul>
                          </div>
                        </div>
                        <div className="resume-section">
                          <div className="section-title">CERTIFICATIONS</div>
                          <div className="certification-list">
                            <div className="certification-item">
                              <div className="cert-name">AWS Certified Solutions Architect</div>
                            </div>
                            <div className="certification-item">
                              <div className="cert-name">Azure Fundamentals</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="selected-watermark">SELECTED</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Resumes Processed</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">3s</div>
                <div className="stat-label">Avg. Processing Time</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Supported Formats</div>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
