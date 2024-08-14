import db from "../models/db";
import request from 'supertest';
import { app } from "../app";

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
    const password = "Test1234@";

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, username, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie')!;
    return cookie;
}
