import { Request } from 'express';

interface RequestUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'BASIC' | 'EDITOR' | 'SUPER' | 'ADMIN';
    iat: number;
    exp?: number;
}

export interface AuthedRequest extends Request {
    user?: RequestUser;
}

type ProductWithSizes = Prisma.ProductGetPayload<{
    include: { sizes: { include: { colors: true } } }
}>

type SizeWithColors = Prisma.ProductSizeGetPayload<{
    include: { colors: true }
}>