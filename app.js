const Hapi = require('@hapi/hapi');
const routes = require('./src/routes/route');
const userRoute = require('./src/routes/user.route');
const { connect } = require('./src/config/db');

const Server = Hapi.Server({
  port: process.env.PORT,
  host: 'localhost',
});

Server.route(routes);
Server.route(userRoute);

const init = async () => {
  try {
    await connect();
    await Server.start();
    console.log(`Server running at: ${Server.info.uri}`);
  } catch (error) {
    console.log(error);
  }
};
init().catch((err) => {
  console.error(err);
  process.exit(1);
});
