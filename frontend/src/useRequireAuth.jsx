// useRequireAuth.js
import { useEffect } from 'react';
import axios from 'axios';

const useRequireAuth = () => {
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth_check', {
          withCredentials: true
        });
        if (response.status === 401) {
          window.location.href = '/login'; // Redirect to login page
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/login'; // Redirect to login page on error
      }
    };

    fetchAuthStatus();
  }, []);

  return;
};

export default useRequireAuth;
