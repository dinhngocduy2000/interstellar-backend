/**
 * Response after successful SSO authentication
 */
export interface SSOTokenResponse {
  /** The access token of the user */
  accessToken: string;
  /** The refresh token of the user */
  refreshToken: string;
  /** Token expire time */
  expiresIn: number;
  /** User's email */
  email: string;
  /** User's username */
  username: string;
  /** User's role */
  role: string;
  /** Whether this is a new user registration via SSO */
  isNewUser: boolean;
  /** SSO provider used */
  provider: string;
}

