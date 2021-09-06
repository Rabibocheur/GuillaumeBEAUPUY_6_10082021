const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const morgan = require('morgan');
require("dotenv").config();

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Gestion CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }); 

app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
