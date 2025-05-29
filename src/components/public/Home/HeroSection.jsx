// src/components/home/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../../../utils/constants";
import bgImage from "../../../img/img.jpg"; 

const HeroSections = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center justify-center md:items-end md:justify-start"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute bg-black opacity-40 inset-0"></div>
      <div className="relative container px-6 pb-0 md:pb-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <h1 className="text-4xl md:text-8xl leading-[80px] font-semibold mb-4">
            Welcome to RaktKadi
          </h1>
          <p className="text-xl md:text-xl mb-8 font-normal leading-[27px]">
            A platform to manage blood donations and requests efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(ROUTES.LOGIN)}
              className="border border-white px-6 py-3 bg-red-900 text-white font-semibold rounded-lg shadow-md  transition duration-300"
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(ROUTES.SIGNUP)}
              className="px-6 py-3 bg-white text-red-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSections;
