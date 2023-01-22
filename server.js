const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.log("UNHANDLED EXCEPTION! (⊙ˍ⊙) Shutting down...");
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const connectDB = async () => {
  try {
    // LOCAL DATABASE
    // const connect =mongoose.connect(process.env.DATABASE_LOCAL);
    const connect = await mongoose.connect(DB_URL);
    console.log("DB connection successful!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    process.exit(1);
  }
};

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `App running on port %c${PORT}%c, and listening for requests...`,
      "color:#8bc34a",
      "color:inherit"
    );
  });
});

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.log("UNHANDLED REJECTION! (⊙ˍ⊙) Shutting down...");
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
});
