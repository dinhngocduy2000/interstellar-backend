# SSO Module

This module implements SSO authentication using **Factory Pattern** and **Strategy Pattern**.

## Quick Start

### 1. Environment Setup

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/sso/google/callback
```

### 2. Run Migration

```bash
npm run migration:run
```

### 3. Usage

#### Frontend Integration

```javascript
// Initiate Google login
window.location.href = 'http://localhost:3000/api/auth/sso/google/login';

// After OAuth callback, you'll receive:
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 3600000,
  "email": "user@example.com",
  "username": "user",
  "role": "user",
  "isNewUser": true,
  "provider": "google"
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

- `GET /api/auth/sso/google/login` - Start OAuth flow
- `GET /api/auth/sso/google/callback?code=xxx` - Handle callback
- `GET /api/auth/sso/providers` - List supported providers

## Adding a New Provider

1. Create strategy in `strategies/`
2. Register in `factory/sso-strategy.factory.ts`
3. Add to `sso.module.ts` providers
4. Done!

See `../SSO_IMPLEMENTATION.md` for detailed guide.

