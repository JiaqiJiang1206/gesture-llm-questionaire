// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const multer = require('multer');
// const router = express.Router();

// // Ensure the uploads directory exists
// const uploadDir = 'uploads';
// if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir);
// }

// // Set up multer for file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// // Define the file upload route
// router.post('/upload', upload.single('file'), (req, res) => {
//     console.log('File received:', req.file);
//     res.send({ message: 'File uploaded successfully' });
// });

// module.exports = router;

const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { exec } = require("child_process");
const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define the file upload route
router.post("/upload", upload.single("file"), (req, res) => {
    console.log("File received:", req.file);
  
    const inputPath = path.join(uploadDir, req.file.filename);
    const outputFilename = req.file.filename.split(".")[0] + ".mp3"; // 修改输出文件名为 MP3 格式
    const outputPath = path.join(uploadDir, outputFilename);
    // Convert WebM to MP3 using FFmpeg
    exec(`ffmpeg -i ${inputPath} -vn -ar 44100 -ac 2 -ab 192k -f mp3 ${outputPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during conversion: ${error.message}`);
        return res.status(500).send({ message: "Conversion failed" });
      }
      console.log(`Conversion successful: ${outputPath}`);
      res.send({ message: "File uploaded and converted successfully", path: outputPath });
    });
  });
  
module.exports = router;
