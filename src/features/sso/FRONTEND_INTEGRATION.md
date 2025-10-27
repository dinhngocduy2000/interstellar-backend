# Frontend Integration Guide

This guide shows how to integrate the SSO authentication flow into your frontend application.

## Complete OAuth Flow

```
┌──────────┐         ┌─────────┐         ┌─────────────┐         ┌──────────┐
│ Frontend │         │ Backend │         │   Google    │         │ Frontend │
└────┬─────┘         └────┬────┘         └──────┬──────┘         └────┬─────┘
     │                    │                      │                      │
     │  1. Initiate       │                      │                      │
     │  /auth/sso/login   │                      │                      │
     ├───────────────────>│                      │                      │
     │                    │  2. Redirect         │                      │
     │                    ├─────────────────────>│                      │
     │                    │                      │                      │
     │   3. User Login    │                      │                      │
     │   (at Google)      │                      │                      │
     │                    │                      │                      │
     │  4. Callback       │                      │                      │
     │  with code        │                      │                      │
     │<───────────────────┼──────────────────────┤                      │
     │                    │  5. Exchange code    │                      │
     │                    │  for tokens          │                      │
     │                    │                      │                      │
     │  6. Redirect with  │                      │                      │
     │  tokens in hash    │                      │                      │
     │<───────────────────┼                      │                      │
     │                    │                      │                      │
     │ 7. Extract & store│                      │                      │
     │ tokens             │                      │                      │
     │                    │                      │                      │
```

## Frontend Implementation

### 1. Login Page - Initiate OAuth

```typescript
// pages/login.tsx or components/LoginButton.tsx
const LoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sso/google/login`;
  };

  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
};
```

### 2. Callback Handler - Extract Tokens

```typescript
// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Check for error in query params
    if (router.query.error) {
      console.error('OAuth error:', router.query.error);
      router.push('/login?error=oauth_failed');
      return;
    }

    // Extract tokens from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      router.push('/login?error=missing_tokens');
      return;
    }

    // Extract user data
    const userData = {
      accessToken,
      refreshToken,
      expiresIn: parseInt(params.get('expires_in') || '0'),
      email: params.get('email'),
      username: params.get('username'),
      role: params.get('role'),
      isNewUser: params.get('is_new_user') === 'true',
      provider: params.get('provider'),
    };

    // Store tokens securely
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      email: userData.email,
      username: userData.username,
      role: userData.role,
    }));

    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div>
      <h1>Completing authentication...</h1>
      <p>Please wait...</p>
    </div>
  );
}
```

### 3. Protected API Requests

```typescript
// lib/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add access token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
            { refreshToken }
          );
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4. Auth Context (React Context Example)

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (redirectUrl: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (redirectUrl: string) => {
    window.location.href = redirectUrl;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 5. Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## React Example

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

## Environment Variables

```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Error Handling

```typescript
// Handle different error scenarios
const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  switch (error) {
    case 'access_denied':
      showError('Login was cancelled');
      break;
    case 'authentication_failed':
      showError('Authentication failed. Please try again.');
      break;
    case 'invalid_code':
      showError('Invalid authorization code');
      break;
    default:
      if (error) {
        showError(`OAuth error: ${error}`);
      }
  }
};
```

## Security Best Practices

1. **Store tokens in memory** when possible instead of localStorage
2. **Use httpOnly cookies** in production (requires additional backend changes)
3. **Validate tokens** on the server side
4. **Implement token refresh** before expiration
5. **Clear sensitive data** on logout

## Complete Flow Summary

1. User clicks "Sign in with Google" → Redirected to `/api/v1/auth/sso/google/login`
2. Backend redirects to Google OAuth page
3. User authenticates with Google
4. Google redirects to `/api/v1/auth/sso/google/callback?code=xxx`
5. Backend exchanges code for tokens
6. Backend redirects to frontend: `http://localhost:3001/auth/callback#access_token=...`
7. Frontend extracts tokens from URL hash
8. Frontend stores tokens and redirects to dashboard
9. Frontend uses access token for authenticated API requests


