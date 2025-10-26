/**
 * Standardized user data structure returned by SSO providers
 * This ensures all SSO providers return data in a consistent format
 */
export interface SSOUserData {
  /** Provider-specific ID */
  providerId: string;
  /** Email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's display name (from provider) */
  displayName?: string;
  /** Profile picture URL */
  picture?: string;
  /** Email verification status */
  emailVerified?: boolean;
  /** Locale information */
  locale?: string;
}

