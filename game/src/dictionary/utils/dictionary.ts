import * as fs from 'fs';
import * as path from 'path';
import { Vocabulary } from '../../models/vocabulary';
import { InitializeError } from '../../errors/initialize-error';

export class Dictionary {
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
                        const vocabulary = Vocabulary.build({
                            vocabulary: vocab.toLowerCase(),
                            firstLetter: vocab[0].toLowerCase(),
                            isUsed: false
                        });
                        await vocabulary.save();
                    }
                });
            });
        } catch (err) {
            throw new InitializeError('Error reading dictionary directory.');
        }
    }
}
