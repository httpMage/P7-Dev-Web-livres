const Book = require('../models/book')
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};
exports.getTopThreeBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((top3Books) => {
      res.status(200).json(top3Books);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.createOneBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    rating: [],
    imageUrl: `${req.protocol}://${req.get(
      'host'
    )}/images/${req.file.filename}`,
  });
  book
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.updateOneBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get(
          'host'
        )}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res
          .status(401)
          .json({ message: 'Not authorized' });
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() =>
          res
            .status(200)
            .json({ message: 'Objet modifié!' })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.deleteOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .json({ message: 'Book not found' });
      }

      if (book.userId != req.auth.userId) {
        return res
          .status(401)
          .json({ message: 'Not authorized' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res
              .status(200)
              .json({ message: 'Objet supprimé !' });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body;
  const makeAverageRating = (book) => {
    const total = book.ratings.reduce(
      (acc, val) => acc + val.grade,
      0
    );
    return total / book.ratings.length;
  };

  const isUniqueRating = (book) => {
    const isDoubleRated = book.ratings.find(
      (element) => element.userId === userId
    );
    return isDoubleRated !== undefined;
  };

  if (rating > 5 || rating < 0) {
    return res
      .status(400)
      .json({ error: 'Invalid rating value' });
  }

  Book.findById({ _id: req.params.id })
    .then((book) => {
      if (isUniqueRating(book)) {
        return res.status(403).json({
          error: 'User has already rated this book',
        });
      }
      book.ratings.push({ userId: userId, grade: rating });
      book.averageRating = makeAverageRating(book);
      book
        .save()
        .then(() => {
          res.status(200).json({ book });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
