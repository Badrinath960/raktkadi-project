import React from 'react';

const ProfileInfoInput = ({ 
  icon: Icon, 
  title, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  className = '',
  readOnly = false,
  error 
}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center">
    <Icon className={`mr-4 w-6 h-6 mb-2 sm:mb-0 ${className}`} />
    <div className="flex-grow w-full">
      <label className="text-sm text-gray-500 block mb-1">{title}</label>
      {readOnly ? (
        <div className="text-lg font-semibold text-gray-800 bg-gray-50 p-2 rounded break-words">
          {value || 'Not provided'}
        </div>
      ) : (
        <>
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`w-full text-lg font-semibold text-gray-800 border-b ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-red-500 pb-1 overflow-ellipsis`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </>
      )}
    </div>
  </div>
);

export default ProfileInfoInput;