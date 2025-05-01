import { Request, Response } from "express";
import { Blog, ImageMedia, Tag, User } from "../models/schema";


export class MetaDataController {
    static getMetaDataInfo: any = async (req: Request, res: Response) => {
        try {
            const posts = await Blog.countDocuments();
            const comments = 0;
            const authors = await User.countDocuments();
            const tags = await Tag.countDocuments();
            const media = await ImageMedia.countDocuments();

            const recent = await Blog.find().sort("-createdAt").limit(3).select("title description createdAt")

            return res.json({
                posts,
                comments,
                tags: authors + tags,
                media,
                recent
            })
        } catch (Err: any) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: Err.message
            })
        }
    }
}