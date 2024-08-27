import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Vocabulary } from '../models/vocabulary';
import jwt from 'jsonwebtoken';
import { Dictionary } from '../dictionary/utils/dictionary';
import { playerType, usedVocabAttrs } from '../types/interfaces';

declare global {
    var signin: () => Promise<string[]>;
    var gameStart: (firstVocabulary: string) => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    // assign mock JWT_KEY for testing
    process.env.JWT_KEY = "JWT_KEY";
    
    // create database
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});

    // set up dictionary database
    await Dictionary.setUpDictionaryDatabase();
});

beforeEach(async () => {
    // clear vocabulary usage
    await Vocabulary.updateMany(
        {
            isUsed: true
        },
        {
            $set: {
                isUsed: false
            }
        }
    );
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close()
});

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

global.gameStart = async (firstVocabulary: string) => {
    // create userToken
    const email = "test@test.com";
    const username = "tester";
    
    const userPayload = {
        email, username
    };

    const userToken = jwt.sign(userPayload, process.env.JWT_KEY!);

    // create currentVocabToken
    const currentVocabPayload = {
        vocabulary: firstVocabulary
    };
    const currentVocabToken = jwt.sign(currentVocabPayload, process.env.JWT_KEY!);

    // crete usedVocabToken
    const usedVocabPayload: Array<usedVocabAttrs> = [
        {
            vocabulary: firstVocabulary,
            usedBy: playerType.CPU
        }
    ]
    const usedVocabToken = jwt.sign( { usedVocabularies : usedVocabPayload }, process.env.JWT_KEY!);

    // build session object
    const session = {
        user: userToken,
        currentVocab: currentVocabToken,
        usedVocab: usedVocabToken
    }

    // turn session to json
    const sessionJSON = JSON.stringify(session);

    // encode json as base64
    const base64= Buffer.from(sessionJSON).toString('base64');

    //  return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}
