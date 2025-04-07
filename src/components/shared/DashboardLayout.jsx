import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      
      <motion.main 
        className="flex-1 transition-all duration-300 md:ml-16 lg:ml-0"
        style={{
          marginLeft: 
            // Desktop view
            window.innerWidth >= 768 
              ? (isSidebarOpen ? '16rem' : '4rem') 
              // Mobile view
              : '0'
        }}
      >
        <Header />
        <div className="p-4 pb-8 sm:p-6 sm:pb-8 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;