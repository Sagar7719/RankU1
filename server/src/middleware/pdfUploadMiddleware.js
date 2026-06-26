import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use memory storage for PDF parsing (no need to save to disk)
const pdfStorage = multer.memoryStorage();

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB limit for PDFs
  }
});

export default pdfUpload;
