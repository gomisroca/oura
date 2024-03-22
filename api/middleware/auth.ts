const jwt = require("jsonwebtoken");
import { NextFunction, RequestHandler, Response } from 'express';
import { AuthedRequest } from '../index';

const verifyToken: RequestHandler = (req: AuthedRequest, res: Response, next: NextFunction) => {
    let authHeader: string | undefined = req.headers.authorization;
    let token: string;
    if (authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
        if (!token) {
            return res.status(400).send("A token is required for authentication");
        } else {
            try {
                const decodedUserData = jwt.verify(token, process.env.TOKEN_KEY);
                req.user = decodedUserData;
                return next();
            } catch (err) {
                return res.status(401).send("Invalid Token");
            }
        }
    } else{
        return res.status(401).send("Invalid Token");
    }
};

module.exports = verifyToken;