import db from "../models/db";
import jwt from 'jsonwebtoken';

jest.mock("../models/db");

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
    await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('uuid');
        table.string('email');
        table.string('username');
        table.string('password');
    });
});

beforeEach(async () => {
    // clear database
    await db('users').truncate();
})

afterAll(async () => {
    await db.destroy();
})

global.signin = async () => {
    const email = "test@test.com";
    const username = "tester";

    // Build a JWT payload.  { email, username }
    const payload = {
        email, username
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { user: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}
