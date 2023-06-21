// database.js
const { createConnection } = require('typeorm');
const userEntity = require('../entitites/User');

async function connect() {
  await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'hapi-boilerplate',
    entities: [userEntity],
    logging: false,
    synchronize: true, // Atur false jika tidak ingin sinkronisasi skema otomatis
  });

  console.log('Database connection successful');
}

module.exports = { connect };
