// database.js
const { createConnection } = require('typeorm');
require('dotenv').config();

async function connect() {
  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    // softDelete: false,
    // typeorm: {
    //   softDelete: true,
    // },
    logging: false,
    synchronize: true, // Atur false jika tidak ingin sinkronisasi skema otomatis
  });
  console.log('Database connection successful');
}
module.exports = { connect };
