require('dotenv/config');
const { DataSource } = require('typeorm');
const path = require('path');

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,

    entities: [path.join(__dirname, '..', 'dist', '**', '*.entity.js')],
    migrations: [path.join(__dirname, '..', 'dist', 'database', 'migrations', '*.js')],

    synchronize: false,
});

module.exports = { dataSource };