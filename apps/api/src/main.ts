import { StandardSchemaValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestNodeApplication, NodeAdapter } from '@nestjs/platform-node'

import { AppModule } from './app.module.js'
import { EnvConfig } from './config/env.config.js'

async function bootstrap() {
  const app = await NestFactory.create<NestNodeApplication>(AppModule, new NodeAdapter())

  const configService = app.get(ConfigService<EnvConfig, true>)

  app.enableCors({
    origin: configService.get('ORIGIN', { infer: true }),
    credentials: true,
  })

  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      transform: true,
    }),
  )

  app.enableShutdownHooks()

  app.setGlobalPrefix('api')

  const port = configService.get('PORT', { infer: true })

  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
}
await bootstrap()
