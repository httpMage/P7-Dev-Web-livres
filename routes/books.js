const express = require("express");
const sharp = require("../middleware/sharp");

const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {
  getOneBook,
  getAllBooks,
  addRating,
  getTopThreeBooks,
  createOneBook,
  updateOneBook,
  deleteOneBook,
} = require("../controllers/book");

router.get("/", getAllBooks);
router.get("/bestrating", getTopThreeBooks);
router.post("/", auth, multer, sharp, createOneBook);
router.get("/:id", getOneBook);
router.post("/:id/rating", auth, addRating);
router.put("/:id", auth, multer, sharp, updateOneBook);
router.delete("/:id", auth, deleteOneBook);

module.exports = router;
