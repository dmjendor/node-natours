const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception.  Shutting down server.');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose.set('bufferCommands', false);
const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.log('DB Connection Failed.');
    console.log('TRY TURNING OFF VPN');
    console.log(err.name, err.message);
  });

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection.  Shutting down server.');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
