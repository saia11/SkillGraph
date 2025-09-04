import type {NextFunction, Request, Response} from 'express';
import admin from 'firebase-admin';

declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; // Bearer <token>

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // <token>
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = await admin.auth().verifyIdToken(token);
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
        
    }
}
 export { authenticate };