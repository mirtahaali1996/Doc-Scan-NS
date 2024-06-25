const express = require('express');
const path = require('path');
const formidable = require('formidable');

const app = express();
const port = 3000;

// Set upload directory
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Ensure the upload directory exists
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for uploading image
app.post('/upload', (req, res) => {
  const customOption = {
    uploadDir: uploadDir,
    keepExtensions: true,
    allowEmptyFiles: false,
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10 GB
    multiples: true
  };

  const form = new formidable.IncomingForm(customOption);

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).send({ msg: err.message });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).send({ msg: 'No file uploaded!' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFileName = uniqueSuffix + '-' + file.originalFilename;
    const newFilePath = path.join(uploadDir, newFileName);

    // Move the file to the new location
    fs.rename(file.filepath, newFilePath, (err) => {
      if (err) {
        return res.status(500).send({ msg: 'Error saving file', error: err.message });
      }

      res.send({
        msg: 'File uploaded successfully!',
        file: `uploads/${newFileName}`
      });
    });
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
