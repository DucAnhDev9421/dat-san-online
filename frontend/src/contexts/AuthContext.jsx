import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = authService.getTokens();
        if (tokens.accessToken) {
          // Verify token with backend
          console.log('🔍 Checking user authentication...');
          const result = await authService.getCurrentUser();
          console.log('👤 User data from API:', result);
          
          // Save user data to localStorage as backup
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: result.data.user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            }
          });
        } else {
          // No tokens found, just finish loading
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // Only clear tokens if it's an authentication error (401)
        // Don't clear tokens for network errors or other issues
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Token invalid or expired, clearing tokens');
          authService.clearTokens();
          dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
        } else {
          console.log('Network or server error, keeping tokens for retry');
          // Keep tokens, might be temporary network issue
          const tokens = authService.getTokens();
          if (tokens.accessToken) {
            // Try to get user data from localStorage as fallback
            const savedUser = localStorage.getItem('userData');
            let userData = null;
            if (savedUser) {
              try {
                userData = JSON.parse(savedUser);
              } catch (e) {
                console.error('Error parsing saved user data:', e);
              }
            }
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: userData,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
              }
            });
          }
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // Login function - can accept userData only (tokens handled by authService)
  const login = async (userData, tokens = null) => {
    try {
      console.log('🔐 Login function called with userData:', userData);
      dispatch({ type: 'LOGIN_START' });
      
      // If tokens provided, store them
      if (tokens) {
        authService.setTokens(tokens);
      }
      
      // Get tokens from localStorage if not provided
      const currentTokens = tokens || authService.getTokens();
      console.log('🔑 Current tokens:', currentTokens);
      
      // Save user data to localStorage as backup
      localStorage.setItem('userData', JSON.stringify(userData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: userData,
          accessToken: currentTokens.accessToken,
          refreshToken: currentTokens.refreshToken
        }
      });
      
      console.log('✅ Login successful, user stored in context and localStorage');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data from localStorage
      localStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });
  };

  // Refresh token
  const refreshAccessToken = async () => {
    try {
      if (!state.refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await authService.refreshToken(state.refreshToken);
      
      authService.setTokens({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken
      });

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken
        }
      });

      return result.data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
