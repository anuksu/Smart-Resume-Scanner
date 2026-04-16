import React, { useState } from 'react';
import './SignIn.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface SignInProps {
  onLogin: (token: string, user: any) => void;
  onSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed.');
      }

      const token = data.user?.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      onLogin(token, data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your Smart Resume Scanning account</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>
            
            <button type="submit" className="auth-btn primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <button className="auth-link" onClick={onSignUp}>Sign Up</button></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
