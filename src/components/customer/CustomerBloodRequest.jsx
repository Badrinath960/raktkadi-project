import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplet, 
  Calendar, 
  User, 
  Hospital, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Clock,
  Activity
} from 'lucide-react';
import { createBloodRequest, checkBloodAvailability } from '../../services/customerServices/customerBloodRequestService';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const priorities = ['NORMAL', 'URGENT', 'EMERGENCY'];
const genders = ['Male', 'Female', 'Other'];

const CustomerBloodRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    blood_group: '',
    hospital_email: '',
    blood_bank_email: '',
    units_required: 1,
    priority: 'NORMAL',
    patient_name: '',
    patient_age: '',
    patient_gender: 'Male',
    hospital_name: '',
    required_date: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bloodAvailability, setBloodAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Set minimum date for required_date to today
  const today = new Date().toISOString().split('T')[0];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when field is changed
    setErrors({
      ...errors,
      [name]: undefined
    });

    // Special handling for blood_group to fetch availability
    if (name === 'blood_group' && value) {
      fetchBloodAvailability(value);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch blood availability when blood group is selected
  const fetchBloodAvailability = async (bloodGroup) => {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError(null);
      setSelectedProvider(null);
      setFormData(prev => ({
        ...prev,
        hospital_email: '',
        blood_bank_email: '',
        hospital_name: ''
      }));
      
      const data = await checkBloodAvailability(bloodGroup);
      setBloodAvailability(data);
      
      if (data.length === 0) {
        setAvailabilityError(`No availability found for blood group ${bloodGroup}`);
      }
    } catch (error) {
      setAvailabilityError(error.message);
      setBloodAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Handle provider selection
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    
    if (provider.type === 'hospital') {
      setFormData({
        ...formData,
        hospital_email: provider.email,
        blood_bank_email: '',
        hospital_name: provider.name
      });
    } else if (provider.type === 'blood_bank') {
      setFormData({
        ...formData,
        blood_bank_email: provider.email,
        hospital_email: '',
        hospital_name: provider.name
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';
    if (!formData.hospital_email && !formData.blood_bank_email) 
      newErrors.provider = 'Please select a blood provider';
    if (!formData.units_required || formData.units_required < 1) 
      newErrors.units_required = 'At least 1 unit is required';
    if (!formData.patient_name) newErrors.patient_name = 'Patient name is required';
    if (!formData.patient_age || formData.patient_age < 1) 
      newErrors.patient_age = 'Valid age is required';
    if (!formData.hospital_name) newErrors.hospital_name = 'Hospital name is required';
    if (!formData.required_date) newErrors.required_date = 'Required date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Create a clean copy of form data to submit
      const requestData = { ...formData };
      
      // Remove empty email fields to prevent validation errors
      if (!requestData.hospital_email) {
        delete requestData.hospital_email;
      }
      
      if (!requestData.blood_bank_email) {
        delete requestData.blood_bank_email;
      }
      
      await createBloodRequest(requestData);
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/customer/requests');
      }, 3000);
    } catch (error) {
      console.error('Request error:', error);
      
      // Better error handling to show specific API validation errors
      if (error.response && error.response.data) {
        const errorMessage = 
          error.response.data.hospital_email?.[0] || 
          error.response.data.blood_bank_email?.[0] || 
          error.response.data.detail || 
          error.message;
          
        setErrors({
          submit: errorMessage
        });
      } else {
        setErrors({
          submit: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Droplet className="mr-2 text-red-500" />
              Request Blood
            </h2>
            <p className="text-gray-600 mt-1">Fill out the form to request blood for a patient</p>
          </div>

          {success ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Request Submitted Successfully!</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your blood request has been submitted. You will be redirected to your requests page shortly.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/customer/requests')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  View My Requests
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Droplet className="h-4 w-4 mr-1 text-red-500" />
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md ${
                      errors.blood_group ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.blood_group && (
                    <p className="mt-2 text-sm text-red-600">{errors.blood_group}</p>
                  )}
                </div>

                {/* Units Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Units Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="units_required"
                    value={formData.units_required}
                    onChange={handleChange}
                    min="1"
                    className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      errors.units_required ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.units_required && (
                    <p className="mt-2 text-sm text-red-600">{errors.units_required}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-orange-500" />
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                {/* Required Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                    Required Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="required_date"
                    value={formData.required_date}
                    onChange={handleChange}
                    min={today}
                    className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      errors.required_date ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.required_date && (
                    <p className="mt-2 text-sm text-red-600">{errors.required_date}</p>
                  )}
                </div>
              </div>

              {/* Blood Availability Section */}
              {formData.blood_group && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Blood Availability for {formData.blood_group}
                  </h3>
                  
                  {availabilityLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Clock className="animate-spin h-5 w-5 mr-3 text-red-500" />
                      <p>Checking availability...</p>
                    </div>
                  ) : availabilityError ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">{availabilityError}</p>
                        </div>
                      </div>
                    </div>
                  ) : bloodAvailability.length === 0 ? (
                    <p className="text-gray-500 text-center py-2">No availability data found</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {bloodAvailability.map((provider, index) => (
                        <div 
                          key={index}
                          onClick={() => handleProviderSelect(provider)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedProvider?.email === provider.email 
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
                              : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{provider.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">
                                {provider.type === 'blood_bank' ? 'Blood Bank' : provider.type}
                              </p>
                            </div>
                            <div className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                              <Droplet className="h-3 w-3 mr-1" />
                              {provider.units} units
                            </div>
                          </div>
                          {selectedProvider?.email === provider.email && (
                            <div className="mt-2 flex items-center text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Selected
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {errors.provider && (
                    <p className="mt-2 text-sm text-red-600">{errors.provider}</p>
                  )}
                </div>
              )}

              {/* Patient Information */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-green-500" />
                  Patient Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleChange}
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.patient_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.patient_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.patient_name}</p>
                    )}
                  </div>

                  {/* Patient Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="patient_age"
                      value={formData.patient_age}
                      onChange={handleChange}
                      min="1"
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.patient_age ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.patient_age && (
                      <p className="mt-2 text-sm text-red-600">{errors.patient_age}</p>
                    )}
                  </div>

                  {/* Patient Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="patient_gender"
                      value={formData.patient_gender}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    >
                      {genders.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hospital Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Hospital className="h-4 w-4 mr-1 text-blue-500" />
                      Center Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hospital_name"
                      value={formData.hospital_name}
                      onChange={handleChange}
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.hospital_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                      readOnly={selectedProvider !== null}
                    />
                    {errors.hospital_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.hospital_name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Any additional information about the request..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBloodRequest;