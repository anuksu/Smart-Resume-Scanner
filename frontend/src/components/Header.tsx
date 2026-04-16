import React from 'react';
import './Header.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  onSignOut?: () => void;
  onNavigate?: (screen: 'login' | 'signup' | 'personal' | 'about' | 'contact' | 'home') => void;
  currentScreen?: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onSignOut, onNavigate, currentScreen }) => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">
            <span className="logo-icon">📄</span>
          </div>
          <div className="logo-text-container">
            <span className="logo-text">SRS</span>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#home" className={currentScreen === 'home' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </a></li>
          <li><a href="#about" className={currentScreen === 'about' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); onNavigate?.('about'); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            About
          </a></li>
          <li><a href="#services" className={currentScreen === 'personal' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); onNavigate?.('personal'); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Services
          </a></li>
          <li><a href="#contact" className={currentScreen === 'contact' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Contact
          </a></li>
          {!isLoggedIn && (
            <li><a href="#signin" className={currentScreen === 'login' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); onNavigate?.('login'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In
            </a></li>
          )}
          {isLoggedIn && (
            <li><a href="#signout" onClick={onSignOut}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </a></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
