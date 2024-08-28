import express from 'express';
import mongoose from 'mongoose';
import { DatabaseConnectionError } from "@summerinfo/common";

const router = express.Router();

router.get('/api/game/health', async (req, res) => {
    // test database connection
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        res.status(200).send('OK')
    } catch (err) {
        throw new DatabaseConnectionError();
    }
});

export { router as healthRouter };
