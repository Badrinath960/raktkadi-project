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
 * Fetches all blood requests for the blood bank
 * @returns {Promise<Array>} Array of blood requests
 */
export const fetchBloodRequests = async () => {
  try {
    const response = await api.get('/inventory/blood-requests/');
    return response.data;
  } catch (error) {
    console.error('Error in fetchBloodRequests:', error);
    throw new Error(
      `Failed to fetch blood requests: ${error.response?.data?.message || error.message}. ` +
      `If this persists, please try logging out and back in.`
    );
  }
};

/**
 * Responds to a blood request (approve or reject)
 * @param {string} requestId - The ID of the request to respond to
 * @param {string} status - The status (APPROVED or REJECTED)
 * @param {string|null} rejectionReason - Reason for rejection (required if status is REJECTED)
 * @param {string} notes - Additional notes for the response
 * @returns {Promise<Object>} The updated request
 */
export const respondToBloodRequest = async (requestId, status, rejectionReason = null, notes = '') => {
    try {
      const response = await api.put(`/inventory/respond/${requestId}/`, {
        status,
        rejection_reason: rejectionReason,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error in respondToBloodRequest:', error);
      
      // Check if it's a 500 error but the operation might have succeeded
      if (error.response && error.response.status === 500) {
        // Log the specific error for debugging
        console.warn('Server returned 500, but the operation might have succeeded. Checking status...');
        
        // Wait a moment to allow the server to complete the operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Try to fetch the updated request to verify if the operation succeeded
          const checkResponse = await api.get(`/inventory/blood-requests/`);
          const updatedRequest = checkResponse.data.find(req => req.id === requestId);
          
          if (updatedRequest && updatedRequest.status === status) {
            console.log('Request was successfully updated despite 500 error');
            return updatedRequest;
          }
        } catch (checkError) {
          console.error('Error checking request status:', checkError);
          // Continue with the original error if the check fails
        }
      }
      
      throw new Error(`Failed to respond to blood request: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmitResponse = async () => {
    try {
      if (responseStatus === 'REJECTED' && !rejectionReason) {
        showSnackbarMessage('Rejection reason is required', 'error');
        return;
      }
  
      try {
        await respondToBloodRequest(
          selectedRequest.id,
          responseStatus,
          responseStatus === 'REJECTED' ? rejectionReason : null,
          notes
        );
        
        showSnackbarMessage(`Request ${responseStatus.toLowerCase()} successfully`, 'success');
        handleCloseDialog();
        loadBloodRequests(); // Reload the data
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Check if it's the specific 500 error we're handling
        if (apiError.message && apiError.message.includes('status code 500')) {
          // The operation might have succeeded despite the error
          showSnackbarMessage(`Request may have been processed. Refreshing data...`, 'warning');
          handleCloseDialog();
          
          // Wait a moment before refreshing
          setTimeout(() => {
            loadBloodRequests(); // Reload the data
          }, 1500);
        } else {
          showSnackbarMessage(`Error: ${apiError.message}`, 'error');
        }
      }
    } catch (err) {
      showSnackbarMessage(err.message, 'error');
    }
  };


/**
 * Fetches recent blood requests (limited to 5)
 * @returns {Promise<Array>} Array of recent blood requests
 */
export const fetchRecentBloodRequests = async () => {
  try {
    const response = await api.get('/inventory/blood-requests/');
    // Sort by requested_date in descending order and take the first 5
    const sortedRequests = response.data
      .sort((a, b) => new Date(b.requested_date) - new Date(a.requested_date))
      .slice(0, 5);
    return sortedRequests;
  } catch (error) {
    console.error('Error in fetchRecentBloodRequests:', error);
    throw new Error(
      `Failed to fetch recent blood requests: ${error.response?.data?.message || error.message}`
    );
  }
};

