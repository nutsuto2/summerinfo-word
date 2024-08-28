import { app } from "./app";

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not found');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not found');
    }

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    });
}

start();
