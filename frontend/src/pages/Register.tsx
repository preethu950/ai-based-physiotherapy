import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a letter', test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
];

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError, fieldErrors, clearErrors } = useAuth();

  const getFieldError = (field: string) =>
    fieldErrors?.find(fe => fe.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearErrors();

    if (!name || !email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    if (!acceptedTerms) {
      setLocalError('You must accept the medical disclaimer to continue');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
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
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start your free recovery journey today</p>
          </div>

          {/* Error banner */}
          {displayError && (
            <div className="auth-error-banner" role="alert">
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setLocalError(''); clearErrors(); }}
                  placeholder="Jane Smith"
                  className={`form-input ${getFieldError('name') ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getFieldError('name') && <p className="field-error">{getFieldError('name')}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(''); clearErrors(); }}
                  placeholder="you@example.com"
                  className={`form-input ${getFieldError('email') ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getFieldError('email') && <p className="field-error">{getFieldError('email')}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(''); clearErrors(); }}
                  onFocus={() => setShowPasswordHints(true)}
                  placeholder="Min. 8 characters"
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
              {getFieldError('password') && <p className="field-error">{getFieldError('password')}</p>}

              {/* Password hints */}
              {showPasswordHints && password.length > 0 && (
                <div className="password-hints">
                  {passwordRequirements.map(req => (
                    <div key={req.label} className={`password-hint ${req.test(password) ? 'hint-pass' : 'hint-fail'}`}>
                      <CheckCircle2 size={13} />
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medical disclaimer checkbox */}
            <label className="disclaimer-checkbox">
              <div className="checkbox-wrapper">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => { setAcceptedTerms(e.target.checked); setLocalError(''); }}
                  className="hidden-checkbox"
                />
                <div className={`custom-checkbox ${acceptedTerms ? 'checkbox-checked' : ''}`}>
                  {acceptedTerms && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              <span className="disclaimer-text">
                I understand that PhysioAI is <strong>not a medical tool</strong> and I should consult a doctor if I feel pain.
              </span>
            </label>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
