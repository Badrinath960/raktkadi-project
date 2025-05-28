import React, { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  Edit, 
  Mail, 
  Phone, 
  Droplet, 
  Calendar, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

import { updateCustomerProfile } from '../../services/customerService';
import { API_URL } from '../../utils/constants';

// Importing the new reusable components
import ProfileInfoInput from '../shared/profile/ProfileInfoInput';
import ProfileImageUploader from '../shared/profile/ProfileImageUploader';
import useFormValidation from '../shared/profile/useFormValidation';

const ProfileUpdate = ({ profile, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Using the new form validation hook
  const { validationErrors, validate, clearFieldError } = useFormValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when field is edited
    clearFieldError(name);
  };

  const handleImageChange = (file, preview) => {
    setImageFile(file);
    setError(null);
  };

  const handleUpdate = async () => {
    try {
      // Validate form before submission
      const validationRules = {
        name: { required: true },
        contact: {},
        pincode: {}
      };

      if (!validate(formData, validationRules)) {
        setError('Please correct the errors in the form');
        return;
      }

      setLoading(true);
      setError(null);
      
      // Create a sanitized version of the form data
      let updatedProfile = {
        ...formData,
        name: typeof formData.name === 'string' ? formData.name.trim() : formData.name,
        contact: typeof formData.contact === 'string' ? formData.contact.trim() : formData.contact,
        address: typeof formData.address === 'string' ? formData.address.trim() : formData.address,
        city: typeof formData.city === 'string' ? formData.city.trim() : formData.city,
        state: typeof formData.state === 'string' ? formData.state.trim() : formData.state,
      };
      
      // Ensure pincode is sent as a number if it's a string
      if (updatedProfile.pincode && typeof updatedProfile.pincode === 'string') {
        updatedProfile.pincode = parseInt(updatedProfile.pincode, 10);
      }
      
      // image loading if uploading a new image
      if (imageFile) {
        setImageLoading(true);
      }
      
      console.log('Sending profile update:', updatedProfile);
      
      // Send the update request with the image file included
      const result = await updateCustomerProfile(updatedProfile, imageFile);
      console.log('Profile update result:', result);
      
      onSuccess(result);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const handleBack = () => {
    onCancel();
  };

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-red-800 font-semibold">{error}</p>
              <p className="text-red-600 text-sm">
                Please check the form and try again.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={handleBack} 
              className="mr-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ChevronLeft className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Update Profile</h1>
              <p className="text-gray-600 mt-2">Manage your personal information</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Edit className="mr-3" size={20} />
            )}
            Save Changes
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="md:col-span-1 flex flex-col items-center">
            <ProfileImageUploader 
              initialImage={profile.profile_img}
              apiUrl={API_URL}
              onImageChange={handleImageChange}
              onError={setError}
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            <h2 className="mt-6 text-2xl font-bold text-gray-900">{formData.name}</h2>
            <p className="text-gray-600 text-sm">{formData.email}</p>
          </div>

          {/* Profile Information Grid */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <ProfileInfoInput
              icon={User}
              title="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-blue-500"
              error={validationErrors.name}
            />
            <ProfileInfoInput
              icon={Mail}
              title="Email"
              name="email"
              value={formData.email}
              readOnly={true}
              className="text-blue-500"
            />
            <ProfileInfoInput
              icon={Phone}
              title="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="text-green-500"
              error={validationErrors.contact}
            />
            <ProfileInfoInput
              icon={Droplet}
              title="Blood Group"
              name="blood_group"
              value={formData.blood_group}
              readOnly={true}
              className="text-red-500"
            />
            <ProfileInfoInput
              icon={MapPin}
              title="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="text-orange-500"
            />
            <ProfileInfoInput
              icon={MapPin}
              title="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="text-orange-500"
            />
            <ProfileInfoInput
              icon={MapPin}
              title="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="text-orange-500"
            />
            <ProfileInfoInput
              icon={MapPin}
              title="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="text-orange-500"
              error={validationErrors.pincode}
            />
            <ProfileInfoInput
              icon={Calendar}
              title="Last Donation"
              name="last_donation"
              value={formData.last_donation ? new Date(formData.last_donation).toLocaleDateString() : 'No donation'}
              readOnly={true}
              className="text-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;