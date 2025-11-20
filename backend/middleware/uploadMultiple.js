
import multer from "multer";
import path from "path";
import fs from "fs";

// Fix Windows + VSCode path issues
// __dirname replacement for ES Modules:
const __root = path.resolve();

// Yeh correct backend/uploads/products ko point karega:
const uploadPath = path.join(__root, "backend", "uploads", "products");

// Create folder if missing
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("📁 Folder created:", uploadPath);
} else {
    console.log("📁 Folder OK:", uploadPath);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + Math.floor(Math.random() * 1000000) + ext);
    },
});

const uploadMultiple = multer({ storage });

export default uploadMultiple;
