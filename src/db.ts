import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
  var isAdminLoginGlobal: boolean;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export const isAdminLogin = globalThis.isAdminLoginGlobal ?? false;
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export function encryptToken(payload: any) {
  return jwt.sign(payload, process.env.ADMIN_PASSWORD as string, {
    expiresIn: "30d",
  });
}

export function verifyToken(token: any) {
  return jwt.verify(token, process.env.ADMIN_PASSWORD as string);
}
