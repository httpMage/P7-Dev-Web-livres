const express = require("express");
const sharp = require("../middleware/sharp");

const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {
  getBookById,
  getAllBooks,
  addRating,
  getTopThreeBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");

router.get("/", getAllBooks);
router.get("/bestrating", getTopThreeBooks);
router.post("/", auth, multer, sharp, createBook);
router.get("/:id", getBookById);
router.post("/:id/rating", auth, addRating);
router.put("/:id", auth, multer, sharp, updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;
