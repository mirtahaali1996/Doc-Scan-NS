const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const app = express();
const port = 3000;

// Set upload directory
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'doc-scan-nodejs')));
const form_path = path.join(__dirname, 'client.html');

app.get('/', function (req, res) {
    res.sendFile(form_path);
});

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

    // The file is automatically saved to the uploadDir by formidable
    res.send({
      msg: 'File uploaded successfully!',
      // file: `uploads/${path.basename(file.filepath)}`
    });
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
