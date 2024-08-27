import mongoose from "mongoose";

interface VocabAttrs {
    vocabulary: string;
    firstLetter: string;
    isUsed: boolean;
}

interface VocabDoc extends mongoose.Document {
    vocabulary: string;
    firstLetter: string;
    isUsed: boolean;
}

interface VocabModel extends mongoose.Model<VocabDoc> {
    build(attrs: VocabAttrs): VocabDoc; 
}

const vocabSchema = new mongoose.Schema(
    {
        vocabulary: {
            type: String,
            required: true
        },
        firstLetter: {
            type: String,
            required: true
        },
        isUsed: {
            type: Boolean,
            requied: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

vocabSchema.statics.build = (attrs: VocabAttrs) => {
    return new Vocabulary(attrs);
}

const Vocabulary = mongoose.model<VocabDoc, VocabModel>('Vocabulary', vocabSchema);

export { Vocabulary, VocabDoc };
