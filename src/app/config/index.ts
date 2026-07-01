// API URL - uses environment-based URL for flexibility
const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Development environment
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000/api';
    }
    // Production environment
    return 'https://travelxepo-backend.vercel.app/api';
  }
  return 'https://travelxepo-backend.vercel.app/api';
};

export const url: string = getApiUrl();
