import mongoose from "mongoose";
import { usedVocabAttrs } from "../types/interfaces";

interface UserAttrs {
    username: string;
    currentVocabulary: string;
    usedVocabularies: Array<usedVocabAttrs>;
    isFinished: boolean;
}

interface UserDoc extends mongoose.Document {
    username: string;
    currentVocabulary: string;
    usedVocabularies: Array<usedVocabAttrs>;
    isFinished: boolean;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    currentVocabulary: {
        type: String,
        required: true
    },
    usedVocabularies: {
        type: Array<usedVocabAttrs>,
        required: true
    },
    isFinished: {
        type: Boolean,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export { User };
