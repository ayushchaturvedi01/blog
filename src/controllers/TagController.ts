
import { Request, Response } from 'express';
import { Blog, Tag } from '../models/schema';
import mongoose from 'mongoose';

export class TagController {

    static getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    };

    static get: any = async (req: Request, res: Response) => {
        try {
            const response = await Tag.find();
            return res.status(200).json({ success: true, response, message: "Tags fetched successfully" });
        } catch (err) {
            return res.status(500).json({ message: 'Error in tags', error: this.getErrorMessage(err) });
        }
    }
    static getById: any = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const response = await Tag.findById(id).populate({
                path : "blogs",
                populate :[
                    {
                        path : "tags",
                        select : "name slug"
                    },
                    {
                        path : "authors",
                        select : "name username"
                    }
                ]
            }) || [];
            return res.status(200).json({ success: true, response });
        } catch (err) {
            return res.status(500).json({ success: false, error: this.getErrorMessage(err), message: "Tag fetched successfully" });
        }
    }

    static getPrimary: any = async (req: Request, res: Response) => {
        try {
            const response = await Tag.find({ isPrimary: true });
            return res.status(200).json({ success: true, response, message: "Primary tag fetched successfully" });
        } catch (err) {
            return res.status(500).json({ message: 'Error in tags', error: this.getErrorMessage(err) });
        }
    }

    static create: any = async (req: Request, res: Response) => {
        const tags = req.body;
    
        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Request body must be a non-empty array of tags"
            });
        }
    
        const invalidTags = tags.filter(tag => !tag.name || !tag.slug);
        if (invalidTags.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Each tag must include 'name' and 'slug'"
            });
        }
    
        const dataContent = tags.map(tag => ({
            name: tag.name,
            slug: tag.slug,
            isPrimary: tag.isPrimary || false
        }));
    
        try {
            const response = await Tag.insertMany(dataContent);
            return res.status(200).json({
                success: true,
                response,
                message: `${response.length} tags created successfully`
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: this.getErrorMessage(err)
            });
        }
    };
    

    static update: any = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid Id"
                })

            }
            const { slug, name, isPrimary } = req.body

            const updateBody: {
                name?: string,
                isPrimary?: boolean
                slug?: string
            } = {}


            if (name) updateBody.name = name
            if (isPrimary) updateBody.isPrimary = isPrimary
            if (slug) updateBody.slug = slug
            else updateBody.isPrimary = false

            const response = await Tag.findByIdAndUpdate(
                id,
                updateBody,
                {
                    new: true
                }
            )
            return res.status(200).json({ success: true, response, message: "Tag updated successfully" })
        } catch (err) {
            return res.status(500).json({ success: false, error: this.getErrorMessage(err) });
        }
    }

    static delete: any = async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid Id"
                })
            }
            const tagToBeDeleted = await Tag.findById(id);
            if (!tagToBeDeleted) {
                return res.status(400).json({
                    success: false,
                    error: "Tag not found"
                })
            }
            const blogs = tagToBeDeleted?.blogs;

            if (blogs?.length) {
                await Blog.updateMany(
                    { _id: { $in: blogs } },
                    { $pull: { tags: id } }
                );
            }

            await Tag.findByIdAndDelete(id)
            return res.status(200).json({ success: true, message: "Tag deleted successfully" })
        } catch (err) {
            return res.status(500).json({ success: false, error: this.getErrorMessage(err) });
        }
    }
}