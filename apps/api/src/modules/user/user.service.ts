import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    })
  }
}
