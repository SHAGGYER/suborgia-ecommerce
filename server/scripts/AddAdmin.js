const path = require("path");
const mongoose = require("mongoose");
const {config} = require("dotenv");
const Admin = require("../models/Admin");
const yargs = require("yargs");

config({
  path: path.join(__dirname, "..", ".env"),
});


const usage = "\nAdds a coach";
const options = yargs
  .usage(usage)
  .option("n", {
    alias: "name",
    describe: "Name",
    type: "string",
    demandOption: true,
  })
  .option("e", {
    alias: "email",
    describe: "Email",
    type: "string",
    demandOption: true,
  })
  .option("p", {
    alias: "password",
    describe: "Password",
    type: "string",
    demandOption: true,
  })
  .help(true).argv;


const {e, _, p, n, ...admin} = options;

const run = async () => {
  mongoose.connect(process.env.MONGODB_URI, () =>
    console.log("Connected to MongoDB")
  );

  const newAdmin = new Admin({
    ...admin,
  })

  await newAdmin.save();

  console.log(`Inserted admin`);
  process.exit(0);
};

run();
