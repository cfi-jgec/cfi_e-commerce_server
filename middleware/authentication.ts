import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.cookie;
    if (!authHeader) {
        return res.status(404).json("Authorization header is missing");
    }
    const token = authHeader.split('=')[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
        if (err) {
            return res.status(404).json("Unauthorized access");
        } else {
            next();
        }
    });
};

export default authentication;
