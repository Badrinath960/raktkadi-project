import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_TYPES, ROUTES } from '../utils/constants';
import DashboardLayout from '../components/shared/DashboardLayout';
import BloodBankDashboard from '../components/bloodbank/BloodBankDashboard';
import HospitalStaffManagement from '../pages/shared/StaffManagement';
import BloodRequestManagement from '../components/shared/bloodRequestManagement/BloodRequestManagement';
import BloodBagCreationForm from '../components/shared/form/BloodBagCreationForm';

// BloodBank Protected Route Component
const BloodBankProtectedRoute = ({ children }) => {
  const { isAuthenticated, getUserRole } = useAuth();
  const userRole = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (userRole !== USER_TYPES.BLOOD_BANK) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      [USER_TYPES.ADMIN]: ROUTES.ADMIN,
      [USER_TYPES.STAFF]: ROUTES.STAFF,
      [USER_TYPES.DONOR]: ROUTES.DONOR,
      [USER_TYPES.CONSUMERS]: ROUTES.CONSUMERS,
      [USER_TYPES.HOSPITAL]: ROUTES.HOSPITAL,
      [USER_TYPES.CUSTOMER]: ROUTES.CUSTOMER,
    };
    
    return <Navigate to={dashboardRoutes[userRole] || ROUTES.LOGIN} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const BloodBankRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <BloodBankProtectedRoute>
            <BloodBankDashboard />
          </BloodBankProtectedRoute>
        } 
      />
      <Route 
        path="/requests" 
        element={
          <BloodBankProtectedRoute>
            <BloodRequestManagement />
          </BloodBankProtectedRoute>
        } 
      />
      <Route 
        path="/staff" 
        element={
          <BloodBankProtectedRoute>
            <HospitalStaffManagement />
          </BloodBankProtectedRoute>
        } 
      />
      <Route 
        path="/create-blood-bag" 
        element={
          <BloodBankProtectedRoute>
            <BloodBagCreationForm />
          </BloodBankProtectedRoute>
        } 
      />

      {/* <Route 
        path="/inventory" 
        element={
          <BloodBankProtectedRoute>
            <BloodInventory />
          </BloodBankProtectedRoute>
        } 
      />
      <Route 
        path="/events" 
        element={
          <BloodBankProtectedRoute>
            <DonationEvents />
          </BloodBankProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <BloodBankProtectedRoute>
            <BloodBankReports />
          </BloodBankProtectedRoute>
        } 
      /> */}
      {/* Redirect any unmatched routes to the blood bank dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.BLOOD_BANK} replace />} />
    </Routes>
  );
};

export default BloodBankRoutes;