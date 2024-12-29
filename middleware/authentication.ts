import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    // const authHeader = req.headers.cookie;
    // if (!authHeader) {
    //     return res.status(404).json("Authorization header is missing");
    // }
    // const token = authHeader.split('=')[1];
    // jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
    //     if (err) {
    //         return res.status(404).json("Unauthorized access");
    //     } else {
    //         next();
    //     }
    // });
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({
            message: 'Authorization header missing or invalid',
            success: false,
            error: true,
        });
    }

    // Step 1: Remove "Basic " prefix
    const base64Credentials = authHeader.split(' ')[1];

    // Step 2: Decode Base64 to string
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf8');

    // Step 3: Split username and password
    const [username, password] = decodedCredentials.split(':');

    // Add your authentication logic here
    if (username === process.env.SERVER_USERNAME && password === process.env.SERVER_PASSWORD) {
        next();
    } else {
        return res.status(403).json({
            message: 'Unauthorized access',
            success: false,
            error: true,
        });
    }
};

export default authentication;
