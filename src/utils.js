import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Crear una simulación de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de multer para guardar archivos en /public/img
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar path.join para formar correctamente la ruta
    cb(null, path.join(__dirname, "public", "img"));
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });
export default __dirname;
