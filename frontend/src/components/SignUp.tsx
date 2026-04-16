import React, { useState } from 'react';
import './SignUp.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface SignUpProps {
  onSwitchToLogin: () => void;
  onSignUp?: (token: string, user: any) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin, onSignUp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Signup failed.');
      }

      setSuccess('Account created successfully! Redirecting to Sign In...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join Smart Resume Scanning to streamline your job applications</p>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success" style={{ color: '#38a169', background: '#f0fff4', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #9ae6b4' }}>{success}</div>}
        
        <div className="form-group">
          <label htmlFor="signup-name">Full Name</label>
          <input type="text" id="signup-name" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
        </div>
        
        <div className="form-group">
          <label htmlFor="signup-email">Email Address</label>
          <input type="email" id="signup-email" placeholder="Enter your email address" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>
        
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" placeholder="Create a strong password (min 6 chars)" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </div>
        
        <button type="submit" className="auth-btn primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>Already have an account? <button className="auth-link" onClick={onSwitchToLogin}>Sign In</button></p>
      </div>
    </div>
  );
};

export default SignUp;
