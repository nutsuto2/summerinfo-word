import { Request, Response, NextFunction } from 'express';
interface WordPayload {
    word: string;
}
declare global {
    namespace Express {
        interface Request {
            currentWord?: WordPayload;
        }
    }
}
export declare const currentWord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
