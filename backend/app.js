const express = require("express");
const path = require("path");
const cors = require("cors");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const connectDB = require("./db");

connectDB(); // Connexion à MongoDB

const app = express();

app.use(express.json());
app.use(cors());
app.use("/books", booksRoutes);
app.use("/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));


module.exports = app;
