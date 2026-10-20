import { AuthenticationModule } from '@nestjs/authentication'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller.js'
import { PrismaModule } from './infrastructure/prisma/prisma.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/user/user.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule.forRoot({
      session: {
        absoluteTtl: '7d',
        idleTtl: '3d',
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
