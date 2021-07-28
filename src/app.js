// files
const express = require("express");
const app = express();
require("dotenv").config({ path: "./src/config.env" });
require("./Database/databaseConnection");
const User = require("./models/UserSchema");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(cookieParser());

app.use(express.json());

const router = require("./Router/router");

app.use(router);

app.listen(process.env.PORT, () => {
  console.log("Listening at port number 3000");
});
