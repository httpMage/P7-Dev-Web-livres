const fs = require("fs");
require("../middleware/multer-config");
const Book = require("../models/book");

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books)) // Renvoie un tableau de tous les livres de la base de données.
    .catch((error) => res.status(500).json({ error }));
};

// Récupérer un livre par son ID
exports.getBookById = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.status(200).json(book); // Renvoie le livre avec l’_id fourni
    })
    .catch((error) => res.status(404).json({ error }));
};

// Récupérer les trois livres les mieux notés
exports.getTopThreeBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((top3Books) => {
      res.status(200).json(top3Books); // Renvoie un tableau des 3 livres de la base de données ayant la meilleure note moyenne.
    })
    .catch((error) => res.status(500).json({ error }));
};

// Créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.id;
  delete bookObject.userId;
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Mettre à jour un livre
exports.updateBook = (req, res, next) => {
  // Si req.file existe (si une image est téléchargée)
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        // Ajouter une nouvelle propriété imageUrl
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // Si aucune image n'est téléchargée, utiliser directement les propriétés de req.body
      { ...req.body };

  delete bookObject.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // verifie si l'utilisateur est celui qui à creer le livre
      if (book.userId !== req.auth.userId) {
        return res.status(403).json(new Error());
      }
      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
      )
        .then(() => {
          return res.status(200).json({ message: "Objet modifié !" });
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json(new Error());
      }
      // verifie si l'utilisateur est celui qui à creer le livre
      if (book.userId !== req.auth.userId) {
        return res.status(401).json(new Error());
      }
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            return res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => {
            return res.status(500).json({ error });
          });
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

// Ajouter une note à un livre
exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body;

  // Calculer la nouvelle note moyenne d'un livre
  const makeAverageRating = (book) => {
    const total = book.ratings.reduce((acc, val) => acc + val.grade, 0);
    return total / book.ratings.length;
  };

  // Vérifier si l'utilisateur a déjà noté le livre
  const hasUserAlreadyRated = (book) => {
    const isDoubleRated = book.ratings.find(
      (element) => element.userId === userId,
    );
    return isDoubleRated !== undefined;
  };
  // Verifie si la note est bien entre 0 et 5
  if (rating > 5 || rating < 0) {
    return res.status(400).json(new Error());
  }

  Book.findById(req.params.id)
    .then((book) => {
      if (hasUserAlreadyRated(book)) {
        return res.status(403).json(new Error());
      }
      book.ratings.push({ userId, grade: rating });
      book.averageRating = makeAverageRating(book);
      book
        .save()
        .then(() => {
          return res.status(200).json(book);
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};
