import React, { useState, useEffect } from 'react';
import { 
  DropletIcon, 
  ShieldHalfIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  AlertCircleIcon,
  UserIcon,
  CalendarIcon,
  HeartPulseIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../shared/ui/cards';
import { fetchBloodRequests } from '../../services/shared/bloodRequestMangement';

// Error Boundary Component
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error in Dashboard:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
          <AlertCircleIcon className="h-16 w-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4 text-center">
            An unexpected error occurred while loading the dashboard.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reload Page
          </button>
          {this.state.error && (
            <details className="mt-4 max-w-full overflow-auto">
              <summary className="cursor-pointer text-gray-700">
                View Error Details
              </summary>
              <pre className="bg-gray-100 p-4 rounded-lg mt-2 text-xs text-red-700">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const BloodBankDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_units: 0,
    pending_requests: 0,
    todays_donations: 0,
    critical_stock: 0,
    blood_stock: [
      { blood_group: 'A+', units: 0 },
      { blood_group: 'A-', units: 0 },
      { blood_group: 'B+', units: 0 },
      { blood_group: 'B-', units: 0 },
      { blood_group: 'AB+', units: 0 },
      { blood_group: 'AB-', units: 0 },
      { blood_group: 'O+', units: 0 },
      { blood_group: 'O-', units: 0 }
    ],
    recent_donations: []
  });
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when available
        // const data = await fetchBloodBankDashboard();
        
        // For now, using mock data
        const data = {
          total_units: 9,
          pending_requests: 6,
          todays_donations: 1,
          critical_stock: 3,
          recent_donations: [
            { donor_name: 'John Doe', blood_group: 'A+', date: '2023-05-15', units: 1 },
            { donor_name: 'Jane Smith', blood_group: 'O-', date: '2023-05-14', units: 1 },
            { donor_name: 'Robert Johnson', blood_group: 'B+', date: '2023-05-13', units: 1 }
          ]
        };
        
        // Validate data to prevent potential rendering issues
        if (!data) {
          throw new Error('No data received from server');
        }

        setDashboardData({
          total_units: data.total_units || 0,
          pending_requests: data.pending_requests || 0,
          todays_donations: data.todays_donations || 0,
          critical_stock: data.critical_stock || 0,
          blood_stock: data.blood_stock || [],
          recent_donations: data.recent_donations || []
        });

        // Fetch recent blood requests
        const bloodRequestsData = await fetchBloodRequests();
        // Sort by requested_date (newest first) and take only the top 5
        const sortedRequests = bloodRequestsData
          .sort((a, b) => new Date(b.requested_date) - new Date(a.requested_date))
          .slice(0, 5);
        
        setRecentRequests(sortedRequests);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Check if it's already in DD-MM-YYYY format
    if (dateString.includes('-') && dateString.length === 10) {
      return dateString;
    }
    
    // Otherwise, format the ISO date
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EMERGENCY': 'bg-red-100 text-red-800',
      'FULFILLED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Loading State Component
  const LoadingState = () => (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="text-center">
        <div className="mx-auto mb-4 h-20 w-20 text-red-600 animate-pulse relative">
          <DropletIcon size={80} className="animate-bounce" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-red-600 animate-ping opacity-75"></div>
          </div>
        </div>
        <p className="text-gray-700 text-xl font-semibold">Loading dashboard data...</p>
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <AlertCircleIcon className="h-12 w-12 text-red-600 mb-4" />
      <p className="text-red-600 text-lg text-center">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Retry
      </button>
    </div>
  );

  // Render Main Dashboard
  const renderDashboard = () => (
    <div className="container mx-auto px-4 py-8 space-y-8 ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Bank Dashboard</h1>
        <p className="text-gray-600">Manage your blood bank inventory and requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={DropletIcon}
          title="Total Blood Bags"
          value={dashboardData.total_units}
          valueColor="text-red-600"
        />
        <StatCard
          icon={ClockIcon}
          title="Total Requests"
          value={dashboardData.pending_requests}
          valueColor="text-yellow-600"
        />
        <StatCard 
          icon={HeartPulseIcon}
          title="Approved Requests"
          value={dashboardData.todays_donations}
          valueColor="text-green-600"
        />
        <StatCard 
          icon={AlertCircleIcon}
          title="Pending Requests"
          value={dashboardData.critical_stock}
          valueColor="text-red-600"
        />
        <StatCard 
          icon={AlertCircleIcon}
          title="Urgent Requests"
          value={dashboardData.critical_stock}
          valueColor="text-red-600"
        />
      </div>

      {/* Recent Blood Requests */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Blood Requests</h3>
            <Link 
              to="/blood-bank/requests" 
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              View All
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {recentRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent blood requests
            </div>
          ) : (
            <>
              {/* Mobile/Tablet View */}
              <div className="block md:hidden space-y-4">
                {recentRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="font-semibold text-gray-900">{request.patient_name}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DropletIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-red-600 font-medium">{request.blood_group}</span>
                        <span className="text-gray-500 text-sm ml-2">({request.units_required} units)</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(request.requested_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Patient Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Blood Group</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Units</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Requested Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-900">{request.patient_name}</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">{request.blood_group}</td>
                        <td className="py-3 px-4 text-gray-700">{request.units_required}</td>
                        <td className="py-3 px-4 text-gray-500">{formatDate(request.requested_date)}</td>
                        <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/blood-bank/requests?id=${request.id}`}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Donations</h3>
            <Link 
              to="/blood-bank/donations" 
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              View All
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {dashboardData.recent_donations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent donations
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recent_donations.map((donation, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mr-4">
                      <UserIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{donation.donor_name}</p>
                      <p className="text-sm text-gray-500">{formatDate(donation.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 px-3 py-1 rounded-full text-red-600 font-medium mr-2">
                      {donation.blood_group}
                    </div>
                    <span className="text-gray-700">{donation.units} unit(s)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {loading ? <LoadingState /> : 
         error ? <ErrorState /> : 
         renderDashboard()}
      </div>
    </DashboardErrorBoundary>
  );
};

export default BloodBankDashboard;