const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const {
  getOneBook,
  getAllBooks,
  addRating,
  getTopThreeBooks,
  createOneBook,
  updateOneBook,
  deleteOneBook,
} = require('../controllers/book');

router.post('/', auth, multer, createOneBook);
router.post('/:id/rating', auth, addRating);
router.get('/', getAllBooks);
router.get('/:id', getOneBook);
router.get('/bestrating', getTopThreeBooks);
router.put('/:id', auth, multer, updateOneBook);
router.delete('/:id', auth, deleteOneBook);

module.exports = router;
