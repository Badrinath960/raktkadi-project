import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_TYPES, ROUTES } from '../utils/constants';
import DashboardLayout from '../components/shared/DashboardLayout';
import HospitalDashboard from '../components/hospital/HositalDashboard';
import HospitalStaffManagement from '../pages/shared/StaffManagement';
import BloodRequestManagement from '../components/shared/bloodRequestManagement/BloodRequestManagement';
import BloodBagCreationForm from '../components/shared/form/BloodBagCreationForm';
// Hospital Protected Route Component
const HospitalProtectedRoute = ({ children }) => {
  const { isAuthenticated, getUserRole } = useAuth();
  const userRole = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (userRole !== USER_TYPES.HOSPITAL) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      [USER_TYPES.ADMIN]: ROUTES.ADMIN,
      [USER_TYPES.BLOOD_BANK]: ROUTES.BLOOD_BANK,
      [USER_TYPES.STAFF]: ROUTES.STAFF,
      [USER_TYPES.DONOR]: ROUTES.DONOR,
      [USER_TYPES.CONSUMER]: ROUTES.CONSUMERS,
      [USER_TYPES.CUSTOMER]: ROUTES.CUSTOMER,
    };
    
    return <Navigate to={dashboardRoutes[userRole] || ROUTES.LOGIN} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const HospitalRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <HospitalProtectedRoute>
            <HospitalDashboard />
          </HospitalProtectedRoute>
        } 
      />
       <Route 
        path="/create-blood-bag" 
        element={
          <HospitalProtectedRoute>
            <BloodBagCreationForm />
          </HospitalProtectedRoute>
        } 
      />
       <Route 
        path="/requests" 
        element={
          <HospitalProtectedRoute>
            <BloodRequestManagement />
          </HospitalProtectedRoute>
        } 
      />
      <Route 
        path="/staff" 
        element={
          <HospitalProtectedRoute>
            <HospitalStaffManagement />
          </HospitalProtectedRoute>
        } 
        />
      {/* Redirect any unmatched routes to the hospital dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.HOSPITAL} replace />} />
    </Routes>
  );
};

export default HospitalRoutes;