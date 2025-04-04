import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DropletIcon, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Calendar,
  CalendarClock,
  Loader
} from 'lucide-react';
import { createBloodBag, validateBloodBagData } from '../../../services/shared/bloodBagManagement';

const BloodBagCreationForm = () => {
  const [formData, setFormData] = useState({
    volume_ml: 250,
    collection_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    customer_email: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  // Calculate default expiration date (42 days from collection)
  const calculateExpirationDate = (collectionDate) => {
    const date = new Date(collectionDate);
    date.setDate(date.getDate() + 42); // Blood typically expires in 42 days
    return date.toISOString().split('T')[0];
  };
  
  // Set initial expiration date
  useState(() => {
    setFormData(prev => ({
      ...prev,
      expiration_date: calculateExpirationDate(prev.collection_date)
    }));
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'collection_date') {
      const expirationDate = calculateExpirationDate(value);
      setFormData({
        ...formData,
        [name]: value,
        expiration_date: expirationDate
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateBloodBagData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      await createBloodBag(formData);
      
      // Reset form
      setFormData({
        volume_ml: 250,
        collection_date: new Date().toISOString().split('T')[0],
        expiration_date: calculateExpirationDate(new Date().toISOString().split('T')[0]),
        customer_email: '',
      });
      
      setSubmitMessage({
        type: 'success',
        text: 'Blood bag created successfully!'
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to create blood bag. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <DropletIcon className="mr-2 text-red-500" />
              Create Blood Donation Bag
            </h2>
            <p className="text-gray-600 mt-1">Register a new blood donation</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Error Message */}
            {submitMessage.type === 'error' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center"
              >
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-600 text-sm">{submitMessage.text}</p>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {submitMessage.type === 'success' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-100 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center"
              >
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-green-800 font-semibold">Success</p>
                  <p className="text-green-600 text-sm">{submitMessage.text}</p>
                </div>
              </motion.div>
            )}

            {/* Create Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl">
              <div className="bg-red-50 p-4 rounded-t-xl border-b border-red-100">
                <h3 className="text-lg font-medium text-red-900 flex items-center">
                  <DropletIcon className="mr-2 text-red-500 h-5 w-5" />
                  Blood Bag Information
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Volume Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 flex items-center md:justify-end">
                    <DropletIcon className="h-4 w-4 mr-1 text-gray-500 md:mr-2" />
                    Volume (ml)
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      name="volume_ml"
                      value={formData.volume_ml}
                      onChange={handleChange}
                      min="100"
                      max="500"
                      className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        errors.volume_ml ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.volume_ml && (
                      <p className="mt-1 text-sm text-red-600">{errors.volume_ml}</p>
                    )}
                  </div>
                </div>
                
                {/* Collection Date Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 flex items-center md:justify-end">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500 md:mr-2" />
                    Collection Date
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="date"
                      name="collection_date"
                      value={formData.collection_date}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        errors.collection_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.collection_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.collection_date}</p>
                    )}
                  </div>
                </div>
                
                {/* Expiration Date Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 flex items-center md:justify-end">
                    <CalendarClock className="h-4 w-4 mr-1 text-gray-500 md:mr-2" />
                    Expiration Date
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="date"
                      name="expiration_date"
                      value={formData.expiration_date}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        errors.expiration_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.expiration_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiration_date}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Default expiration is 42 days after collection
                    </p>
                  </div>
                </div>
                
                {/* Donor Email Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 flex items-center md:justify-end">
                    <Mail className="h-4 w-4 mr-1 text-gray-500 md:mr-2" />
                    Donor Email
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="donor@example.com"
                      className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        errors.customer_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.customer_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-xl">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <DropletIcon className="h-4 w-4 mr-2" />
                      Create Blood Bag
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BloodBagCreationForm;