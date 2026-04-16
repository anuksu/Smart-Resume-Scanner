import React from 'react';
import './Services.css';

interface ServicesProps {
  onBack: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBack }) => {
  return (
    <div className="services-container">
      <div className="services-page">
        {/* Hero Section */}
        <div className="services-hero">
          <div className="services-hero-content">
            <h2>Our Services</h2>
            <p className="services-hero-subtitle">
              Powerful AI-driven tools to transform your recruitment process and help candidates land their dream jobs
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-content">
          <div className="services-section">
            <h3>What We Offer</h3>
            <p className="services-desc">
              From individual resume optimization to enterprise-level recruitment solutions, 
              we have the right tools for every hiring need.
            </p>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">OCR</div>
                <h4>Resume Scanning & OCR</h4>
                <p>Upload any resume format and our advanced OCR engine extracts every detail automatically. Supports PDF, DOC, DOCX, and image files.</p>
                <ul className="service-features">
                  <li>Multi-format document support</li>
                  <li>95% extraction accuracy</li>
                  <li>Instant data parsing</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">AI</div>
                <h4>AI Resume Analysis</h4>
                <p>Our AI engine evaluates resume quality, identifies strengths and weaknesses, and provides a detailed score with actionable feedback.</p>
                <ul className="service-features">
                  <li>Comprehensive quality scoring</li>
                  <li>Skill gap identification</li>
                  <li>Personalized improvement tips</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">Match</div>
                <h4>Job Matching</h4>
                <p>Automatically match resumes against job descriptions using AI-powered semantic analysis. Get instant compatibility scores.</p>
                <ul className="service-features">
                  <li>Semantic skill matching</li>
                  <li>Experience level validation</li>
                  <li>Real-time match scoring</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">ATS</div>
                <h4>ATS Optimization</h4>
                <p>Ensure your resume passes Applicant Tracking Systems. Our tool checks keyword density, formatting, and structure compliance.</p>
                <ul className="service-features">
                  <li>Keyword optimization</li>
                  <li>Format compliance check</li>
                  <li>ATS score prediction</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">Bulk</div>
                <h4>Bulk Resume Processing</h4>
                <p>Process hundreds of resumes simultaneously. Perfect for HR teams and recruiters handling high-volume hiring campaigns.</p>
                <ul className="service-features">
                  <li>Batch upload and processing</li>
                  <li>Automated candidate ranking</li>
                  <li>Export-ready reports</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">Compare</div>
                <h4>Candidate Comparison</h4>
                <p>Compare multiple candidates side-by-side with detailed breakdowns of skills, experience, and overall fit for the role.</p>
                <ul className="service-features">
                  <li>Side-by-side analysis</li>
                  <li>Weighted scoring criteria</li>
                  <li>Visual comparison charts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="services-section">
            <h3>Choose Your Plan</h3>
            <p className="services-desc">
              Simple, transparent pricing. Start free and scale as you grow.
            </p>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h4>Free</h4>
                  <div className="pricing-amount">
                    <span className="price">$0</span>
                    <span className="period">/month</span>
                  </div>
                  <p className="pricing-tagline">Perfect for individuals</p>
                </div>
                <ul className="pricing-features">
                  <li>3 resume scans per month</li>
                  <li>Basic AI analysis</li>
                  <li>ATS compatibility check</li>
                  <li>PDF & DOC support</li>
                  <li>Email support</li>
                </ul>
                <button className="pricing-btn pricing-btn-outline">Get Started Free</button>
              </div>

              <div className="pricing-card pricing-card-popular">
                <div className="pricing-badge">Most Popular</div>
                <div className="pricing-header">
                  <h4>Pro</h4>
                  <div className="pricing-amount">
                    <span className="price">$29</span>
                    <span className="period">/month</span>
                  </div>
                  <p className="pricing-tagline">For job seekers & small teams</p>
                </div>
                <ul className="pricing-features">
                  <li>Unlimited resume scans</li>
                  <li>Advanced AI analysis & scoring</li>
                  <li>Full ATS optimization</li>
                  <li>Job matching (up to 50/month)</li>
                  <li>Candidate comparison tool</li>
                  <li>Priority support</li>
                  <li>Export reports (PDF & CSV)</li>
                </ul>
                <button className="pricing-btn pricing-btn-primary">Start Pro Trial</button>
              </div>

              <div className="pricing-card">
                <div className="pricing-header">
                  <h4>Enterprise</h4>
                  <div className="pricing-amount">
                    <span className="price">$99</span>
                    <span className="period">/month</span>
                  </div>
                  <p className="pricing-tagline">For companies & recruiters</p>
                </div>
                <ul className="pricing-features">
                  <li>Everything in Pro</li>
                  <li>Bulk processing (10,000+/month)</li>
                  <li>Unlimited job matching</li>
                  <li>API access & integrations</li>
                  <li>Custom scoring criteria</li>
                  <li>Team collaboration tools</li>
                  <li>Dedicated account manager</li>
                  <li>SLA & uptime guarantee</li>
                </ul>
                <button className="pricing-btn pricing-btn-outline">Contact Sales</button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="services-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>What file formats do you support?</h4>
                <p>We support PDF, DOC, DOCX, RTF, and image files (PNG, JPG). Our OCR engine can extract text from scanned documents as well.</p>
              </div>
              <div className="faq-item">
                <h4>How accurate is the AI analysis?</h4>
                <p>Our AI achieves 95% accuracy in resume parsing and skill extraction, continuously improving through machine learning.</p>
              </div>
              <div className="faq-item">
                <h4>Can I cancel my subscription anytime?</h4>
                <p>Yes, you can cancel anytime. No long-term contracts. Your data remains accessible for 30 days after cancellation.</p>
              </div>
              <div className="faq-item">
                <h4>Is my data secure?</h4>
                <p>Absolutely. All data is encrypted at rest and in transit. We are GDPR and SOC 2 compliant. Your resumes are never shared.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
