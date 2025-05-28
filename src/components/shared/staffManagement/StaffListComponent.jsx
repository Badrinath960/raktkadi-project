import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  TrashIcon, 
  SearchIcon, 
  AlertCircleIcon,
  Droplet,
  ChevronDown,
  Filter,
  Mail,
  Phone,
  Shield,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { listStaff, deleteStaff, getStaffByEmail } from '../../../services/shared/staffManagementService';

const StaffListComponent = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const data = await listStaff();
      setStaffList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail) return;
    
    try {
      setLoading(true);
      const staff = await getStaffByEmail(searchEmail);
      setSelectedStaff(staff);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSelectedStaff(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Are you sure you want to delete staff member with email ${email}?`)) {
      try {
        await deleteStaff(email);
        fetchStaffList();
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get unique roles for filter
  const uniqueRoles = React.useMemo(() => {
    const roles = staffList.map(staff => staff.role);
    return ['ALL', ...new Set(roles)];
  }, [staffList]);

  // Filter and sort staff
  const filteredAndSortedStaff = React.useMemo(() => {
    let filteredItems = [...staffList];
    
    // Apply role filter
    if (roleFilter !== 'ALL') {
      filteredItems = filteredItems.filter(item => item.role === roleFilter);
    }
    
    // Apply search filter
    if (searchEmail) {
      filteredItems = filteredItems.filter(
        item => 
          item.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchEmail.toLowerCase()) ||
          item.contact?.includes(searchEmail)
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
  }, [staffList, searchEmail, roleFilter, sortConfig]);

  // Loading State Component
  const LoadingState = () => (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="text-center">
        <div className="mx-auto mb-4 h-20 w-20 text-red-600 animate-pulse relative">
          <Droplet size={80} className="animate-bounce" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-red-600 animate-ping opacity-75"></div>
          </div>
        </div>
        <p className="text-gray-700 text-xl font-semibold">Loading staff data...</p>
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
          <AlertCircleIcon className="h-8 w-8 text-red-500 mr-4" />
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

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span> :
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
  };

  // Render Main Staff Management
  const renderStaffManagement = () => (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserIcon className="mr-2 text-red-500" />
              Staff Management
            </h2>
            <p className="text-gray-600 mt-1">Manage and track staff members</p>
          </div>
          
          {/* Search and filter section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Search by name, email or contact..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>
                      {role === 'ALL' ? 'All Roles' : role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Selected Staff Details */}
          {selectedStaff && (
            <div className="p-6 bg-blue-50 border-b">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="mr-2 text-blue-500" />
                    Staff Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{selectedStaff.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">{selectedStaff.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Contact:</span>
                        <span className="ml-2 text-gray-900">{selectedStaff.contact}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Role:</span>
                        <span className="ml-2 text-gray-900">{selectedStaff.role}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Blood Bank:</span>
                        <span className="ml-2 text-gray-900">{selectedStaff.blood_bank_email}</span>
                      </div>
                      <div className="flex items-center">
                        {selectedStaff.is_active ? 
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        }
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2">{getStatusBadge(selectedStaff.is_active)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {filteredAndSortedStaff.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No staff members found</h3>
                <p className="mt-1 text-gray-500">
                  {searchEmail || roleFilter !== 'ALL' 
                    ? "No staff members match your search criteria." 
                    : "No staff members have been added yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAndSortedStaff.map((staff, index) => (
                  <div key={index} className="py-4">
                    <div 
                      className="flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors transform hover:scale-[1.01] duration-200"
                      onClick={() => toggleRow(index)}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 flex items-center">
                          <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                          {staff.name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {staff.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {staff.role}
                        </span>
                        {getStatusBadge(staff.is_active)}
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedRows[index] ? 'transform rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                    
                    {expandedRows[index] && (
                      <div className="p-6 mt-2 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-3 text-gray-900 border-b pb-2 flex items-center">
                              <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                              Staff Information
                            </h4>
                            <table className="min-w-full">
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Name</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{staff.name}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Email</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{staff.email}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Contact</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{staff.contact}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-3 text-gray-900 border-b pb-2 flex items-center">
                              <Building className="h-5 w-5 mr-2 text-green-500" />
                              Organization Details
                            </h4>
                            <table className="min-w-full">
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Role</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{staff.role}</td>
                                </tr>
                             
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Status</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">
                                    {staff.is_active ? 
                                      <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Active</span> : 
                                      <span className="flex items-center text-red-600"><XCircle className="h-4 w-4 mr-1" /> Inactive</span>
                                    }
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(staff.email);
                            }}
                            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete Staff
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Summary section */}
          {staffList.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedStaff.length} of {staffList.length} staff members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <>
      {loading ? <LoadingState /> : 
       error ? <ErrorState /> : 
       renderStaffManagement()}
    </>
  );
};

export default StaffListComponent;