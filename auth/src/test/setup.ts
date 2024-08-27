import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "JWT_KEY";

    // create database
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
  
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    // clear database
    const collections = await mongoose.connection.db?.collections();

    for (let collection of collections!) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
      }
      await mongoose.connection.close();
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
