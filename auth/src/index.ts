import app from "./app";
import userDb from "./db/user";

userDb.public.many(`
    CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" text NOT NULL, "username" text NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"));
    `);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
