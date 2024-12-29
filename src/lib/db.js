const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalThis = global;

globalThis.prismaGlobal = globalThis.prismaGlobal || prismaClientSingleton();

const prisma = globalThis.prismaGlobal;

const db = prisma;

module.exports = db;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}