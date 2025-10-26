import { Injectable, BadRequestException } from '@nestjs/common';
import { ISSOStrategy } from '../../../common/interface/sso-strategy.js';
import { SSOProvider } from '../../../common/enums/sso-provider.js';
import { GoogleSSOStrategy } from '../strategies/google-sso.strategy.js';

/**
 * Factory pattern implementation for SSO Strategies
 * Creates appropriate SSO strategy based on provider type
 * 
 * Benefits:
 * - Single Responsibility: Each strategy handles one provider
 * - Open/Closed Principle: Easy to add new providers without modifying existing code
 * - Dependency Inversion: Code depends on ISSOStrategy interface, not concrete implementations
 */
@Injectable()
export class SSOStrategyFactory {
  private readonly strategies: Map<SSOProvider, ISSOStrategy>;

  constructor(private readonly googleSSOStrategy: GoogleSSOStrategy) {
    // Register all available strategies
    this.strategies = new Map();
    this.strategies.set(SSOProvider.GOOGLE, googleSSOStrategy);

    // Add new providers here as they are implemented
    // this.strategies.set(SSOProvider.MICROSOFT, microsoftSSOStrategy);
    // this.strategies.set(SSOProvider.GITHUB, githubSSOStrategy);
    // this.strategies.set(SSOProvider.APPLE, appleSSOStrategy);
  }

  /**
   * Creates and returns the appropriate SSO strategy based on provider
   * @param provider - The SSO provider type
   * @returns Strategy implementation for the specified provider
   * @throws BadRequestException if provider is not supported
   */
  createStrategy(provider: SSOProvider): ISSOStrategy {
    const strategy = this.strategies.get(provider);

    if (!strategy) {
      const supportedProviders = Array.from(this.strategies.keys()).join(', ');
      throw new BadRequestException(
        `Unsupported SSO provider: ${provider}. Supported providers: ${supportedProviders}`
      );
    }

    return strategy;
  }

  /**
   * Checks if a provider is supported
   * @param provider - The SSO provider type
   * @returns True if supported, false otherwise
   */
  isProviderSupported(provider: SSOProvider): boolean {
    return this.strategies.has(provider);
  }

  /**
   * Returns all supported providers
   * @returns Array of supported provider types
   */
  getSupportedProviders(): SSOProvider[] {
    return Array.from(this.strategies.keys());
  }
}

