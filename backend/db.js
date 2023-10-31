const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.xuxt7t2.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée !");
  }
};

module.exports = connectDB;
