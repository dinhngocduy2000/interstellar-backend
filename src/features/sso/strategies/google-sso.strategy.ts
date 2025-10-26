import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISSOStrategy } from '../../../common/interface/sso-strategy.js';
import { SSOUserData } from '../../../common/interface/sso-user-data.js';
import { SSOProvider } from '../../../common/enums/sso-provider.js';
import { OAuth2Client } from 'google-auth-library';
import { URL } from 'url';

/**
 * Google SSO Strategy Implementation
 * Handles Google OAuth 2.0 authentication flow
 */
@Injectable()
export class GoogleSSOStrategy implements ISSOStrategy {
  private readonly oauth2Client: OAuth2Client;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID', '');
    this.clientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
      ''
    );
    this.redirectUri = this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
      'http://localhost:3000/api/auth/sso/google/callback'
    );
    this.scopes = [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    this.oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
  }

  getProvider(): SSOProvider {
    return SSOProvider.GOOGLE;
  }

  getAuthorizationUrl(state?: string): string {
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      state: state,
      prompt: 'consent', // Forces refresh token
    });

    return authorizationUrl;
  }

  async getUserData(code: string): Promise<SSOUserData> {
    try {
      // Exchange authorization code for access token
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Verify and decode the ID token
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token || '',
        audience: this.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException(
          'Failed to retrieve user data from Google'
        );
      }

      // Extract name information
      const fullName = payload.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        providerId: payload.sub,
        email: payload.email || '',
        firstName,
        lastName,
        displayName: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
        locale: payload.locale,
      };
    } catch (error) {
      console.error('Error in Google SSO getUserData:', error);
      throw new BadRequestException('Invalid authorization code');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });

      return !!ticket.getPayload();
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

