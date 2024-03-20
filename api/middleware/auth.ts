const jwt = require("jsonwebtoken");
import { NextFunction, Request, RequestHandler, Response } from 'express';

interface TestRequest extends Request {
    user?: any;
}

const verifyToken: RequestHandler = (req: TestRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
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
};

module.exports = verifyToken;