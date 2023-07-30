// pages/api/uploadImage.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const imagePath = path.join(process.cwd(), "public/images/p2p.jpeg");
  const imageBuffer = fs.readFileSync(imagePath);

  res.status(200).json({ imageBuffer });
}
