import { Module } from '@nestjs/common';
import { SSOService } from './sso.service.js';
import { SSOController } from './sso.controller.js';
import { SSOStrategyFactory } from './factory/sso-strategy.factory.js';
import { GoogleSSOStrategy } from './strategies/google-sso.strategy.js';
import { UsersModule } from '../users/users.module.js';

/**
 * SSO Module
 * Provides SSO authentication capabilities using Strategy and Factory patterns
 * 
 * Pattern Benefits:
 * - Strategy: Each provider (Google, Microsoft, etc.) has its own implementation
 * - Factory: Creates the appropriate strategy based on provider type
 * - Scalable: Easy to add new providers without modifying existing code
 * - Maintainable: Each strategy is isolated and independently testable
 * - Type-safe: Strict TypeScript types throughout
 */
@Module({
  imports: [UsersModule],
  providers: [
    SSOService,
    SSOStrategyFactory,
    GoogleSSOStrategy,
    // Add new strategy providers here as implemented
    // MicrosoftSSOStrategy,
    // GitHubSSOStrategy,
    // AppleSSOStrategy,
  ],
  controllers: [SSOController],
  exports: [SSOService],
})
export class SSOModule {}

