const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const { SECRET_KEY } = process.env;
// Inscription d'un utilisateur
exports.signup = (req, res) => {
  const { email, password } = req.body;

  // Utilisation de bcrypt pour hasher le mot de passe
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
      const user = new User({
        email,
        password: hash,
      });

      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        .then(() => {
          res.status(201).json({
            message: "Utilisateur créé avec succès",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur par son email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        // Aucun utilisateur trouvé avec cet email
        res.status(401).json({
          message: "Identifiant/mot de passe incorrect",
        });
      } else {
        // Comparaison du mot de passe fourni avec le mot de passe hashé de l'utilisateur
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Les mots de passe ne correspondent pas
              res.status(401).json({
                message: "Identifiant/mot de passe incorrect",
              });
            } else {
              // Les mots de passe correspondent, création d'un jeton (token) JWT
              res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                  {
                    userId: user.id,
                  },
                  SECRET_KEY,
                  { expiresIn: "24h" },
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
