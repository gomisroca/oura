import { Request } from 'express';

interface RequestUser {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    admin: boolean;
    iat: number;
    exp: number;
}

export interface AuthedRequest extends Request {
    user?: RequestUser;
}