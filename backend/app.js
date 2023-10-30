const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

const { DB_USER, DB_PASSWORD } = process.env;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.xuxt7t2.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());

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

app.use("/grimoire/books", booksRoutes);
app.use("/grimoire/auth", authRoutes);
app.use("/grimoire/images", express.static(path.join(__dirname, "images")));

module.exports = app;
