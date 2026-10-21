import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

import { Prisma } from '~/generated/prisma/client.js'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  override catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === 'P2002') {
      return super.catch(new ConflictException('Resource already exists'), host)
    }

    return super.catch(exception, host)
  }
}
