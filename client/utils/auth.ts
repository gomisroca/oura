const jwt = require("jsonwebtoken");

export function verifyUser(headers: Headers): User | null{
    const authorization = headers.get('authorization');  
    if (!authorization) {
        return null; // No authorization header found
    }
    const token = authorization.split(' ')[1];
      try {
        const user: User = jwt.verify(token, process.env.TOKEN_KEY);
        return user;
    } catch (error) {
        return null; // Token verification failed
    }
}