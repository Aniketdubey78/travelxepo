// API URL - uses environment-based URL for flexibility
const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Development environment
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000/api';
    }
    // Production environment
    return 'https://backend-olive-six-72.vercel.app/api';
  }
  return 'https://backend-olive-six-72.vercel.app/api';
};

export const url: string = getApiUrl();

// Mock API responses for development/demo
export const ENABLE_MOCK_API = true;
export const MOCK_DELAY_MS = 300;
