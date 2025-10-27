# SSO Module

This module implements SSO authentication using **Factory Pattern** and **Strategy Pattern**.

## Quick Start

### 1. Environment Setup

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/sso/google/callback
FRONTEND_URL=http://localhost:3001
```

### 2. Run Migration

```bash
npm run migration:run
```

### 3. Usage

#### Frontend Integration

**Step 1: Initiate OAuth Login**

```javascript
// Redirect user to start OAuth flow
window.location.href = 'http://localhost:3000/api/v1/auth/sso/google/login';
```

**Step 2: Handle OAuth Callback**

After successful authentication, the backend redirects to your frontend with tokens in the URL hash:

```
http://localhost:3001/auth/callback#access_token=xxx&refresh_token=xxx&...
```

**Step 3: Extract tokens from URL hash**

```javascript
// In your frontend callback handler (e.g., /auth/callback page)
function handleOAuthCallback() {
  // Get tokens from URL hash
  const hash = window.location.hash.substring(1); // Remove #
  const params = new URLSearchParams(hash);
  
  const tokens = {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
    expiresIn: parseInt(params.get('expires_in')),
    email: params.get('email'),
    username: params.get('username'),
    role: params.get('role'),
    isNewUser: params.get('is_new_user') === 'true',
    provider: params.get('provider'),
  };
  
  // Store tokens securely (localStorage, Redux, etc.)
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  
  // Redirect to main app
  window.location.href = '/dashboard';
}
```

**Step 4: Handle errors**

```javascript
// Check for error in URL query params
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

if (error) {
  // Handle authentication error
  console.error('OAuth error:', error);
  // Redirect to login page
  window.location.href = '/login';
}
```

## Architecture

```
SSOController
    ↓
SSOService
    ↓
SSOStrategyFactory (creates →)
    ↓
ISSOStrategy (implemented by)
    ↓
GoogleSSOStrategy
```

## API Endpoints

Note: Your app uses `/api/v1` as the global prefix (configured in `main.ts`).

- `GET /api/v1/auth/sso/google/login` - Start OAuth flow
- `GET /api/v1/auth/sso/google/callback?code=xxx` - Handle callback
- `GET /api/v1/auth/sso/providers` - List supported providers

## Adding a New Provider

1. Create strategy in `strategies/`
2. Register in `factory/sso-strategy.factory.ts`
3. Add to `sso.module.ts` providers
4. Done!

See `../SSO_IMPLEMENTATION.md` for detailed guide.

