import { app } from "./app";
import mongoose from "mongoose";
import { Dictionary } from "./dictionary/utils/dictionary";
import { DatabaseConnectionError } from "@summerinfo/common";

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not found');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not found');
    }

    // initialize database
    try {
        await mongoose.connect(process.env.MONGO_URI!)
            .then(async () => {
                await Dictionary.setUpDictionaryDatabase();
            });
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    })
}

start();
