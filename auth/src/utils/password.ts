import bcrypt from 'bcrypt';

export class Password {
    static async hashingPassword(password: string) {
        const saltRounds = 10
        const storedPassword = await bcrypt.hash(password, saltRounds);
        return storedPassword;
    }

    static async comparePassword(password: string, storedPassword: string) {
        const match = await bcrypt.compare(password, storedPassword);
        return match;
    }
}
