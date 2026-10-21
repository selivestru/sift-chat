import { StandardSchemaValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module.js'
import { EnvConfig } from './config/env.config.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('trust proxy', 1)

  const configService = app.get(ConfigService<EnvConfig, true>)

  app.enableCors({
    origin: configService.get('ORIGIN', { infer: true }),
    credentials: true,
  })

  app.useGlobalPipes(new StandardSchemaValidationPipe())

  app.enableShutdownHooks()

  app.setGlobalPrefix('api')

  const port = configService.get('PORT', { infer: true })

  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
}
await bootstrap()
