import formidable from "formidable";
import fs from "fs";
import { sanity } from "../../lib/sanity";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Increase max size (1GB); adjust if needed
  const form = formidable({
    multiples: true,
    maxTotalFileSize: 1024 * 1024 * 1024, // 1GB
    maxFileSize: 1024 * 1024 * 1024,      // 1GB per file
    keepExtensions: true
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      // Too large
      if (err.code === 1009) {
        return res.status(413).json({
          error: "Uploaded files exceed the 1GB server limit. If you are using Vercel/Netlify, try a file under 100MB.",
        });
      }
      // Other error
      console.error("Formidable error", err);
      return res.status(500).json({
        error: "File parsing error. " + (err.message || "Unknown error"),
      });
    }

    // Ensure busId is always a string
    let busId = fields.busId;
    if (Array.isArray(busId)) busId = busId[0];
    if (!busId) {
      return res.status(400).json({ error: "Missing busId" });
    }

    let fileArr = files.files;
    if (!fileArr) {
      return res.status(400).json({ error: "No files found in upload." });
    }
    if (!Array.isArray(fileArr)) fileArr = [fileArr];

    try {
      const results = [];
      for (const file of fileArr) {
        const data = fs.readFileSync(file.filepath);

        // Upload image asset to Sanity
        const uploadRes = await sanity.assets.upload("image", data, {
          filename: file.originalFilename,
        });

        // Create busImage document
        const imageDoc = {
          _type: "busImage",
          bus: { _type: "reference", _ref: busId },
          label: file.originalFilename.replace(/\.[^/.]+$/, ""),
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadRes._id,
            },
          },
          uploadDate: new Date().toISOString(),
        };

        const createdDoc = await sanity.create(imageDoc);
        results.push(createdDoc);
      }
      res.status(200).json({ success: true, images: results });
    } catch (e) {
      console.error("Upload error:", e);
      res.status(500).json({ error: "Failed to upload images. Try again." });
    }
  });
}
