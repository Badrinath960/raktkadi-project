import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Using lucide-react for icons

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add scroll event listener to track when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`${
          isScrolled ? "bg-red-700 shadow-md" : "bg-red-700"
        } text-white fixed md:top-3 w-full md:w-[95%] md:left-1/2 md:transform  md:-translate-x-1/2 z-50 transition-all md:rounded-3xl duration-300`}
      >
        <div className="  w-full  py-3 ">
          <div className="flex justify-between mr-5 items-center">
            {/* Logo and site name */}
            <div className="flex items-center ml-5 space-x-2">
              <Link to="/" className="font-bold text-2xl">
                Raktkadi
              </Link>
            </div>

            {/* Desktop Navigation links */}
            <div className="hidden md:flex font-bold space-x-6">
              <Link
                to="/"
                className="hover:text-red-200 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-red-200 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link
                to="/donation-process"
                className="hover:text-red-200 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Donate
              </Link>
              <Link
                to="/contact"
                className="hover:text-red-200 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div>

            {/* Auth buttons */}
            {/* <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="border border-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-white text-red-700 px-4 py-2 rounded hover:bg-red-100 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div> */}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-red-700 z-40 md:hidden"
          style={{ top: "64px" }} // Adjust based on navbar height
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <Link
              to="/"
              className="text-2xl hover:text-red-200 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-2xl hover:text-red-200 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
            <Link
              to="/donation-process"
              className="text-2xl hover:text-red-200 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              Donate
            </Link>
            <Link
              to="/upcoming-camps"
              className="text-2xl hover:text-red-200 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              Donation Camp
            </Link>
            <Link
              to="/contact"
              className="text-2xl hover:text-red-200 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            {/* Mobile Auth Buttons */}
            {/* <div className="flex flex-col space-y-4 pt-6">
              <Link 
                to="/login" 
                className="border border-white px-6 py-3 rounded hover:bg-red-600 transition-colors duration-200 text-lg"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link 
                to="/customers" 
                className="bg-white text-red-700 px-6 py-3 rounded hover:bg-red-100 transition-colors duration-200 text-lg"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
