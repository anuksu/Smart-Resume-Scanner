import React, { useState } from 'react';
import './Contact.css';

interface ContactProps {
  onBack: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send message.');
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-page">
        {/* Hero */}
        <div className="contact-hero">
          <div className="contact-hero-content">
            <h2>Get in Touch</h2>
            <p className="contact-hero-subtitle">
              Have a question, feedback, or need support? We're here to help.
            </p>
          </div>
        </div>

        <div className="contact-content">
          {/* Contact Method Cards */}
          <div className="contact-section">
            <h3>Reach Us Anytime</h3>
            <div className="contact-cards-grid">
              <div className="contact-card">
                <div className="contact-card-icon">Email</div>
                <h4>Email Us</h4>
                <p>Get a response within 24 hours</p>
                <a href="mailto:support@srs.com" className="contact-link">support@srs.com</a>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">Phone</div>
                <h4>Call Us</h4>
                <p>Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                <a href="tel:+18001234567" className="contact-link">+1 (800) 123-4567</a>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">Chat</div>
                <h4>Live Chat</h4>
                <p>Instant support from our team</p>
                <span className="contact-link">Available Mon - Fri</span>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">Office</div>
                <h4>Visit Us</h4>
                <p>Our headquarters</p>
                <span className="contact-link">123 Innovation Drive, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-section">
            <h3>Send Us a Message</h3>
            <p className="contact-desc">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit}>
                {error && <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #feb2b2' }}>{error}</div>}
                {submitted && <div style={{ color: '#38a169', background: '#f0fff4', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #9ae6b4' }}>Message sent successfully!</div>}
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="contact-form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Office Hours */}
          <div className="contact-section">
            <h3>Office Hours</h3>
            <div className="office-hours-grid">
              <div className="office-hours-card">
                <h4>Support Team</h4>
                <ul className="hours-list">
                  <li><span>Monday - Friday</span><span>9:00 AM - 6:00 PM EST</span></li>
                  <li><span>Saturday</span><span>10:00 AM - 2:00 PM EST</span></li>
                  <li><span>Sunday</span><span>Closed</span></li>
                </ul>
              </div>
              <div className="office-hours-card">
                <h4>Sales Team</h4>
                <ul className="hours-list">
                  <li><span>Monday - Friday</span><span>8:00 AM - 7:00 PM EST</span></li>
                  <li><span>Saturday</span><span>9:00 AM - 3:00 PM EST</span></li>
                  <li><span>Sunday</span><span>Closed</span></li>
                </ul>
              </div>
              <div className="office-hours-card">
                <h4>Emergency Support</h4>
                <ul className="hours-list">
                  <li><span>Enterprise Clients</span><span>24/7 Available</span></li>
                  <li><span>Pro Clients</span><span>Mon - Sat</span></li>
                  <li><span>Free Tier</span><span>Email Only</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="contact-section">
            <h3>Connect With Us</h3>
            <p className="contact-desc">
              Follow us on social media for the latest updates, tips, and industry insights.
            </p>
            <div className="social-grid">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h4>LinkedIn</h4>
                <p>Follow for hiring insights</p>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <h4>Twitter / X</h4>
                <p>Latest news and updates</p>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </div>
                <h4>GitHub</h4>
                <p>Open source contributions</p>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h4>YouTube</h4>
                <p>Tutorials and demos</p>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="contact-section">
            <h3>Quick Links</h3>
            <div className="quick-links-grid">
              <div className="quick-link-card">
                <h4>FAQ</h4>
                <p>Find answers to commonly asked questions about our platform, pricing, and features.</p>
                <span className="quick-link-action">View FAQ</span>
              </div>
              <div className="quick-link-card">
                <h4>Documentation</h4>
                <p>Explore our detailed guides, API docs, and integration tutorials.</p>
                <span className="quick-link-action">Read Docs</span>
              </div>
              <div className="quick-link-card">
                <h4>Support Portal</h4>
                <p>Submit a ticket, track your requests, and access our knowledge base.</p>
                <span className="quick-link-action">Open Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
