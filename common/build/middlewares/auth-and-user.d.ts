import { Request, Response, NextFunction } from 'express';
interface UserPayload {
    email: string;
    username: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
export declare const authAndUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
