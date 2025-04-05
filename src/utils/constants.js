// src/utils/constants.js
export const API_URL = 'https://raktkadi.onrender.com/api';
export const BASE_URL = 'https://raktkadi.onrender.com/';

export const USER_TYPES = {
  ADMIN: 'ADMIN',
  BLOOD_BANK: 'BLOOD_BANK',
  STAFF: 'STAFF',
  DONOR: 'DONOR',
  CONSUMER: 'CONSUMERS',
  HOSPITAL: 'HOSPITAL',
  CUSTOMER : 'CUSTOMER'
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
  BLOOD_BANK: '/blood-bank',
  STAFF: '/staff',
  DONOR: '/donor',
  CONSUMER: '/consumers',
  HOSPITAL: '/hospital',
  CUSTOMER: '/customer'
};

export const REDIRECT_ROUTES = {
  [USER_TYPES.ADMIN]: ROUTES.ADMIN,
  [USER_TYPES.BLOOD_BANK]: ROUTES.BLOOD_BANK,
  [USER_TYPES.STAFF]: ROUTES.STAFF,
  [USER_TYPES.DONOR]: ROUTES.DONOR,
  [USER_TYPES.CONSUMER]: ROUTES.CONSUMER,
  [USER_TYPES.HOSPITAL]: ROUTES.HOSPITAL,
  [USER_TYPES.CUSTOMER]: ROUTES.CUSTOMER,
};
