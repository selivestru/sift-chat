import { AuthenticationModule, google } from '@nestjs/authentication'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'

import { AppController } from './app.controller.js'
import { EnvConfig, envSchema } from './config/env.config.js'
import { PrismaExceptionFilter } from './infrastructure/prisma/prisma-exception.filter.js'
import { PrismaModule } from './infrastructure/prisma/prisma.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UsersModule } from './modules/users/users.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        session: {
          absoluteTtl: '7d',
          idleTtl: '3d',
          trustedOrigins: [configService.get('ORIGIN', { infer: true })],
        },
        oidc: {
          callbackUrl: `${configService.get('APP_URL', { infer: true })}/api/auth/oidc/:provider/callback`,
          providers: {
            google: google({
              clientId: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
              clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
            }),
          },
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
