import { SSOUserData } from './sso-user-data.js';
import { SSOProvider } from '../enums/sso-provider.js';

/**
 * Base interface for all SSO strategy implementations
 * Defines the contract that all SSO providers must follow
 */
export interface ISSOStrategy {
  /**
   * Returns the provider type
   */
  getProvider(): SSOProvider;

  /**
   * Retrieves user data from the SSO provider using the authorization code
   * @param code - Authorization code received from OAuth callback
   * @returns User data in standardized format
   */
  getUserData(code: string): Promise<SSOUserData>;

  /**
   * Generates the authorization URL for OAuth flow
   * @param state - Optional state parameter for security
   * @returns Authorization URL
   */
  getAuthorizationUrl(state?: string): string;

  /**
   * Validates the OAuth token
   * @param token - Token to validate
   * @returns True if valid, false otherwise
   */
  validateToken(token: string): Promise<boolean>;
}

