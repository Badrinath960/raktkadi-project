// src/components/home/TestimonialsSection.jsx
import React from "react";
import { motion } from "framer-motion";

const TestimonialsSections = () => {
  const testimonials = [
    {
      quote: "Vitaflow has transformed how we manage blood donations in our community.",
      author: "Dr. Sharma, Jalaram Blood Bank"
    },
    {
      quote: "The platform's efficiency helped us save countless lives during emergencies.",
      author: "Dr. Patel, Metro Hospital"
    }
  ];
  
  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <p className="text-xl italic mb-4">{testimonial.quote}</p>
              <p className="font-semibold text-red-700">{testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSections;