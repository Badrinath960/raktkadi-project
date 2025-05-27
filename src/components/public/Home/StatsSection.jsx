import React from "react";
import { motion } from "framer-motion";
import CounterBox from "../../../common/CounderBox.jsx"; 

const StatsSections = () => {
  const stats = [
    { number: 10000, text: "Donors Registered" },
    { number: 15000, text: "Blood Units Collected" },
    { number: 500, text: "Partner Hospitals" },
    { number: 5000, text: "Lives Saved" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center"
        >
          {stats.map((stat, index) => (
            <CounterBox key={index} value={stat.number} label={stat.text} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSections;
