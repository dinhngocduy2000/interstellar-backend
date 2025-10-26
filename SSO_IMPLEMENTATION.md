# SSO Implementation Guide

## Overview

This implementation uses the **Factory Pattern** combined with the **Strategy Pattern** to provide a scalable and maintainable SSO (Single Sign-On) solution.

## Architecture

### Design Patterns

#### 1. Strategy Pattern
- **Purpose**: Each SSO provider (Google, Microsoft, etc.) has its own implementation
- **Benefit**: Isolates provider-specific logic, making it easy to add new providers
- **Interface**: `ISSOStrategy` defines the contract all providers must follow

#### 2. Factory Pattern  
- **Purpose**: Creates the appropriate strategy based on provider type
- **Benefit**: Centralizes strategy creation logic
- **Class**: `SSOStrategyFactory` manages strategy instances

## Project Structure

```
src/
├── common/
│   ├── enums/
│   │   └── sso-provider.ts          # Provider enum
│   └── interface/
│       ├── sso-strategy.ts          # Strategy interface
│       ├── sso-user-data.ts         # Standardized user data
│       └── sso-token-response.ts    # SSO response type
├── entities/
│   └── index.ts                      # Updated User entity with OAuth fields
└── features/
    └── sso/
        ├── factory/
        │   └── sso-strategy.factory.ts    # Factory implementation
        ├── strategies/
        │   ├── google-sso.strategy.ts     # Google OAuth implementation
        │   ├── microsoft-sso.strategy.ts  # (Future: Microsoft)
        │   ├── github-sso.strategy.ts     # (Future: GitHub)
        │   └── apple-sso.strategy.ts      # (Future: Apple)
        ├── sso.service.ts                 # SSO business logic
        ├── sso.controller.ts              # SSO API endpoints
        └── sso.module.ts                  # Module configuration
```

## Supported Providers

Currently implemented:
- ✅ **Google** - Google OAuth 2.0

Planned (easy to add):
- ⏳ Microsoft
- ⏳ GitHub  
- ⏳ Apple

## API Endpoints

### 1. Initiate SSO Login
```http
GET /api/auth/sso/{provider}/login
```

**Example:**
```http
GET /api/auth/sso/google/login
```

**Response:** Redirects to provider's authorization URL

### 2. OAuth Callback
```http
GET /api/auth/sso/{provider}/callback?code={code}&state={state}
```

**Example:**
```http
GET /api/auth/sso/google/callback?code=4/0AcDmCjX...
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600000,
  "email": "user@example.com",
  "username": "user",
  "role": "user",
  "isNewUser": true,
  "provider": "google"
}
```

### 3. List Supported Providers
```http
GET /api/auth/sso/providers
```

**Response:**
```json
{
  "message": "Supported SSO providers",
  "code": 200,
  "data": ["google"]
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/sso/google/callback

# JWT Configuration (existing)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=3600000
```

## Setting Up Google OAuth

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to **APIs & Services** > **Credentials**

### 2. Create OAuth 2.0 Credentials
1. Click **Create Credentials** > **OAuth client ID**
2. Choose **Web application**
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/sso/google/callback` (development)
   - `https://yourdomain.com/api/auth/sso/google/callback` (production)

### 3. Configure Environment Variables
Copy the Client ID and Client Secret to your `.env` file.

## Database Migration

Run the migration to add OAuth fields to the User table:

```bash
npm run migration:run
```

This adds:
- `oauthProvider` - Provider name (e.g., 'google')
- `oauthProviderId` - Provider-specific user ID
- `emailVerified` - Email verification status
- Makes `password`, `firstName`, `lastName` nullable for OAuth users

## Adding a New Provider

### Step 1: Create Strategy Class

Create a new file: `src/features/sso/strategies/{provider}-sso.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ISSOStrategy } from '../../../common/interface/sso-strategy.js';
import { SSOProvider } from '../../../common/enums/sso-provider.js';
import { SSOUserData } from '../../../common/interface/sso-user-data.js';

@Injectable()
export class MicrosoftSSOStrategy implements ISSOStrategy {
  getProvider(): SSOProvider {
    return SSOProvider.MICROSOFT;
  }

  getAuthorizationUrl(state?: string): string {
    // Implement Microsoft OAuth URL generation
  }

  async getUserData(code: string): Promise<SSOUserData> {
    // Implement Microsoft token exchange
  }

  async validateToken(token: string): Promise<boolean> {
    // Implement Microsoft token validation
  }
}
```

### Step 2: Register in Factory

Update `src/features/sso/factory/sso-strategy.factory.ts`:

```typescript
constructor(
  private readonly googleSSOStrategy: GoogleSSOStrategy,
  private readonly microsoftSSOStrategy: MicrosoftSSOStrategy  // Add
) {
  this.strategies = new Map();
  this.strategies.set(SSOProvider.GOOGLE, googleSSOStrategy);
  this.strategies.set(SSOProvider.MICROSOFT, microsoftSSOStrategy);  // Add
}
```

### Step 3: Add Provider to Enum

Update `src/common/enums/sso-provider.ts` if not already added:

```typescript
export enum SSOProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',  // Already there
  // ...
}
```

### Step 4: Register in Module

Update `src/features/sso/sso.module.ts`:

```typescript
@Module({
  providers: [
    SSOStrategyFactory,
    GoogleSSOStrategy,
    MicrosoftSSOStrategy,  // Add
  ],
  // ...
})
```

## Type Safety

The implementation uses strict TypeScript types throughout:

- `SSOProvider` - Enum for provider types
- `SSOUserData` - Standardized user data structure
- `SSOTokenResponse` - SSO authentication response
- `ISSOStrategy` - Strategy interface contract

## Testing

### 1. Test Google SSO Flow

```bash
# Start the server
npm run start:dev

# Initiate login
curl -L http://localhost:3000/api/auth/sso/google/login

# Follow the OAuth flow, then test callback
curl "http://localhost:3000/api/auth/sso/google/callback?code=YOUR_CODE"
```

### 2. Verify Database

```sql
SELECT id, email, oauth_provider, oauth_provider_id, email_verified 
FROM users 
WHERE oauth_provider = 'google';
```

## Security Considerations

1. **CSRF Protection**: State parameter validates OAuth callbacks
2. **Token Validation**: All tokens are verified before use
3. **Email Verification**: Track email verification status
4. **Password-less Users**: OAuth-only users cannot use password login
5. **HTTPS**: Always use HTTPS in production

## Benefits of This Implementation

✅ **Scalable**: Easy to add new providers without modifying existing code
✅ **Maintainable**: Each provider is isolated in its own strategy
✅ **Type-safe**: Strict TypeScript types throughout
✅ **Testable**: Each strategy can be tested independently
✅ **Clean Architecture**: Separation of concerns (Factory, Strategy, Service)
✅ **SOLID Principles**: Follows Open/Closed and Dependency Inversion principles

## Troubleshooting

### Error: "Invalid authorization code"
- Check that callback URL matches exactly in Google Console
- Verify code hasn't expired (OAuth codes expire quickly)

### Error: "Unsupported provider"
- Ensure provider name is lowercase
- Check that provider is registered in factory

### Migration errors
- Run `npm run migration:revert` to undo
- Check migration file syntax

## Future Enhancements

- [ ] Add GitHub SSO
- [ ] Add Microsoft SSO
- [ ] Add Apple SSO
- [ ] Implement token refresh for SSO
- [ ] Add SSO session management
- [ ] Implement SSO account linking
- [ ] Add SSO logout

