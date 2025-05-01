
import { Request, Response } from 'express';
import { Blog, Tag, User } from '../models/schema';
import mongoose from 'mongoose';

export class UserController {

    static getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    };

    static get: any = async (req: Request, res: Response) => {
        try {
            const response = await User.find().select('-password');
            return res.status(200).json({ success: true, response, message: "Users fetched successfully" });
        } catch (err) {
            return res.status(500).json({ success: false, error: this.getErrorMessage(err), message: "Error while fetching authors" });
        }
    }
    static getById: any = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const response = await User.findById(id).populate("blogs").select('-password');
            return res.status(200).json({ success: true, response, message: "User fetched successfully" });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: this.getErrorMessage(err),
                message: "Error while fetching author"
            });
        }
    }


    static getUserType: any = async (req: Request, res: Response) => {
        try {
            const { type } = req.params
            const response = await User.find({ type: type }).select('-password');
            if (!response || response.length === 0) {
                return res.status(404).json(
                    {
                        success: false,
                        error: 'User not found',
                        message: "User of given type not found"
                    });
            }
            return res.status(200).json({ success: true, response, message: `${type} fetched successfully` });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: this.getErrorMessage(err),
                message: "Error while fetching Admin"
            });
        }
    }



    static update: any = async (req: any, res: Response) => {
        try {
            const id = req["user"]["userId"]
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid Id",
                    message: "Given id is invalid mongoId"
                })

            }
            const data= req.body
            console.log(data,"data")

            const response = await User.findByIdAndUpdate(
                id,
                {
                    ...data,
                    username:data.userName
                },
                {
                    new: true
                }
            )
            return res.status(200).json({ success: true, response, message: "User details updated successfully" })
        } catch (err) {
            return res.status(500).json({ success: false, error: this.getErrorMessage(err), message: "Error while updating the author" });
        }
    }

    static delete: any = async (req: any, res: Response) => {
        try {
            const id  = req["user"]["userId"];
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid Id",
                    message: "Given id is invalid mongoId"
                })
            }
            const authorToBeDeleted = await User.findById(id);
            if (!authorToBeDeleted) {
                return res.status(400).json({
                    success: false,
                    error: "Author not found",
                    message: "Author not find"
                })
            }
            const blogs = authorToBeDeleted?.blogs;

            if (blogs?.length) {
                await Blog.updateMany(
                    { _id: { $in: blogs } },
                    { $pull: { authors: id } }
                );
            }

            await User.findByIdAndDelete(id)
            return res.status(200).json({ success: true, message: "User deleted successfully" })
        } catch (err) {
            return res.status(500).json({
                success: false, error: this.getErrorMessage(err), message: "Error while deleting the Author"
            });
        }
    }
}