import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-navy font-bold text-2xl">
            <Logo size={36} className="text-teal" />
            PhysioAI
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-navy">Reset your password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-surface-alt sm:rounded-2xl sm:px-10">
          {submitted ? (
            <div className="text-center">
              <div className="bg-success/10 text-success p-4 rounded-xl mb-6">
                Password reset link has been simulated.
              </div>
              <p className="text-navy-light mb-6">
                (This feature is not yet connected to email delivery - UI only)
              </p>
              <Link to="/login" className="font-medium text-teal hover:text-teal-dark">
                Back to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="bg-info/10 text-info text-sm p-3 rounded-lg border border-info/20 mb-4">
                This feature is not yet connected to email delivery (UI only).
              </div>
              <div>
                <label className="block text-sm font-medium text-navy">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-surface-alt rounded-lg shadow-sm placeholder-navy-light focus:outline-none focus:ring-teal focus:border-teal sm:text-sm bg-surface/50"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal transition-colors"
                >
                  Send reset link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
