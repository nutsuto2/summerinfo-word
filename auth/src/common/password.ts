import bcrypt from 'bcrypt';

export const hashingPassword = async (password: string) => {
    const saltRounds = 10
    const storedPassword = await bcrypt.hash(password, saltRounds);
    return storedPassword;
}

export const comparePassword = async (password: string, storedPassword: string) => {
    const match = await bcrypt.compare(password, storedPassword);
    return match;
}
