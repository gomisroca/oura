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