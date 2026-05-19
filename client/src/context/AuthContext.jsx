import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from local storage safely
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
  });

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // ==========================================
  // THE GLOBAL FETCH INTERCEPTOR
  // ==========================================
  useEffect(() => {
    // 1. Save a copy of the browser's original fetch function
    const originalFetch = window.fetch;

    // 2. Override it with our custom security wrapper
    window.fetch = async (...args) => {
      
      // 3. Let the fetch happen normally
      const response = await originalFetch(...args);

      // 4. Inspect the result! If the Bouncer gives a 401...
      if (response.status === 401) {
        console.error("🛡️ Interceptor Alert: Token expired or invalid!");
        
        // Nuke the dead token and user data
        logout(); 
        
        // Alert the user and kick them to the authentication screen
        alert("🔒 Your secure session has expired. Please log in again to save your progress.");
        window.location.href = '/auth'; 
      }

      // 5. Otherwise, pass the response back to React normally
      return response;
    };

    // Cleanup: restore original fetch if this component ever unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, []); 

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};