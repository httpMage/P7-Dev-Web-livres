// const sharp = require("sharp");

// module.exports = (req, res, next) => {
//   if (!req.file) {
//     return next();
//   }

//   sharp(req.file.buffer)
//     .resize({ width: 206, height: 260 })
//     .webp({ quality: 90 })
//     .toBuffer()
//     .then((outputBuffer) => {
//       req.file.buffer = outputBuffer;
//       next();
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };
const sharp = require("sharp");
const path = require("path");

module.exports = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const transformedFilename = `${
    req.file.originalname.split(" ").join("_").split(".")[0]
  }_${Date.now()}.webp`;

  const outputPath = path.join(__dirname, "..", "images", transformedFilename);

  sharp(req.file.buffer)
    .resize({ height: 600 })
    .webp({ quality: 90 })
    .toFile(outputPath, (error) => {
      if (error) {
        return res.status(500).json({ error });
      }
      req.file.filename = transformedFilename;
      req.file.path = outputPath;
      next();
    });
};
