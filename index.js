
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs'); // Require the 'fs' module for file system operations
require('dotenv').config();

const app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Ensure the 'uploads/' directory exists
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Store uploaded files in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storage
  }
});
const upload = multer({ storage: storage });

// POST endpoint to handle file uploads
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Respond with file information in JSON format
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});

