import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadFolder = path.resolve(
  process.cwd(),
  "uploads",
  "payments"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req,file,cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  }
};

const uploadPaymentSlip = multer({storage,fileFilter,limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadPaymentSlip;
