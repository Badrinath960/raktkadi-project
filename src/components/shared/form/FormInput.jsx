import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  required = true, 
  options = [], 
  placeholder = '',
  className = '',
  error = '',
  icon = null,
  ...rest 
}) => {
  const isSelect = type === 'select';
  
  const inputVariants = {
    focus: { scale: 1.01, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          {icon && <span className="mr-1.5 text-gray-500">{icon}</span>}
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <motion.div
        initial="blur"
        whileFocus="focus"
        animate="blur"
        variants={inputVariants}
        className="relative"
      >
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`appearance-none relative block w-full px-3 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${className}`}
            {...rest}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`appearance-none relative block w-full px-3 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm ${className}`}
            {...rest}
          />
        )}
      </motion.div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 flex items-center text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default FormInput;