import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Container, Service } from 'typedi';

@Service()
class PrismaClientSingleton {

    public prisma: PrismaClient;

   constructor() {
    this.prisma = new PrismaClient().$extends(withAccelerate());
  }
}
export default PrismaClientSingleton;
