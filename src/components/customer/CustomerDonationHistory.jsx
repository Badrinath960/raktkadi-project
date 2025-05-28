import React, { useState, useEffect } from 'react';
import { getDonationHistory } from '../../services/customerServices/donationAndRequestHistory';
import { AlertCircle, Droplet, Calendar, Activity, Search } from 'lucide-react';

const CustomerDonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const data = await getDonationHistory();
        setDonations(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load donation history');
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'USED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort donations
  const filteredAndSortedDonations = React.useMemo(() => {
    let filteredItems = [...donations];
    
    // Apply search filter
    if (searchTerm) {
      filteredItems = filteredItems.filter(
        item => 
          item.blood_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.collection_date?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  }, [donations, searchTerm, sortConfig]);

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
          <p className="text-gray-700 text-xl font-semibold">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-red-800 font-semibold">{error}</p>
              <p className="text-red-600 text-sm">
                Please refresh or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Droplet className="mr-2 text-red-500" />
              Donation History
            </h2>
            <p className="text-gray-600 mt-1">Record of all your blood donations</p>
          </div>
          
          {/* Search and filter section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Search by blood group, status, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-6">
            {filteredAndSortedDonations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Droplet className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No donations found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? "No donations match your search criteria." : "You haven't made any donations yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort('blood_group')}
                      >
                        <div className="flex items-center">
                          <Droplet className="h-4 w-4 mr-1 text-red-500" />
                          Blood Group
                          {sortConfig.key === 'blood_group' && (
                            <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort('volume_ml')}
                      >
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-1 text-blue-500" />
                          Volume (ml)
                          {sortConfig.key === 'volume_ml' && (
                            <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort('collection_date')}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-green-500" />
                          Collection Date
                          {sortConfig.key === 'collection_date' && (
                            <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === 'status' && (
                            <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedDonations.map((donation, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 transition-colors transform hover:scale-[1.01] duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{donation.blood_group}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{donation.volume_ml}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{donation.collection_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Summary section */}
          {donations.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedDonations.length} of {donations.length} donations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDonationHistory;