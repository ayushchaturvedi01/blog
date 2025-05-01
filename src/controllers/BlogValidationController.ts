import { Request, Response } from "express";
import mongoose from "mongoose";


class BlogValidationController {

    static getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    };

    static isValidTagOrAuthorId: any = (req: Request, res: Response, next: any) => {
        try {
            const tags = req.body.tags || [];
            const authors = req.body.authors || [];
            for (const data of tags) {
                const tagId = data._id;
                if (!mongoose.Types.ObjectId.isValid(tagId)) {
                    return res.status(400).json({ success: false, error: `Invalid Tag ID: ${tagId}` });
                }
            }
            for (const data of authors) {
                const authorId = data._id;
                if (!mongoose.Types.ObjectId.isValid(authorId)) {
                    return res.status(400).json({ success: false, error: `Invalid Author ID: ${authorId}` });
                }
            }
            next();
        } catch (err) {
            console.error("Error in validation id ",err);
            return res.status(500).json({ success: false, error: this.getErrorMessage(err) });
        }

    }
}

export default BlogValidationController;