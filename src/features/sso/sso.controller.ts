import {
  Controller,
  Get,
  Query,
  HttpStatus,
  BadRequestException,
  Redirect,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SSOService } from './sso.service.js';
import { SSOProvider } from '../../common/enums/sso-provider.js';
import { SuccessResponse } from '../../common/interface/success-response.js';

/**
 * SSO Controller
 * Handles SSO authentication endpoints
 * 
 * @example
 * GET /api/auth/sso/google/login - Initiate Google OAuth
 * GET /api/auth/sso/google/callback?code=xxx - OAuth callback
 */
@ApiTags('auth')
@Controller('auth/sso')
export class SSOController {
  constructor(private readonly ssoService: SSOService) {}

  /**
   * Initiate SSO login with a provider
   * Returns authorization URL to redirect user to
   * 
   * @param provider - SSO provider (google, microsoft, etc.)
   * @returns Redirect to provider's authorization URL
   */
  @Get(':provider/login')
  @ApiOperation({ summary: 'Initiate SSO login with provider' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to provider authorization page',
  })
  @ApiParam({ name: 'provider', enum: SSOProvider })
  @Redirect()
  async login(@Param('provider') provider: string) {
    // Validate provider
    const providerType = provider.toLowerCase() as SSOProvider;
    if (!this.ssoService.isProviderSupported(providerType)) {
      throw new BadRequestException(
        `Unsupported provider: ${provider}. Supported: ${this.ssoService
          .getSupportedProviders()
          .join(', ')}`
      );
    }

    // Generate state for CSRF protection
    const state = this.generateState();

    // Get authorization URL
    const authorizationUrl = this.ssoService.getAuthorizationUrl(
      providerType,
      state
    );

    return { url: authorizationUrl, statusCode: HttpStatus.FOUND };
  }

  /**
   * Handle OAuth callback from provider
   * Redirects to frontend with tokens in URL hash for security
   * 
   * @param provider - SSO provider
   * @param code - Authorization code from OAuth flow
   * @param state - State parameter (for CSRF protection)
   * @returns Redirect to frontend with tokens
   */
  @Get(':provider/callback')
  @ApiOperation({ summary: 'Handle OAuth callback from provider' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to frontend with authentication tokens',
  })
  @ApiParam({ name: 'provider', enum: SSOProvider })
  @Redirect()
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') state?: string,
    @Query('error') error?: string
  ) {
    // Handle OAuth errors
    if (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      return {
        url: `${frontendUrl}/auth/callback?error=${encodeURIComponent(error)}`,
        statusCode: HttpStatus.FOUND,
      };
    }

    if (!code) {
      throw new BadRequestException('Authorization code is required');
    }

    const providerType = provider.toLowerCase() as SSOProvider;
    if (!this.ssoService.isProviderSupported(providerType)) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }

    try {
      // Exchange code for tokens and user info
      const result = await this.ssoService.authenticate(providerType, code);

      // Frontend URL to redirect to
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      
      // Build redirect URL with tokens in hash (secure, doesn't appear in server logs)
      const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
      
      // Add tokens to URL hash for security
      const hashParams = new URLSearchParams();
      hashParams.set('access_token', result.accessToken);
      hashParams.set('refresh_token', result.refreshToken);
      hashParams.set('expires_in', result.expiresIn.toString());
      hashParams.set('email', result.email);
      hashParams.set('username', result.username);
      hashParams.set('role', result.role);
      hashParams.set('is_new_user', result.isNewUser ? 'true' : 'false');
      hashParams.set('provider', result.provider);

      return {
        url: `${redirectUrl.toString()}#${hashParams.toString()}`,
        statusCode: HttpStatus.FOUND,
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      return {
        url: `${frontendUrl}/auth/callback?error=${encodeURIComponent('authentication_failed')}`,
        statusCode: HttpStatus.FOUND,
      };
    }
  }

  /**
   * Get list of supported SSO providers
   * 
   * @returns List of supported providers
   */
  @Get('providers')
  @ApiOperation({ summary: 'Get list of supported SSO providers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of supported providers',
  })
  getProviders(): SuccessResponse & { data: string[] } {
    const providers = this.ssoService.getSupportedProviders();
    return {
      message: 'Supported SSO providers',
      code: HttpStatus.OK,
      data: providers,
    };
  }

  /**
   * Generate a random state string for CSRF protection
   * In production, you should store this in a session/Redis and validate it
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

