import React, { useState, useEffect } from 'react';
import { fetchCustomerDashboard } from '../../services/customerService';
import { Link } from 'react-router-dom';
import { 
  Heart,  
  Users, 
  ShieldCheck, 
  Activity, 
  Droplet,
  Phone,
  MessageCircle,
  Edit,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { StatCard, HealthTip } from '../shared/ui/cards';

const CustomerDashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    contact: "",
    donations: 0,
    requests: 0,
    lives_impacted: 0,
    next_eligible_date: "",
    blood_type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchCustomerDashboard();
        
        setUserData({
          name: data.name || "Unknown",
          contact: data.contact || "Not provided",
          donations: data.donations || 0,
          requests: data.requests || 0,
          lives_impacted: data.lives || 0,
          next_eligible_date: data.next_eligible_date || "N/A",
          blood_type: data.blood_type || "Unknown",
        });
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 text-red-600 animate-pulse relative">
            <Droplet size={80} className="animate-bounce" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-red-600 animate-ping opacity-75"></div>
            </div>
          </div>
          <p className="text-gray-700 text-xl font-semibold">Loading your Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {userData.name}</h1>
            <p className="text-gray-600 mt-2 text-lg">Your Blood Donation Dashboard</p>
          </div>
          <Link
              to="/customer/request-blood"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center shadow-md hover:shadow-lg"
            >
              <PlusCircle className="mr-3" size={20} />
              Request Blood
          </Link>
          {/* <Link
            to="/customer/profile"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center shadow-md hover:shadow-lg"
          >
            <Edit className="mr-3" size={20} />
            Manage Profile
          </Link> */}
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <StatCard 
            icon={Heart} 
            title="Total Donations" 
            value={userData.donations} 
            valueColor="text-red-600" 
          />
          <StatCard 
            icon={Heart} 
            title="Total Requests" 
            value={userData.requests} 
            valueColor="text-red-600" 
          />
          <StatCard 
            icon={Activity} 
            title="Blood Type" 
            value={userData.blood_type || 'Unknown'} 
            valueColor="text-blue-600" 
          />
          <StatCard 
            icon={Users} 
            title="Lives Impacted" 
            value={userData.lives_impacted} 
            valueColor="text-purple-600" 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <MessageCircle className="mr-3 text-orange-500" size={24} />
              Additional Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <MessageCircle className="mr-3 text-orange-500" size={20} />
                  <span className="text-gray-600">Next Eligibility date</span>
                </div>
                <span className="font-semibold text-orange-600">{userData.next_eligible_date}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <Phone className="mr-3 text-blue-500" size={20} />
                  <span className="text-gray-600">Contact Number</span>
                </div>
                <span className="font-semibold">{userData.contact}</span>
              </div>
              
            </div>
          </div>

          <div className="space-y-8">
            <HealthTip 
              icon={ShieldCheck}
              title="Before Donation"
              tips={[
                "Get plenty of sleep the night before",
                "Eat a healthy meal rich in iron",
                "Drink extra water throughout the day",
                "Avoid fatty foods and alcohol"
              ]}
            />
            <HealthTip 
              icon={ShieldCheck}
              title="After Donation"
              tips={[
                "Rest for at least 15 minutes post-donation",
                "Drink plenty of fluids for 48 hours",
                "Avoid strenuous activities for 24 hours",
                "Eat iron-rich foods to replenish"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;