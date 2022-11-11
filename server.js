const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNHANDLED EXCEPTION! (⊙ˍ⊙) Shutting down...');
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const DB_URL = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// eslint-disable-next-line no-console
mongoose.connect(DB_URL).then(() => console.log('DB connection successful!'));

// LOCAL DATABASE
// mongoose.connect(process.env.DATABASE_LOCAL).then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT || 8000;

//* START THE SERVER
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `App running on port %c${PORT}%c...`,
    'color:#8bc34a',
    'color:inherit'
  );
});

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNHANDLED REJECTION! (⊙ˍ⊙) Shutting down...');
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
