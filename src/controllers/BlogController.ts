// src/controllers/blogController.ts
import { Request, Response } from "express";
import { Blog, Comment, POST_STATUS, Tag, USER_ROLE, User } from "../models/schema";
import mongoose from "mongoose";

// Utility to handle error type
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// GET all blogs ranked on the bais of like count with pagination, sorting, and filtering
export const getBlogs: any = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      search?: string;
    };
    const filter = search
      ? { title: { $regex: search, $options: "i" }, isDeleted: false }
      : { isDeleted: false, status: POST_STATUS.PUBLISHED };

    const blogs = await Blog.find(filter)
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("tags authors");

    const total = await Blog.countDocuments(filter);
    return res.status(200).json({
      success: true,
      response: {
        blogs,
        total,
        message: "Blogs fetched successfully",
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(err),
      message: "Error while fetching the authors",
    });
  }
};

// GET all blogs with pagination, sorting, and filtering
export const getBlogsByRank: any = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      search?: string;
    };
    const filter = search
      ? { title: { $regex: search, $options: "i" }, isDeleted: false }
      : { isDeleted: false, status: POST_STATUS.PUBLISHED };

    const blogs = await Blog.find(filter)
      .sort({ likeCount: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("tags authors");

    const total = await Blog.countDocuments(filter);
    return res.status(200).json({
      success: true,
      response: {
        blogs,
        total,
        message: "Blogs fetched successfully",
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(err),
      message: "Error while fetching the authors",
    });
  }
};

export const getBlogType: any = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      search?: string;
    };
    const { type } = req.params;
    const postType: any = {};
    if (type === POST_STATUS.PUBLISHED || type === POST_STATUS.DRAFT) {
      postType.status = type;
    } else if (type === "featured") {
      postType.isFeatured = true;
    }
    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : postType;

    const blogs = await Blog.find(filter)
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("tags authors");

    const total = await Blog.countDocuments(filter);
    return res.status(200).json({
      success: true,
      response: {
        blogs,
        total,
        message: `Blogs fetched successfully of type ${type}`,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching blogs",
        error: getErrorMessage(err),
      });
  }
};

export const getFeaturedBlogs: any = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      search?: string;
    };
    const filter = {
      isFeatured: true,
      isDeleted: false,
      status: POST_STATUS.PUBLISHED,
    };

    const blogs = await Blog.find(filter)
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("tags authors");

    const total = await Blog.countDocuments(filter);

    return res.status(200).json({
      success: true,
      response: {
        blogs,
        total,
        message: "Featured blog fetched successfully",
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "Error fetching blogs",
        error: getErrorMessage(err),
        success: false,
      });
  }
};

export const getListiclesBlogs: any = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      search?: string;
    };
    const filter = {
      isListicles: true,
      isDeleted: false,
      status: POST_STATUS.PUBLISHED,
    };

    const blogs = await Blog.find(filter)
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("tags authors");
    console.log("blogs", blogs);

    const total = await Blog.countDocuments(filter);

    return res.status(200).json({
      success: true,
      response: {
        blogs,
        total,
        message: "Featured blog fetched successfully",
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "Error fetching blogs",
        error: getErrorMessage(err),
        success: false,
      });
  }
};

// GET a single blog by ID
export const getBlogById: any = async (req: any, res: Response) => {
  try {
    const response = await Blog.findById(req.params.id).populate(
      "tags authors"
    );
    if (
      !response ||
      ((response.isDeleted || response.status === POST_STATUS.DRAFT) &&
        req.userRole === USER_ROLE.USER)
    ) {
      return res.status(404).send({
          success: false,
          error: "Blog not found",
          message: "Blog of given id not found",
        });
    }
    return res.status(200).send({
        success: true,
        response,
        message: "Blog fetched successfully of given type",
      });
  } catch (err) {
    return res.status(500).send({
        success: false,
        error: getErrorMessage(err),
        message: "Error while fetching the blog",
      });
  }
};

export const getBlogBySlug: any = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const response = await Blog.find({ slug: slug }).populate("tags authors");
    if (!response || response[0].isDeleted) {
      return res
        .status(404)
        .json({
          success: false,
          error: "Blog not found",
          message: "Blog of given id not found",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        response,
        message: "Blog fetched successfully of given type",
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        error: getErrorMessage(err),
        message: "Error while fetching the blog",
      });
  }
};

