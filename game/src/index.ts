import { app } from "./app";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "@summerinfo/common";

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not found');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not found');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('Db is connected');
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    })
}

start();
