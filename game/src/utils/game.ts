import { Vocabulary, VocabDoc } from '../models/vocabulary';
import { playerType, usedVocabAttrs } from '../types/interfaces';

export class Game {
    private static getRandomVocabulary(vocabularyArray: VocabDoc[]) {
        const randomIndex = Math.floor(Math.random() * vocabularyArray.length);
        return vocabularyArray[randomIndex];
    }

    static async findFirstVocabulary() {
        // query vocabulary that is not used yet
        const response = await Vocabulary.find({
            isUsed: false
        });

        if (response.length == 0) {
            throw new Error('Ran out of vocabulary');
        }

        // randomly select vocabulary
        const firstVocabulary = this.getRandomVocabulary(response);

        // update the vocabulary isUsed to true
        firstVocabulary.updateOne({
            isUsed: true
        });

        return firstVocabulary.vocabulary;
    }

    static async findVocabulary(connectingVocabulary: string, usedVocabularies: string[]) {
        // query vocabulary that is not used in the game session and can be used to connect
        const response = await Vocabulary.find({
            vocabulary: { $nin: usedVocabularies },
            firstLetter: connectingVocabulary[connectingVocabulary.length-1]
        })

        if (response.length == 0) {
            throw new Error('Ran out of vocabulary');
        }

        // randomly select vocabulary
        const vocabulary = this.getRandomVocabulary(response);

        return vocabulary;
    }

    static async compareVocabulary(connectingVocabulary: string, currentVocabulary: string) {
        if (currentVocabulary[currentVocabulary.length-1] === connectingVocabulary[0]) {
            return true;
        }
        return false;
    }

    static async duplicationCheck(connectingVocabulary: string, usedVocabularies: string[]) {
        if (usedVocabularies.includes(connectingVocabulary)) {
            return true
        }
        return false;
    }

    static async getNumberofPlay(usedVocabularies: Array<usedVocabAttrs>) {
        let numberofPlay = 0;
        usedVocabularies.forEach((attrs) => {
            if (attrs.usedBy === playerType.PLAYER) {
                numberofPlay += 1;
            }
        });

        return numberofPlay;
    }

}
