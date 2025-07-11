export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin  // Uses the same domain in production
  : 'http://localhost:8080'; // Uses localhost in development