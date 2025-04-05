import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { REDIRECT_ROUTES, ROUTES } from '../utils/constants';
import FormInput from '../components/shared/form/FormInput';
import { 
  LogIn, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Loader,
  UserRound
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      if (!response.access || !response.user_type) {
        throw new Error('Invalid login response from server');
      }

      setSuccess('Login successful! Redirecting...');
      login(response.access, response.user_type);
      
      // Delay redirect for animation
      setTimeout(() => {
        const redirectPath = REDIRECT_ROUTES[response.user_type] || ROUTES.LOGIN;
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <motion.div 
        className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="flex justify-center">
            <motion.div 
              className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserRound className="h-10 w-10 text-red-600" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your RaktKadi account
          </p>
        </motion.div>

        

        <motion.form 
          className="mt-6 space-y-6" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {error && (
            <motion.div 
              className="rounded-md bg-red-50 p-4 border-l-4 border-red-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <button 
                  type="button" 
                  className="ml-auto" 
                  onClick={() => setError('')}
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="rounded-md bg-green-50 p-4 border-l-4 border-green-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </motion.div>
          )}

          <div className="space-y-4 p-4">
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              autoComplete="email"
              error={formErrors.email}
              label="Email Address"
              icon={<Mail className="h-4 w-4" />}
            />
            
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              error={formErrors.password}
              label="Password"
              icon={<Lock className="h-4 w-4" />}
            />
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right rounded-b-xl">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </span>
              )}
            </motion.button>
          </div>

          {/* Signup Link */}
          <motion.p 
            className="mt-4 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Don't have an account? 
            <motion.button 
              onClick={() => navigate('/signup')}
              className="ml-1 text-red-600 hover:underline font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Sign up
            </motion.button>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;