// POST a new blog
export const createBlog: any = async (req: any, res: any) => {
  try {
    const userId=req["user"]["userId"]
    if(!userId)
      return res.status(400).send({status:false,message:"Invalid User"})

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const data = req.body;
    const newBlog = new Blog(data);
    await newBlog.save();
    const id = newBlog._id;

    const tags = req.body.tags;
    const authors = req.body.authors;

    const tagsId = tags?.map((tag: any) => tag._id);
    const authorsId = authors?.map((author: any) => author._id);

    if (tagsId && tagsId.length > 0) {
      const addTagsInfo = await Tag.updateMany(
        { _id: { $in: tagsId } },
        { $push: { blogs: id } }
      );
    }
    if (authorsId && authorsId.length > 0) {
      const addAuthorsInfo = await User.updateMany(
        { _id: { $in: authorsId } },
        { $push: { blogs: id } }
      );
    }
    const response = await Blog.findById(id).populate("tags authors");

    return res.status(200).json({ success: true, response, message: "Blog created successfully" });
  } catch (err) {
    return res.status(500)
      .json({ success: false, error: getErrorMessage(err) });
  }
};

// PUT (Update) a blog
export const updateBlog: any = async (req: any, res: any) => {
  try {

    const userId=req["user"]["userId"]
    if(!userId)
      return res.status(400).send({status:false,message:"Invalid User"})

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const { id } = req.params;



    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid Blog ID: ${id}` });
    }
    const response = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("tags authors");

    if (!response) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const tags = req.body.tags || [];

    const authors = req.body.authors || [];

    console.log(tags,'tags')
    if (tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tags } },
        { $addToSet: { blogs: id } }
      );

      await Blog.findByIdAndUpdate(id, { $addToSet: { tags: { $each: tags } } });
    }

    if (authors.length > 0) {
      await User.updateMany(
        { _id: { $in: authors } },
        { $addToSet: { blogs: id } }
      );

      await Blog.findByIdAndUpdate(id, { $addToSet: { authors: { $each: authors } } });
    }
    const finalResponse = await Blog.findById(id).populate("tags authors");
    return res.status(200).json({ success: true, finalResponse, message: "Blog updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: getErrorMessage(err) });
  }
};

// DELETE (Soft delete) a blog
export const deleteBlog: any = async (req: Request, res: Response) => {
  try {
    const response = await Blog.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    return res
      .status(200)
      .json({ success: true, response, message: "Blog deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: getErrorMessage(err) });
  }
};

// DELETE (Permanent delete) a blog
export const permanentDeleteBlog: any = async (req: Request, res: Response) => {
  try {
    const response = await Blog.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    return res
      .status(200)
      .json({ success: true, response, message: "Blog deleted permanelty" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: getErrorMessage(err) });
  }
};

// like api

export const likeRoute: any = async (req: Request, res: Response) => {
  try {
    const { blogId, inc } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, error: `Invalid Blog ID: ${blogId}` });
    }

    if (inc !== "1" && inc !== "-1") {
      return res
        .status(400)
        .json({ success: false, error: `Invalid inc: ${inc}` });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const increment = parseInt(inc, 10);
    const newLikeCount = blog.likeCount + increment;
    console.log("new>>>", newLikeCount, blog.likeCount, increment);

    if (newLikeCount < 0) {
      return res
        .status(400)
        .json({ success: false, error: "Like count cannot be negative" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likeCount: increment } },
      { new: true }
    );

    return res
      .status(200)
      .json({
        success: true,
        response: updatedBlog,
        message: "Like count updated successfully",
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: getErrorMessage(err) });
  }
};


export const createComment = async (req: any, res: any) => {
  try {
    const userId = req["user"]["userId"];
    const { blogId } = req.params;
    const data = req.body;

    console.log(data,"data")
    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = await Comment.create({
      blogId,
      userId,
      ...data
    });

    return res.status(201).json({ success: true, data: comment, message: 'Comment added' });
  } catch (err) {
    return res.status(500).json({ success: false, error: getErrorMessage(err) });
  }
};

export const getCommentsByBlogId:any = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId, isDeleted: false }).populate('userId', 'name userName');

    return res.status(200).json({ success: true, data: comments });
  } catch (err) {
    return res.status(500).json({ success: false, error: getErrorMessage(err) });
  }
};

export const updateComment:any = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const data = req.body;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    return res.status(200).json({ success: true, data: comment, message: 'Comment updated' });
  } catch (err) {
    return res.status(500).json({ success: false, error: getErrorMessage(err) });
  }
};

export const deleteComment:any = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndUpdate(commentId, { isDeleted: true }, { new: true });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    return res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: getErrorMessage(err) });
  }
};