const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../pdfs', fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'PDF not found' });
  }
});

module.exports = router;
