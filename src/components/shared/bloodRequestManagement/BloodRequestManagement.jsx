import React, { useState, useEffect } from 'react';
import { fetchBloodRequests, respondToBloodRequest } from '../../../services/shared/bloodRequestMangement';
import { AlertCircle, ChevronDown, Info, Droplet, Calendar, Search, Filter, User, Hospital, CheckCircle, XCircle, MessageSquare, Clock, Activity, Shield } from 'lucide-react';

const BloodRequestManagement = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseStatus, setResponseStatus] = useState('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    loadBloodRequests();
  }, []);

  const loadBloodRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchBloodRequests();
      setBloodRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    // Set initial response status based on current request status
    if (request.status === 'PENDING') {
      setResponseStatus('APPROVED');
    } else if (request.status === 'APPROVED') {
      setResponseStatus('COMPLETED');
    } else {
      setResponseStatus('APPROVED');
    }
    setRejectionReason('');
    setNotes('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitResponse = async () => {
    try {
      if (responseStatus === 'REJECTED' && !rejectionReason) {
        showSnackbarMessage('Rejection reason is required', 'error');
        return;
      }

      // Add error handling for the API call
      try {
        await respondToBloodRequest(
          selectedRequest.id,
          responseStatus,
          responseStatus === 'REJECTED' ? rejectionReason : null,
          notes
        );
        
        showSnackbarMessage(`Request ${responseStatus.toLowerCase()} successfully`, 'success');
        handleCloseDialog();
        loadBloodRequests();
      } catch (apiError) {
        console.error('API Error:', apiError);
        showSnackbarMessage(`Error: ${apiError.message || 'Server error occurred'}`, 'error');
      }
    } catch (err) {
      showSnackbarMessage(err.message || 'An unexpected error occurred', 'error');
    }
  };

  const showSnackbarMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 6000);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EMERGENCY': 'bg-red-100 text-red-800',
      'FULFILLED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };
    
    const statusIcons = {
      'PENDING': <Clock className="h-3.5 w-3.5 mr-1" />,
      'APPROVED': <CheckCircle className="h-3.5 w-3.5 mr-1" />,
      'REJECTED': <XCircle className="h-3.5 w-3.5 mr-1" />,
      'EMERGENCY': <AlertCircle className="h-3.5 w-3.5 mr-1" />,
      'FULFILLED': <Shield className="h-3.5 w-3.5 mr-1" />,
      'COMPLETED': <Shield className="h-3.5 w-3.5 mr-1" />
    };
    
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusIcons[status]}
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'EMERGENCY': 'bg-red-100 text-red-800',
      'URGENT': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
    
    const priorityIcons = {
      'EMERGENCY': <AlertCircle className="h-3.5 w-3.5 mr-1" />,
      'URGENT': <Activity className="h-3.5 w-3.5 mr-1" />,
      'HIGH': <Activity className="h-3.5 w-3.5 mr-1" />,
      'MEDIUM': <Activity className="h-3.5 w-3.5 mr-1" />,
      'LOW': <Activity className="h-3.5 w-3.5 mr-1" />
    };
    
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${priorityClasses[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priorityIcons[priority]}
        {priority}
      </span>
    );
  };

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

  // Filter and sort requests
  const filteredAndSortedRequests = React.useMemo(() => {
    let filteredItems = [...bloodRequests];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filteredItems = filteredItems.filter(item => item.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'ALL') {
      filteredItems = filteredItems.filter(item => item.priority === priorityFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredItems = filteredItems.filter(
        item => 
          item.blood_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [bloodRequests, searchTerm, statusFilter, priorityFilter, sortConfig]);

  // Get unique statuses for filter
  const uniqueStatuses = React.useMemo(() => {
    const statuses = bloodRequests.map(request => request.status);
    return ['ALL', ...new Set(statuses)];
  }, [bloodRequests]);

  // Get unique priorities for filter
  const uniquePriorities = React.useMemo(() => {
    const priorities = bloodRequests.map(request => request.priority);
    return ['ALL', ...new Set(priorities)];
  }, [bloodRequests]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 text-red-600 animate-pulse relative">
            <Droplet size={80} className="animate-bounce" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-red-600 animate-ping opacity-75"></div>
            </div>
          </div>
          <p className="text-gray-700 text-xl font-semibold">Loading blood requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-10 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Droplet className="mr-2 text-red-500" />
              Blood Request Management
            </h2>
            <p className="text-gray-600 mt-1">Manage and respond to blood requests</p>
          </div>
          
          {/* Search and filter section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Search by blood group, patient, hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'ALL' ? 'All Statuses' : status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  {uniquePriorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'ALL' ? 'All Priorities' : priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {filteredAndSortedRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Droplet className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                    ? "No requests match your search criteria." 
                    : "There are no blood requests to manage at this time."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAndSortedRequests.map((request, index) => (
                  <div key={index} className="py-4">
                    <div 
                      className="flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors transform hover:scale-[1.01] duration-200"
                      onClick={() => toggleRow(index)}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 flex items-center">
                          <Droplet className="h-4 w-4 mr-2 text-red-500" />
                          Blood Group: {request.blood_group}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          Patient: {request.patient_name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          Requested: {formatDate(request.requested_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
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
                              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                              Request Details
                            </h4>
                            <table className="min-w-full">
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Units Required</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{request.units_required}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Required Date</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{formatDate(request.required_date)}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Priority</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{getPriorityBadge(request.priority)}</td>
                                </tr>
                                {request.rejection_reason && (
                                  <tr className="hover:bg-gray-50">
                                    <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Rejection Reason</td>
                                    <td className="py-2 whitespace-nowrap text-gray-500">{request.rejection_reason}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-3 text-gray-900 border-b pb-2 flex items-center">
                              <User className="h-5 w-5 mr-2 text-green-500" />
                              Patient Details
                            </h4>
                            <table className="min-w-full">
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Name</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{request.patient_name}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Email</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{request.customer_email}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Age</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{request.patient_age}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Gender</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500">{request.patient_gender}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="py-2 pr-4 whitespace-nowrap font-medium text-gray-900">Hospital</td>
                                  <td className="py-2 whitespace-nowrap text-gray-500 flex items-center">
                                    <Hospital className="h-4 w-4 mr-1 text-blue-500" />
                                    {request.hospital_name}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {request.notes && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start transform hover:scale-[1.01] transition-transform">
                            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-800">Notes</h4>
                              <p className="text-blue-700">{request.notes}</p>
                            </div>
                          </div>
                        )}
                        
                        {(request.status === 'PENDING' || request.status === 'APPROVED') && (
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(request);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {request.status === 'PENDING' ? 'Respond to Request' : 'Update Status'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Summary section */}
          {bloodRequests.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedRequests.length} of {bloodRequests.length} requests
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Response Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-red-500" />
              <h3 className="text-lg font-medium">
                {selectedRequest?.status === 'PENDING' ? 'Respond to Blood Request' : 'Update Request Status'}
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">{selectedRequest?.patient_name}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Droplet className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-gray-600">Blood Group: {selectedRequest?.blood_group}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Hospital className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-600">Hospital: {selectedRequest?.hospital_name}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                    Response
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                  >
                    {selectedRequest?.status === 'PENDING' ? (
                      <>
                        <option value="APPROVED">Approve</option>
                        <option value="REJECTED">Reject</option>
                      </>
                    ) : selectedRequest?.status === 'APPROVED' ? (
                      <option value="COMPLETED">Mark as Completed</option>
                    ) : null}
                  </select>
                </div>

                {responseStatus === 'REJECTED' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-red-500" />
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full border ${responseStatus === 'REJECTED' && !rejectionReason ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection"
                    />
                    {responseStatus === 'REJECTED' && !rejectionReason && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        Rejection reason is required
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information here..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                onClick={handleCloseDialog}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button 
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                  responseStatus === 'APPROVED' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                  responseStatus === 'COMPLETED' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' :
                  'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
                onClick={handleSubmitResponse}
              >
                {responseStatus === 'APPROVED' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </>
                ) : responseStatus === 'COMPLETED' ? (
                  <>
                    <Shield className="h-4 w-4 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for notifications */}
      {showSnackbar && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg flex items-center ${snackbarSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {snackbarSeverity === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default BloodRequestManagement;