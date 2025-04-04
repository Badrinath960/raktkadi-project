import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { getAuthToken } from '../../services/authService';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Creates a new blood bag
 * @param {Object} bloodBagData - The blood bag data
 * @returns {Promise<Object>} The created blood bag
 */
export const createBloodBag = async (bloodBagData) => {
  try {
    const response = await api.post('/inventory/create/', bloodBagData);
    return response.data;
  } catch (error) {
    console.error('Error in createBloodBag:', error);
    throw new Error(
      `Failed to create blood bag: ${error.response?.data?.message || error.message}`
    );
  }
};

/**
 * Validates blood bag data before submission
 * @param {Object} data - The blood bag data to validate
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateBloodBagData = (data) => {
  const errors = {};
  
  // Validate volume_ml
  if (!data.volume_ml) {
    errors.volume_ml = 'Volume is required';
  } else if (data.volume_ml < 100 || data.volume_ml > 500) {
    errors.volume_ml = 'Volume must be between 100ml and 500ml';
  }
  
  // Validate collection_date
  if (!data.collection_date) {
    errors.collection_date = 'Collection date is required';
  } else {
    const collectionDate = new Date(data.collection_date);
    const today = new Date();
    
    // Reset time components for both dates to ensure accurate date comparison
    collectionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (collectionDate.getTime() > today.getTime()) {
      // Allow today and past dates only
      errors.collection_date = 'Collection date cannot be in the future';
    }
  }
  
  // Validate expiration_date
  if (!data.expiration_date) {
    errors.expiration_date = 'Expiration date is required';
  } else if (data.collection_date && data.expiration_date) {
    const collectionDate = new Date(data.collection_date);
    const expirationDate = new Date(data.expiration_date);
    
    if (expirationDate <= collectionDate) {
      errors.expiration_date = 'Expiration date must be after collection date';
    }
  }
  
  // Validate customer_email
  if (!data.customer_email) {
    errors.customer_email = 'Donor email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      errors.customer_email = 'Please enter a valid email address';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};