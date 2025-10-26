import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../users/user.repository.js';
import { SSOStrategyFactory } from './factory/sso-strategy.factory.js';
import { SSOProvider } from '../../common/enums/sso-provider.js';
import { SSOUserData } from '../../common/interface/sso-user-data.js';
import { User } from '../../entities/index.js';
import { JwtPayload } from '../../common/interface/jwt-payload.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SSOTokenResponse } from '../../common/interface/sso-token-response.js';

@Injectable()
export class SSOService {
  private readonly expiresIn: number;

  constructor(
    private readonly ssoStrategyFactory: SSOStrategyFactory,
    private readonly userRepository: UserRepository
  ) {
    this.expiresIn = Number(process.env.JWT_EXPIRES_IN) ?? 3600000;
  }

  /**
   * Generate an authorization URL for the specified SSO provider
   * @param provider - The SSO provider
   * @param state - Optional state parameter for CSRF protection
   * @returns Authorization URL
   */
  getAuthorizationUrl(provider: SSOProvider, state?: string): string {
    const strategy = this.ssoStrategyFactory.createStrategy(provider);
    return strategy.getAuthorizationUrl(state);
  }

  /**
   * Authenticate user with SSO provider
   * @param provider - The SSO provider
   * @param code - Authorization code from OAuth callback
   * @returns Token response with user data
   */
  async authenticate(
    provider: SSOProvider,
    code: string
  ): Promise<SSOTokenResponse> {
    // Get the appropriate strategy
    const strategy = this.ssoStrategyFactory.createStrategy(provider);

    // Exchange code for user data
    const ssoUserData = await strategy.getUserData(code);

    if (!ssoUserData.email) {
      throw new BadRequestException('Email is required for authentication');
    }

    // Check if user exists
    let user = await this.userRepository.findByEmail(ssoUserData.email);
    const isNewUser = !user;

    if (isNewUser) {
      // Create new user from SSO data
      user = await this.createUserFromSSO(ssoUserData, provider);
    } else {
      // Update existing user with OAuth provider info if not already set
      if (user && !user.password && !user.oauthProvider) {
        user.oauthProvider = provider;
        user.oauthProviderId = ssoUserData.providerId;
        await this.userRepository.save(user);
      }
    }

    // At this point, user should never be null (either existing or newly created)
    if (!user) {
      throw new UnauthorizedException('Failed to create or retrieve user');
    }

    // Generate JWT tokens
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET ?? '', {
      expiresIn: this.expiresIn,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET ?? '', {
      expiresIn: 7 * 24 * this.expiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.expiresIn,
      email: user.email,
      username: user.username,
      role: user.role,
      isNewUser,
      provider,
    };
  }

  /**
   * Create a new user from SSO data
   * @param ssoUserData - User data from SSO provider
   * @param provider - SSO provider
   * @returns Created user
   */
  private async createUserFromSSO(
    ssoUserData: SSOUserData,
    provider: SSOProvider
  ): Promise<User> {
    // Generate username from email (before @)
    const usernameFromEmail = ssoUserData.email.split('@')[0];
    let username = usernameFromEmail;
    let counter = 1;

    // Ensure username is unique
    while (await this.userRepository.existsByUsername(username)) {
      username = `${usernameFromEmail}${counter}`;
      counter++;
    }

    const userData: User = {
      id: uuidv4(),
      email: ssoUserData.email,
      username,
      password: '', // OAuth users don't have passwords
      firstName: ssoUserData.firstName,
      lastName: ssoUserData.lastName,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      oauthProvider: provider,
      oauthProviderId: ssoUserData.providerId,
      emailVerified: ssoUserData.emailVerified || false,
    };

    return this.userRepository.create(userData);
  }

  /**
   * Check if a provider is supported
   * @param provider - The SSO provider
   * @returns True if supported
   */
  isProviderSupported(provider: SSOProvider): boolean {
    return this.ssoStrategyFactory.isProviderSupported(provider);
  }

  /**
   * Get list of supported providers
   * @returns Array of supported provider types
   */
  getSupportedProviders(): SSOProvider[] {
    return this.ssoStrategyFactory.getSupportedProviders();
  }
}

