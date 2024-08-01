import userDb from "../db/user";
import request from 'supertest';
import { app } from "../app";

declare global {
    var signin: () => Promise<string[]>;
}

beforeAll(async () => {
    // assign mock JWT_KEY for testing
    const originalEnv = process.env;
    process.env = {
        ...originalEnv,
        JWT_KEY: "jwt_key"
    }

    // create database
    userDb.public.one(`
        CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" text NOT NULL, "email" text NOT NULL, "username" text NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"));
        `);
});

beforeEach(async () => {
    // clear database
    userDb.public.one(`
        TRUNCATE TABLE "user";
        `);
})

global.signin = async () => {
    const email = "test@test.com";
    const username = "tester";
    const password = "Test1234@";

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, username, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie || [''];
}
