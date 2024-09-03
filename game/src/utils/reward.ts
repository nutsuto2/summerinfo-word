import { playerType, usedVocabAttrs } from "../types/interfaces";
import { Vocabulary } from "../models/vocabulary";

const createMatrix = (usedVocabularies: Array<usedVocabAttrs>) => {
    const rows = 5;
    const cols = 5;
    const matrix: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
    let idx = 0;
    usedVocabularies.forEach((attrs) => {
        if (attrs.usedBy == playerType.PLAYER) {
            for (let i = 0; i < 5; i++) {
                matrix[idx][i] = attrs.vocabulary[i];
            }
            idx += 1;
        }
    });

    return matrix
}

const createVocabularies = (matrix: string[][]) => {
    const columnVocabularies: string[] = ['', '', '', '', ''];
    const diagonalVocabularies: string[] = ['', '', '', '', ''];

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            columnVocabularies[j] += matrix[i][j];
            let diagonalIndex = 0;
            if (j-i < 0) {
                diagonalIndex = 5 + ( j - i );
            } else {
                diagonalIndex = j - i; 
            }
            diagonalVocabularies[diagonalIndex] += matrix[i][j];
        }
    }
    
    return columnVocabularies.concat(diagonalVocabularies);
}

export const calculateRewards = (usedVocabularies: Array<usedVocabAttrs>, numberofPlay: number) => {

    let bonus = 100;
    if (numberofPlay == 5) {
        const matrix = createMatrix(usedVocabularies);
        const newVocabularies = createVocabularies(matrix);
        const useableVocabilaries = [];
        newVocabularies.forEach(async(vocab) => {
            const existedVocab = await Vocabulary.findOne({ vocabulary: vocab });
            if (existedVocab) {
                useableVocabilaries.push(vocab);
            }
        });
        bonus += 8 + ( 2 * useableVocabilaries.length );
    }
    bonus /= 100;
    let gold = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    gold = ( gold * ( 5 / numberofPlay ) ) + ( gold * bonus);

    return { gold,  numberofPlay };
}
