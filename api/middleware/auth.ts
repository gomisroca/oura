const jwt = require("jsonwebtoken");
import { NextFunction, RequestHandler, Response } from 'express';
import { AuthedRequest, RequestUser } from '../index';

const verifyBasicToken: RequestHandler = (req: AuthedRequest, res: Response, next: NextFunction): Response | void => {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.TOKEN_KEY, (err: unknown, decoded: RequestUser) => {
        if (err){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        return next();
    })
}

const verifyEditorToken: RequestHandler = (req: AuthedRequest, res: Response, next: NextFunction): Response | void => {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.TOKEN_KEY, (err: unknown, decoded: RequestUser) => {
        if (err){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }    
        if (decoded.role == 'BASIC') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        req.user = decoded;
        return next();
    })
}

const verifySuperToken: RequestHandler = (req: AuthedRequest, res: Response, next: NextFunction): Response | void => {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.TOKEN_KEY, (err: unknown, decoded: RequestUser) => {
        if (err){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }    
        if (decoded.role == 'BASIC' || decoded.role == 'EDITOR') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        req.user = decoded;
        return next();
    })
}

const verifyAdminToken: RequestHandler = (req: AuthedRequest, res: Response, next: NextFunction): Response | void => {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.TOKEN_KEY, (err: unknown, decoded: RequestUser) => {
        if (err){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }    
        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        req.user = decoded;
        return next();
    })
}

module.exports = { verifyBasicToken, verifyEditorToken, verifySuperToken, verifyAdminToken };