import { app } from "./app";
import userDb from "./models/user";
import { DatabaseConnectionError } from "@summerinfo/common";

const start = async () => {
    if (!process.env.POSTGRES_HOSTNAME) {
        throw new Error('POSTGRES_HOSTNAME not found');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not found')
    }

    userDb.connect((err) => {
        if (err) {
            throw new DatabaseConnectionError();
        }
        console.log('Db is connected');
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    });
}

start();
