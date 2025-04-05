import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../services/authService';
import { USER_TYPES } from '../utils/constants';
import FormInput from '../components/shared/form/FormInput';
import { 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Map, 
  Hash, 
  Droplet, 
  Lock, 
  Loader 
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.contact) {
      errors.contact = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contact)) {
      errors.contact = 'Please enter a valid 10-digit contact number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.blood_group) {
      errors.blood_group = 'Blood group is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
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
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await registerUser(
        formData.name,
        formData.email,
        formData.password,
        USER_TYPES.CUSTOMERS,
        {
          contact: formData.contact,
          blood_group: formData.blood_group,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      );
      
      setSuccess('Registration successful! Please check your email for verification.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-200 flex items-center justify-center py-4 px-4 sm:px-4 lg:px-6 mt-16">
      <motion.div 
        className="max-w-5xl w-full bg-white p-8 rounded-xl shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-center">
            <motion.div 
              className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserPlus className="h-10 w-10 text-red-600" />
            </motion.div>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Join RaktKadi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to donate or request blood
          </p>
        </motion.div>

        <motion.div 
          className="bg-red-50 p-4 rounded-xl border-b border-red-100 mb-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-medium text-red-900 flex items-center">
            <UserPlus className="mr-2 text-red-500 h-5 w-5" />
            Customer Registration Form
          </h3>
        </motion.div>

        {(error || success) && (
          <motion.div 
            className={`rounded-md ${error ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'} p-4 mb-6`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              {error ? (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              )}
              <h3 className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                {error || success}
              </h3>
              <button 
                type="button" 
                className="ml-auto" 
                onClick={() => error ? setError(null) : setSuccess(null)}
              >
                <X className={`h-4 w-4 ${error ? 'text-red-500' : 'text-green-500'}`} />
              </button>
            </div>
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <FormInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                label="Full Name"
                error={formErrors.name}
                icon={<User className="h-4 w-4" />}
              />
              
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="email"
                label="Email"
                error={formErrors.email}
                icon={<Mail className="h-4 w-4" />}
              />
              
              <FormInput
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                label="Contact Number"
                error={formErrors.contact}
                icon={<Phone className="h-4 w-4" />}
              />
              
              <FormInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="new-password"
                label="Password"
                error={formErrors.password}
                icon={<Lock className="h-4 w-4" />}
              />
              
              <FormInput
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                autoComplete="new-password"
                label="Confirm Password"
                error={formErrors.confirmPassword}
                icon={<Lock className="h-4 w-4" />}
              />
              
              <FormInput
                type="select"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                options={bloodGroupOptions}
                placeholder="Select Blood Group"
                label="Blood Group"
                error={formErrors.blood_group}
                icon={<Droplet className="h-4 w-4" />}
              />
              
              <FormInput
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                label="Address"
                error={formErrors.address}
                icon={<MapPin className="h-4 w-4" />}
              />
              
              <FormInput
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                label="City"
                error={formErrors.city}
                icon={<Building className="h-4 w-4" />}
              />
              
              <FormInput
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                label="State"
                error={formErrors.state}
                icon={<Map className="h-4 w-4" />}
              />
              
              <FormInput
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                label="Pincode"
                error={formErrors.pincode}
                icon={<Hash className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right rounded-b-xl">
            <div className="flex space-x-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="w-1/2 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </span>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                className="w-1/2 flex justify-center py-3 px-4 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>

          <motion.p 
            className="mt-6 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Already have an account? 
            <motion.button 
              onClick={() => navigate('/login')}
              className="ml-1 text-red-600 hover:underline font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Sign in
            </motion.button>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;