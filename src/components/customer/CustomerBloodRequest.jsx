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
  Activity,
  X
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

    // Validate units_required against selected provider's available units
    if (name === 'units_required' && selectedProvider) {
      const requestedUnits = parseInt(value);
      const availableUnits = selectedProvider.units;
      
      if (requestedUnits > availableUnits) {
        setErrors(prev => ({
          ...prev,
          units_required: `Only ${availableUnits} units available from selected provider`
        }));
      }
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
    
    // Check if requested units exceed available units
    if (parseInt(formData.units_required) > provider.units) {
      setErrors(prev => ({
        ...prev,
        units_required: `Only ${provider.units} units available from this provider`
      }));
    } else {
      // Clear units error if it was previously set
      setErrors(prev => ({
        ...prev,
        units_required: undefined
      }));
    }
    
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

  // Validate form with enhanced validation
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    
    if (!formData.blood_group) {
      newErrors.blood_group = 'Blood group is required';
    }
    
    if (!formData.hospital_email && !formData.blood_bank_email) {
      newErrors.provider = 'Please select a blood provider';
    }
    
    if (!formData.units_required) {
      newErrors.units_required = 'At least 1 unit is required';
    } else if (formData.units_required < 1) {
      newErrors.units_required = 'Units cannot be less than 1';
    } else if (formData.units_required > 10) {
      newErrors.units_required = 'Maximum 10 units can be requested at once';
    } else if (selectedProvider && parseInt(formData.units_required) > selectedProvider.units) {
      newErrors.units_required = `Cannot request more than ${selectedProvider.units} units from selected provider`;
    }
    
    if (!formData.patient_name) {
      newErrors.patient_name = 'Patient name is required';
    } else if (!nameRegex.test(formData.patient_name)) {
      newErrors.patient_name = 'Name should contain only letters';
    } else if (formData.patient_name.length < 2) {
      newErrors.patient_name = 'Name is too short';
    }
    
    if (!formData.patient_age) {
      newErrors.patient_age = 'Patient age is required';
    } else if (formData.patient_age < 1) {
      newErrors.patient_age = 'Age cannot be less than 1';
    } else if (formData.patient_age > 150) {
      newErrors.patient_age = 'Age cannot be more than 150';
    }
    
    if (!formData.hospital_name.trim()) {
      newErrors.hospital_name = 'Center name is required';
    }
    
    if (!formData.required_date) {
      newErrors.required_date = 'Required date is required';
    } else {
      const selectedDate = new Date(formData.required_date);
      const currentDate = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      
      if (selectedDate < currentDate) {
        newErrors.required_date = 'Date cannot be in the past';
      } else if (selectedDate > maxDate) {
        newErrors.required_date = 'Date cannot be more than 3 months in the future';
      }
    }
    
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
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b p-6 bg-red-50">
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
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4 border-b pb-2">
                  <Droplet className="h-5 w-5 mr-2 text-red-500" />
                  Blood Request Details
                </h3>
                
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
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md transition-colors duration-200 ${
                        errors.blood_group ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    {errors.blood_group && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.blood_group}
                      </p>
                    )}
                  </div>

                  {/* Units Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-blue-500" />
                      Units Required <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="units_required"
                      value={formData.units_required}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      placeholder="Enter units (1-10)"
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ${
                        errors.units_required ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.units_required && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.units_required}
                      </p>
                    )}
                    {selectedProvider && (
                      <p className="mt-1 text-xs text-gray-500">
                        Available: {selectedProvider.units} units from selected provider
                      </p>
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
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md transition-colors duration-200"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.priority === 'EMERGENCY' ? 
                        'For life-threatening situations requiring immediate attention' : 
                        formData.priority === 'URGENT' ? 
                        'For serious conditions requiring prompt attention' : 
                        'For standard, non-urgent requests'}
                    </p>
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
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ${
                        errors.required_date ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.required_date && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.required_date}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Blood Availability Section */}
              {formData.blood_group && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4 border-b pb-2">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Blood Availability for {formData.blood_group}
                  </h3>
                  
                  {availabilityLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Clock className="animate-spin h-6 w-6 mr-3 text-red-500" />
                      <p className="text-gray-600">Checking availability...</p>
                    </div>
                  ) : availabilityError ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">{availabilityError}</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            You can still submit your request, and we'll try to find a match.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : bloodAvailability.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No availability data found</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {bloodAvailability.map((provider, index) => (
                        <div 
                          key={index}
                          onClick={() => handleProviderSelect(provider)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedProvider?.email === provider.email 
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
                              : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
                          } ${provider.units < formData.units_required ? 'opacity-60' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{provider.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">
                                {provider.type === 'blood_bank' ? 'Blood Bank' : provider.type}
                              </p>
                            </div>
                            <div className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center ${
                              provider.units < formData.units_required 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
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
                          {provider.units < formData.units_required && (
                            <div className="mt-2 flex items-center text-yellow-600 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not enough units available
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {errors.provider && (
                    <p className="mt-4 text-sm text-red-600 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.provider}
                    </p>
                  )}
                </div>
              )}

              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4 border-b pb-2">
                  <User className="h-5 w-5 mr-2 text-green-500" />
                  Patient Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleChange}
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ${
                        errors.patient_name ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.patient_name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.patient_name}
                      </p>
                    )}
                  </div>

                  {/* Patient Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      Patient Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="patient_age"
                      value={formData.patient_age}
                      onChange={handleChange}
                      min="1"
                      max="150"
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ${
                        errors.patient_age ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.patient_age && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.patient_age}
                      </p>
                    )}
                  </div>

                  {/* Patient Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      Patient Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="patient_gender"
                      value={formData.patient_gender}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md transition-colors duration-200"
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
                      className={`mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ${
                        errors.hospital_name ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                      readOnly={selectedProvider !== null}
                    />
                    {errors.hospital_name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.hospital_name}
                      </p>
                    )}
                    {selectedProvider && (
                      <p className="mt-1 text-xs text-gray-500">
                        Auto-filled from selected provider
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-gray-500" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md transition-colors duration-200"
                  placeholder="Any additional information about the request (medical condition, urgency details, etc.)"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Include any relevant medical information that might help process your request faster
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ${
                    loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
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