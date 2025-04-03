import React, { useState, useEffect } from 'react';
import { 
  DropletIcon, 
  ShieldHalfIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  AlertCircleIcon 
} from 'lucide-react';

import { StatCard } from '../shared/ui/cards';

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
    // You can log the error to an error reporting service
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
      { type: 'A+', units: 45 },
      { type: 'A-', units: 12 },
      { type: 'B+', units: 38 },
      { type: 'B-', units: 15 },
      { type: 'AB+', units: 20 },
      { type: 'AB-', units: 8 },
      { type: 'O+', units: 55 },
      { type: 'O-', units: 25 }
    ],
    recent_donations: []
  });
  
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
          total_units: 218,
          pending_requests: 12,
          todays_donations: 8,
          critical_stock: 2,
          blood_stock: [
            { type: 'A+', units: 45 },
            { type: 'A-', units: 12 },
            { type: 'B+', units: 38 },
            { type: 'B-', units: 15 },
            { type: 'AB+', units: 20 },
            { type: 'AB-', units: 8 },
            { type: 'O+', units: 55 },
            { type: 'O-', units: 25 }
          ],
          recent_donations: [
            { id: 1, donor: 'John Doe', bloodType: 'A+', date: '2023-06-15', status: 'Completed' },
            { id: 2, donor: 'Jane Smith', bloodType: 'O-', date: '2023-06-14', status: 'Completed' },
            { id: 3, donor: 'Robert Johnson', bloodType: 'B+', date: '2023-06-14', status: 'Processing' },
            { id: 4, donor: 'Emily Davis', bloodType: 'AB+', date: '2023-06-13', status: 'Completed' },
            { id: 5, donor: 'Michael Brown', bloodType: 'O+', date: '2023-06-12', status: 'Completed' }
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
          blood_stock: Array.isArray(data.blood_stock) ? data.blood_stock : [],
          recent_donations: Array.isArray(data.recent_donations) ? data.recent_donations : []
        });
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

  // Loading State Component
  const LoadingState = () => (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
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
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Bank Dashboard</h1>
        <p className="text-gray-600">Manage your blood bank inventory and requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={DropletIcon}
          title="Total Blood Units"
          value={dashboardData.total_units}
          valueColor="text-red-600"
        />
        <StatCard
          icon={ClockIcon}
          title="Pending Requests"
          value={dashboardData.pending_requests}
          valueColor="text-yellow-600"
        />
        <StatCard 
          icon={CheckCircle2Icon}
          title="Today's Donations"
          value={dashboardData.todays_donations}
          valueColor="text-green-600"
        />
        <StatCard 
          icon={AlertCircleIcon}
          title="Critical Stock"
          value={dashboardData.critical_stock}
          valueColor="text-red-600"
        />
      </div>

      {/* Blood Stock Status */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Blood Stock Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.blood_stock.map((blood) => (
              <div 
                key={blood.type} 
                className={`bg-gray-50 p-4 rounded-lg ${
                  blood.units < 10 ? 'border-2 border-red-300' : ''
                }`}
              >
                <div className="text-2xl font-bold text-red-600">{blood.type}</div>
                <div className="text-sm text-gray-500">Available Units</div>
                <div className={`text-lg font-medium ${blood.units < 10 ? 'text-red-600' : ''}`}>
                  {blood.units}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Donations</h3>
          
          {dashboardData.recent_donations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent donations
            </div>
          ) : (
            <>
              {/* Mobile/Tablet View */}
              <div className="block md:hidden space-y-4">
                {dashboardData.recent_donations.map((donation) => (
                  <div 
                    key={donation.id} 
                    className="bg-gray-100 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{donation.donor}</p>
                      <p className="text-red-600">{donation.bloodType}</p>
                      <p className="text-gray-500 text-sm">{donation.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Donor Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Blood Type</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recent_donations.map((donation) => (
                      <tr key={donation.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{donation.donor}</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">{donation.bloodType}</td>
                        <td className="py-3 px-4 text-gray-600">{donation.date}</td>
                        <td
                          className={`py-3 px-4 font-medium ${
                            donation.status === 'Completed'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {donation.status}
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