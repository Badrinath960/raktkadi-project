import React, { useState, useEffect } from 'react';
import { fetchCustomerProfile } from '../../services/customerService';
import { API_URL } from '../../utils/constants';
import { Edit, ChevronLeft, User, MapPin, Phone, Mail, Droplet, Calendar, AlertCircle} from 'lucide-react';
import ProfileUpdate from './ProfileUpdate';
import { ProfileInfoCard } from '../shared/ui/cards';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    contact: "",
    profile_img: "",
    blood_group: "",
    last_donation: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_active: true
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    loadProfileData();
  }, []);
  
  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCustomerProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    window.history.back();
  };
  
  const toggleEditMode = () => {
    setIsEditing(true);
  };
  
  const handleProfileUpdateSuccess = (updatedProfile) => {
    console.log('Profile updated successfully:', updatedProfile);
    // Make sure we're getting the complete updated profile
    setProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    setIsEditing(false);
    // Reload profile data to ensure we have the latest from server
    loadProfileData();
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  if (isEditing) {
    return <ProfileUpdate 
      profile={profile} 
      onSuccess={handleProfileUpdateSuccess} 
      onCancel={handleCancelEdit} 
    />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-red-500 animate-pulse" />
          <p className="text-gray-700 text-xl font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-red-800 font-semibold">{error}</p>
              <p className="text-red-600 text-sm">
                Please refresh or contact support if the issue persists.
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
              <h1 className="text-4xl font-bold text-gray-900">Profile Details</h1>
              <p className="text-gray-600 mt-2">Manage your personal information</p>
            </div>
          </div>
          <button
            onClick={toggleEditMode}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center shadow-md hover:shadow-lg"
          >
            <Edit className="mr-3" size={20} />
            Edit Profile
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              {profile.profile_img ? (
                <img
                  src={profile.profile_img.startsWith('http') ? profile.profile_img : `${API_URL}${profile.profile_img}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600 text-sm">{profile.email}</p>
          </div>

          {/* Profile Information Grid */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <ProfileInfoCard 
              icon={Mail} 
              title="Email Address" 
              value={profile.email}
              className="text-blue-500" 
            />
            <ProfileInfoCard 
              icon={Phone} 
              title="Contact Number" 
              value={profile.contact}
              className="text-green-500" 
            />
            <ProfileInfoCard 
              icon={Droplet} 
              title="Blood Group" 
              value={profile.blood_group}
              className="text-red-500" 
            />
            <ProfileInfoCard 
              icon={Calendar} 
              title="Last Donation" 
              value={profile.last_donation ? new Date(profile.last_donation).toLocaleDateString() : 'No donation'}
              className="text-purple-500" 
            />
            <ProfileInfoCard 
              icon={MapPin} 
              title="Address" 
              value={profile.address || 'Not provided'}
              className="text-orange-500" 
            />
            <ProfileInfoCard 
              icon={MapPin} 
              title="City" 
              value={profile.city || 'Not provided'}
              className="text-orange-500" 
            />
            <ProfileInfoCard 
              icon={MapPin} 
              title="State" 
              value={profile.state || 'Not provided'}
              className="text-orange-500" 
            />
            <ProfileInfoCard 
              icon={MapPin} 
              title="Pincode" 
              value={profile.pincode || 'Not provided'}
              className="text-orange-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;