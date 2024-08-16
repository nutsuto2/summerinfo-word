import * as fs from 'fs';
import * as path from 'path';
import gameDb, { Vocabulary } from '../../models/db';

export class Dictionary {
    private static dictionary: Array<Vocabulary> = [];
    private static dataPath = path.join(__dirname, '../data');

    public static setUpDictionaryDatabase = async () => {
        try {
            const files = fs.readdirSync(this.dataPath);
            files.forEach((file) => {
                const filePath = path.join(this.dataPath, file);

                const data = fs.readFileSync(filePath, 'utf-8');
                const jsonData = JSON.parse(data);

                const vocabularies = Object.keys(jsonData);
                vocabularies.forEach(async (vocab) => {
                    if (vocab.length == 5) {
                        await gameDb('vocabulary').insert({
                            vocabulary: vocab,
                            firstAlphabet: vocab[0],
                            isUsed: false
                        });
                    }
                });
            });
            return this.dictionary;
        } catch (err) {
            throw new Error('Error reading directory');
        }
    }
}
