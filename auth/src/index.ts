import { app } from "./app";
import authDb from "./models/db";
import { DatabaseConnectionError } from "@summerinfo/common";

const start = async () => {
    if (!process.env.POSTGRES_HOSTNAME) {
        throw new Error('POSTGRES_HOSTNAME not found');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not found');
    }

    // test database connection
    try {
        await authDb.raw('SELECT 1 AS result');
        console.log('Db is connected');
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    });
}

start();
