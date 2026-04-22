import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SetPasswordPageProps {
  redirectTo?: string;
}

const SetPasswordPage: React.FC<SetPasswordPageProps> = ({ redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [validatingToken, setValidatingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength criteria
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Extract access token from URL hash or query params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(location.search);
    
    let token = hashParams.get('access_token') || queryParams.get('access_token');
    let type = hashParams.get('type') || queryParams.get('type');
    
    // Supabase recovery flow uses #access_token=xxx&type=recovery
    if (token && type === 'recovery') {
      setAccessToken(token);
      validateToken(token);
    } else {
      setTokenValid(false);
      setValidatingToken(false);
      setError('Invalid or missing password reset token. Please request a new password reset link.');
    }
  }, [location]);

  const validateToken = async (token: string) => {
    try {
      // Try to verify the token by attempting to set a session
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        setError('This password reset link has expired or is invalid. Please request a new one.');
      } else {
        setTokenValid(true);
      }
    } catch (err) {
      console.error('Error validating token:', err);
      setTokenValid(false);
      setError('Unable to validate reset link. Please request a new one.');
    } finally {
      setValidatingToken(false);
    }
  };

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(criteria => criteria === true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!isPasswordStrong()) {
      setError('Please meet all password strength requirements');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update the user's password using the access token
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) {
        console.error('Password update error:', error);
        if (error.message.includes('expired')) {
          setError('This password reset link has expired. Please request a new one.');
        } else {
          setError(error.message || 'Failed to set password. Please try again.');
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate(redirectTo);
        }, 3000);
      }
    } catch (err) {
      console.error('Error setting password:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetLink = async () => {
    // Get email from URL or prompt user
    const urlParams = new URLSearchParams(location.search);
    const email = urlParams.get('email');
    
    if (email) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/set-password`,
        });
        
        if (error) {
          setError(error.message);
        } else {
          setError(null);
          alert('Password reset link has been sent to your email.');
        }
      } catch (err) {
        setError('Failed to send reset link. Please contact support.');
      }
    } else {
      setError('Please provide your email address to request a new reset link.');
    }
  };

  // Loading state while validating token
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleResendResetLink}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full mt-3 text-blue-600 py-2 font-semibold hover:text-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Set Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been set. You will be redirected to your dashboard in a few seconds.
          </p>
          <button
            onClick={() => navigate(redirectTo)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <img 
              src="https://www.cloudhospitals.ai/assets/image-Bi3hJeSg.png" 
              alt="CloudHospitals.ai" 
              className="h-12 mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900">Set Your Password</h1>
            <p className="text-gray-600 mt-2">Create a secure password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: `${Object.values(passwordStrength).filter(Boolean).length * 20}%` 
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.length ? '?' : '?'}</span> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.uppercase ? '?' : '?'}</span> Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.lowercase ? '?' : '?'}</span> Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.number ? '?' : '?'}</span> Number
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.special ? '?' : '?'}</span> Special character
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordStrong() || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting Password...
                </div>
              ) : (
                'Set Password & Continue'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have a password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;