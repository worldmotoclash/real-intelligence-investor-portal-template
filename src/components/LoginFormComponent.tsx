import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import PasswordResetDialog from './PasswordResetDialog';
import { validateLoginForm } from '@/utils/loginValidation';
import LoginFormFields from './LoginForm/LoginFormFields';
import { authenticateUser, getCurrentIpAddress, getIPLocation } from '@/services/loginService';
import { authenticateWithGoogle } from '@/services/googleAuthService';

const LoginFormComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [ipVerificationSent, setIpVerificationSent] = useState(false);
  const [locationInfo, setLocationInfo] = useState<{country: string; city: string} | null>(null);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Auto-login functionality
  useEffect(() => {
    const urlEmail = searchParams.get('user');
    const urlPassword = searchParams.get('pass');
    
    if (urlEmail && urlPassword && !autoLoginAttempted) {
      console.log('Auto-login credentials detected in URL');
      setEmail(urlEmail);
      setPassword(urlPassword);
      setAutoLoginAttempted(true);
      
      // Clear the URL parameters immediately for security
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('user');
      newSearchParams.delete('pass');
      setSearchParams(newSearchParams, { replace: true });
      
      // Attempt auto-login with a small delay to ensure state is set
      setTimeout(() => {
        attemptAutoLogin(urlEmail, urlPassword);
      }, 100);
    }
  }, [searchParams, autoLoginAttempted, setSearchParams]);
  
  const attemptAutoLogin = async (email: string, password: string) => {
    console.log('Attempting auto-login for:', email);
    setIsLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);
    
    try {
      const userData = await authenticateUser(email, password);
      
      if (userData) {
        setUser(userData);
        toast.success('Auto-login successful! Welcome back.');
        // Use replace to avoid back button issues
        navigate('/dashboard', { replace: true });
      } else {
        // Try to get location info for better error message
        try {
          const ip = await getCurrentIpAddress();
          const location = await getIPLocation(ip);
          setIpVerificationSent(true);
          setLocationInfo(location);
          toast.warning('Auto-login failed - IP verification required. Please check your email.');
        } catch (error) {
          console.error('Failed to get location info:', error);
          toast.error('Auto-login failed. Please enter your credentials manually.');
        }
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      toast.error('Auto-login failed. Please enter your credentials manually.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateLoginForm(email, password);
    
    if (!isValid) {
      setErrors(errors);
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);
    
    try {
      // Try to get the user's location info for a better message if needed
      const ip = await getCurrentIpAddress();
      const location = await getIPLocation(ip);
      
      const userData = await authenticateUser(email, password);
      
      if (userData) {
        setUser(userData);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        // Check if this was likely an IP verification issue
        if (email && password.length >= 6) {
          setIpVerificationSent(true);
          setLocationInfo(location);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);
    
    try {
      const userData = await authenticateWithGoogle();
      
      if (userData) {
        setUser(userData);
        toast.success('Google login successful');
        navigate('/dashboard');
      } else {
        // If authentication returned null but no error was thrown, it's likely an IP verification issue
        try {
          const ip = await getCurrentIpAddress();
          const location = await getIPLocation(ip);
          setIpVerificationSent(true);
          setLocationInfo(location);
        } catch (error) {
          console.error('Failed to get location information:', error);
          toast.error('Authentication failed. Please try logging in with your email and password.');
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Provide a more helpful error message
      if (error.message && error.message.includes('Authorization Error')) {
        toast.error('Google authentication failed. The OAuth client configuration may be incorrect or your account was not approved.');
      } else if (error.message && error.message.includes('popup_closed')) {
        toast.error('Google login was canceled. Please try again.');
      } else if (error.message && error.message.includes('Email not found')) {
        toast.error('Your Google account email is not registered as an approved investor. Please contact us for access.');
      } else {
        toast.error(`Google login failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Investor Portal</h2>
        <p className="text-gray-600">
          Sign in to access exclusive investment materials
        </p>
      </div>
      
      {ipVerificationSent ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-amber-800 mb-2">Location Verification Required</h3>
          <p className="text-amber-700 text-sm">
            We detected a login attempt from a new location
            {locationInfo && locationInfo.city !== 'Unknown' ? ` (${locationInfo.city}, ${locationInfo.country})` : ''}.
            For your security, we've sent a verification 
            email to your registered email address with details about the new location. 
            Please check your inbox and follow the verification instructions.
          </p>
        </div>
      ) : null}
      
      <LoginFormFields 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onForgotPassword={() => setForgotPasswordOpen(true)}
        onGoogleSignIn={handleGoogleSignIn}
        isGoogleLoading={isGoogleLoading}
      />
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Don't have access? <a href="/#contact" className="text-black font-medium hover:underline">Contact us</a> to request investor credentials.</p>
      </div>
      
      {/* Password Reset Dialog */}
      <PasswordResetDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </motion.div>
  );
};

export default LoginFormComponent;
