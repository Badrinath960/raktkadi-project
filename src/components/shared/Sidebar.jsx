import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, 
  LayoutDashboard, 
  Users, 
  Droplet, 
  BarChart, 
  Archive, 
  Gift, 
  Calendar, 
  ClipboardList, 
  ShieldHalf, 
  Hospital, 
  UserCog,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_TYPES } from '../../utils/constants';

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  'blood-bank': Droplet,
  report: BarChart,
  'blood-stock': Archive,
  donation: Gift,
  request: HeartPulse,
  calendar: Calendar,
  history: ClipboardList,
  hospital: Hospital,
  profile: UserCog
};


const Sidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isMobileSidebarOpen, 
  setIsMobileSidebarOpen 
}) => {
  const { getUserRole } = useAuth();
  const location = useLocation();
  const userRole = getUserRole();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Check screen size on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      
      // Reset sidebar states when changing screen sizes
      if (smallScreen) {
        setIsSidebarOpen(false);
        setIsMobileSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsSidebarOpen, setIsMobileSidebarOpen]);

  // Navigation items for different user roles
  const navItems = {
    [USER_TYPES.ADMIN]: [
      { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
      { name: 'Manage Users', path: '/admin/users', icon: 'users' },
      { name: 'Blood Banks', path: '/admin/blood-banks', icon: 'blood-bank' },
      { name: 'Reports', path: '/admin/reports', icon: 'report' }
    ],
    [USER_TYPES.BLOOD_BANK]: [
      { name: 'Dashboard', path: '/blood-bank', icon: 'dashboard' },
      // { name: 'Blood Stock', path: '/blood-bank/stock', icon: 'blood-stock' },
      // { name: 'Donations', path: '/blood-bank/donations', icon: 'donation' },
      { name: 'Requests', path: '/blood-bank/requests', icon: 'request' },
      { name: 'Staff Management', path: '/blood-bank/staff', icon: 'users' }
    ],
    [USER_TYPES.STAFF]: [
      { name: 'Dashboard', path: '/staff/dashboard', icon: 'dashboard' },
      { name: 'Manage Donations', path: '/staff/donations', icon: 'donation' },
      { name: 'Handle Requests', path: '/staff/requests', icon: 'request' }
    ],
    [USER_TYPES.DONOR]: [
      { name: 'Dashboard', path: '/donor', icon: 'dashboard' },
      { name: 'Donation History', path: '/donor/history', icon: 'history' },
      { name: 'Schedule Donation', path: '/donor/schedule', icon: 'calendar' }
    ],
    [USER_TYPES.CONSUMER]: [
      { name: 'Dashboard', path: '/consumers', icon: 'dashboard' },
      { name: 'Blood Requests', path: '/consumers/request-blood', icon:'request' },
      { name: 'Request Blood', path: '/consumers/request', icon: 'request' },
      { name: 'Request History', path: '/consumers/history', icon: 'history' }
    ],
    [USER_TYPES.HOSPITAL]: [
      { name: 'Dashboard', path: '/hospital', icon: 'dashboard' },
      { name: 'Hospital Management', path: '/hospital/manage', icon: 'hospital' },
      { name: 'Staff Management', path: '/hospital/staff', icon: 'users' },
      { name: 'Blood Requests', path: '/hospital/requests', icon: 'request' },

    ],
    [USER_TYPES.CUSTOMER]: [
      { name: 'Dashboard', path: '/customer', icon: 'dashboard' },
      { name: 'Profile', path: '/customer/profile', icon: 'profile' },
      { name: 'Request History', path: '/customer/requests', icon: 'history' },
      { name: 'Donation History', path: '/customer/donations', icon: 'history' }
    ]
  };

  // Get current navigation items
  const currentNavItems = navItems[userRole] || [];

  // Formatted role for display
  const formattedRole = userRole 
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()
    : 'Unknown';

  // Render navigation items
  const renderNavItems = (isMobile = false) => (
    <ul className={`${isMobile ? 'space-y-4 p-4' : 'p-4 space-y-2'}`}>
      {currentNavItems.map((item) => {
        const IconComponent = iconMap[item.icon];
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={() => {
                if (isSmallScreen) {
                  setIsMobileSidebarOpen(false);
                }
              }}
              className={`
                flex items-center px-4 py-2 rounded-md transition-all duration-300 group
                ${location.pathname === item.path
                  ? 'bg-red-900 text-white shadow-lg'
                  : 'hover:bg-red-800 hover:text-white hover:shadow-md'
                }
                ${(isSidebarOpen || isMobileSidebarOpen) ? '' : 'justify-center'}
              `}
            >
              <IconComponent 
                className={`
                  ${(isSidebarOpen || isMobileSidebarOpen) ? 'mr-3' : ''}
                  group-hover:rotate-6 transition-transform
                `} 
                size={20} 
              />
              <span className={`
                ${(isSidebarOpen || isMobileSidebarOpen) ? 'block' : 'hidden'}
                font-medium
              `}>
                {item.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed top-0 left-0 w-64 h-full bg-red-700 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 bg-red-800 shadow-md">
                <div className="flex items-center">
                  <Droplet className="mr-2" color="white" />
                  <span className="text-xl font-bold">Raktkadi</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="hover:bg-red-700 p-2 rounded-full"
                >
                  <X color="white" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto">
                {renderNavItems(true)}
              </nav>
              <div className="p-4 bg-red-800 shadow-inner">
                <p className="text-sm text-red-200 flex items-center">
                  <UserCog className="mr-2" size={16} />
                  Role: {formattedRole}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.div 
      animate={{
        width: isSidebarOpen ? '16rem' : '4rem',
        transition: { duration: 0.3 }
      }}
      className={`
        hidden md:block fixed inset-y-0 left-0 
        bg-red-700 text-white 
        overflow-hidden z-30 shadow-lg
      `}
    >
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 right-4 z-10 hover:rotate-90 transition-transform"
      >
        {isSidebarOpen ? <X color="white" /> : <Menu color="white" />}
      </button>

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-red-800 shadow-md">
          <Droplet className={`mr-2 ${!isSidebarOpen ? 'opacity-0' : ''}`} color="white" />
          <span className={`text-xl font-bold ${!isSidebarOpen ? 'opacity-0' : ''}`}>
            Raktkadi
          </span>
        </div>
        
        {currentNavItems.length > 0 ? (
          <nav className="flex-1 overflow-y-auto">
            {renderNavItems()}
          </nav>
        ) : (
          <div className="flex items-center justify-center flex-1 text-red-200">
            No navigation items available
          </div>
        )}
        
        <div className="p-4 bg-red-800 shadow-inner">
          <p className={`text-sm text-red-200 flex items-center ${!isSidebarOpen ? 'opacity-0' : ''}`}>
            <UserCog className="mr-2" size={16} />
            Role: {formattedRole}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Menu Trigger for Small Screens */}
      {isSmallScreen && (
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="md:hidden fixed bottom-4 left-4 z-50 bg-red-600 p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          {isMobileSidebarOpen ? <X color="white" /> : <Menu color="white" />}
        </button>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;