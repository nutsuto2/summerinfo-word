export enum playerType {
    CPU = "CPU", 
    PLAYER = "PLAYER"
}

export interface usedVocabAttrs {
    vocabulary: string,
    usedBy: playerType
}
