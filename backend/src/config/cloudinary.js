import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret =
  process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "Cloudinary env vars missing. Set CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET in backend/.env."
  );
}

export default cloudinary;
