import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { login, error: authError, fieldErrors, clearErrors } = useAuth();

  const getFieldError = (field: string) =>
    fieldErrors?.find(fe => fe.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearErrors();

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // authError is set in context
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-page">
      <div className="auth-bg-gradient" />

      <div className="auth-container">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <Activity size={22} className="text-white" />
          </div>
          <span className="auth-logo-text">Physio<span>AI</span></span>
        </Link>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue your recovery journey</p>
          </div>

          {/* Error banner */}
          {displayError && (
            <div className="auth-error-banner" role="alert">
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(''); clearErrors(); }}
                  placeholder="you@example.com"
                  className={`form-input ${getFieldError('email') ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getFieldError('email') && (
                <p className="field-error">{getFieldError('email')}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password" className="form-label">Password</label>
                <Link to="/forgot-password" className="form-link-small">Forgot password?</Link>
              </div>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(''); clearErrors(); }}
                  placeholder="••••••••"
                  className={`form-input ${getFieldError('password') ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="field-error">{getFieldError('password')}</p>
              )}
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-footer-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
