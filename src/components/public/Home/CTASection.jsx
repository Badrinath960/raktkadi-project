// src/components/home/CTASection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../../../utils/constants";

const CTASections = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gradient-to-r from-red-700 to-red-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a donor looking to save lives or a hospital managing blood supplies, Vitaflow has you covered.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.CUSTOMER)}
            className="px-8 py-4 bg-white text-red-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASections;