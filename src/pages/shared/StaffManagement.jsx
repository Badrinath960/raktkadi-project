import React, { useState } from 'react';
import { 
  UsersIcon, 
  UserPlusIcon, 
  EditIcon, 
  ListIcon, 
  XIcon 
} from 'lucide-react';

import CreateStaffComponent from '../../components/shared/staffManagement/CreateStaffComponent';
import UpdateStaffComponent from '../../components/shared/staffManagement/UpdateStaffComponent';
import StaffListComponent from '../../components/shared/staffManagement/StaffListComponent';

const HospitalStaffManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const renderContent = () => {
    switch(activeTab) {
      case 'create':
        return <CreateStaffComponent onStaffCreated={handleStaffCreated} />;
      case 'update':
        return (
          <UpdateStaffComponent 
            staffToUpdate={selectedStaff} 
            onUpdateComplete={handleUpdateComplete}
          />
        );
      case 'list':
      default:
        return (
          <StaffListComponent 
            onEditStaff={handleEditStaff} 
          />
        );
    }
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setActiveTab('update');
  };

  const handleStaffCreated = (newStaff) => {
    setSelectedStaff(newStaff);
    setActiveTab('list');
  };

  const handleUpdateComplete = () => {
    setSelectedStaff(null);
    setActiveTab('list');
  };

  const TabButton = ({ icon: Icon, label, tabName, isActive }) => (
    <button
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 
        ${isActive 
          ? 'bg-red-500 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      onClick={() => {
        setActiveTab(tabName);
        // Reset selected staff when changing tabs
        if (tabName !== 'update') setSelectedStaff(null);
      }}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className=" rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-red-500" />
                Staff Management
              </h1>
              <p className="text-gray-600">Manage, create, and update staff members</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 justify-center">
          <TabButton 
            icon={ListIcon} 
            label="Staff List" 
            tabName="list" 
            isActive={activeTab === 'list'}
          />
          <TabButton 
            icon={UserPlusIcon} 
            label="Create Staff" 
            tabName="create" 
            isActive={activeTab === 'create'}
          />
          <TabButton 
            icon={EditIcon} 
            label="Update Staff" 
            tabName="update" 
            isActive={activeTab === 'update'}
          />
        </div>

        {/* Selected Staff Indicator */}
        {selectedStaff && activeTab === 'update' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="font-semibold text-yellow-800">
                Updating Staff Member: {selectedStaff.name}
              </p>
              <p className="text-yellow-600 text-sm">
                Email: {selectedStaff.email}
              </p>
            </div>
            <button 
              onClick={() => setSelectedStaff(null)}
              className="text-yellow-700 hover:text-yellow-900"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="bg-white rounded-xl shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HospitalStaffManagement;