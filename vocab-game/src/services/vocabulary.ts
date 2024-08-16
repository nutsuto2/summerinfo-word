import gameDb, { Vocabulary } from '../models/db';

function getRandomVocabulary(vocabularyArray: Vocabulary[]) {
    const randomIndex = Math.floor(Math.random() * vocabularyArray.length);
    return vocabularyArray[randomIndex];
}

export const findFirstVocabulary = async () => {
    // query vocabulary that is not used yet
    const response = await gameDb<Vocabulary>('vocabulary').where({
        isUsed: false
    });

    if (response.length == 0) {
        throw new Error('Ran out of vocabulary');
    }

    // randomly select vocabulary
    const firstVocabulary = getRandomVocabulary(response) as Vocabulary;

    // update the vocabulary isUsed to true
    await gameDb('vocabulary').where({ vocabulary: firstVocabulary.vocabulary }).update({
        isUsed: true
    });

    return firstVocabulary;
}

export const findVocabulary = async (connectingVocabulary: string, usedVocabularies: string[]) => {
    // query vocabulary that is not used in the game session and can be used to connect
    const response = await gameDb<Vocabulary>('vocabulary').where('firstAlphabet', 'like', connectingVocabulary[0]).whereNotIn('vocabulary', usedVocabularies);

    if (response.length == 0) {
        throw new Error('Ran out of vocabulary');
    }

    // randomly select vocabulary
    const vocabulary = getRandomVocabulary(response);

    return vocabulary;
}

export const compareVocabulary = async (connectingVocabulary: string, currentVocabulary: string) => {
    if (currentVocabulary[-1] === connectingVocabulary[0]) {
        return true;
    }
    return false;
}
