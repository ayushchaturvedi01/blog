import { Router } from "express";
import multer from "multer";
import { ImageMedia, imagekit } from "../models/schema";
import { authenticateUser, validateRequest } from "../middlewares";
import { Validators } from "../validations";
import mongoose from "mongoose";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/", async (req: any, res: any) => {
    try {
        const response = await ImageMedia.find({ isDeleted: false });
        return res.json({ success: true, data: response });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.post("/delete", authenticateUser, validateRequest(Validators.deleteImagesSchema), async (req: any, res: any) => {
    try {
        const { idArray } = req.body;
        const response = await ImageMedia.updateMany({ _id: { $in: idArray } }, { isDeleted: true }, { new: true });
        return res.json({ success: true, data: response });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
});

router.put("/:id", authenticateUser, validateRequest(Validators.updateImageSchema), async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { title, altText } = req.body;

        const response = await ImageMedia.findByIdAndUpdate(id, { title, altText }, { new: true });
        return res.json({ success: true, data: response });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
});

router.post("/upload", authenticateUser, upload.single("image"), validateRequest(Validators.uploadImageSchema), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { originalname, buffer } = req.file;
        const { title, altText } = req.body;

        function calculateImageSize(size: number) {
            if (size < 1024) {
                return size + " Bytes";
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(1) + " KB";
            } else {
                return (size / (1024 * 1024)).toFixed(1) + " MB";
            }
        }

        const response = await imagekit.upload({
            file: buffer,
            fileName: originalname,
            folder: "/uploads",
        });
        const size = calculateImageSize(buffer.byteLength);
        const imageDimention = `${response.height}x${response.width}`;

        const imageData = {
            title,
            altText,
            size,
            dimensions: imageDimention,
            url: response.url,
        }

        const feedData = await ImageMedia.create(imageData);
        res.json({ success: true, url: response.url, data : feedData, message: "Image uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
});

export default router;