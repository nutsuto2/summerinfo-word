export const config = {
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOSTNAME,
        port: 5432,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD
    }
}
