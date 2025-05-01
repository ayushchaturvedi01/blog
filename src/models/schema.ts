// src/models/Blog.ts
import ImageKit from "imagekit";
import mongoose, { Schema, Document } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export enum POST_STATUS {
  PUBLISHED = "published",
  DRAFT = "draft",
}

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user",
  EDITOR = "editor"
}

export enum USER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive"
}



export interface TagDocument extends Document {
  name: string;
  slug: string;
  isPrimary: boolean;
  blogs: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}


export interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  type: USER_ROLE;
  status: USER_STATUS;
  createdAt: Date;
  blogs: mongoose.Schema.Types.ObjectId[];
}


export interface BlogDocument extends Document {
  title: string;
  description: string;
  slug: string;
  featuredImage: string;
  content: string;
  status: POST_STATUS;
  views: number;
  isFeatured: boolean;
  isListicles: boolean;
  likeCount: number;
  dislikeCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: mongoose.Schema.Types.ObjectId[];
  authors: mongoose.Schema.Types.ObjectId[];
  seoTitle: string;
  seoDescription: string;
  isDeleted: boolean;
}

export interface ImageMediaDocument extends Document {
  url: string;
  title: string;
  altText: string;
  type: MEDIA_TYPE;
  isDeleted?: boolean;
  uploadedAt: Date;
  size: string;
  dimensions: string;
}

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  subComment?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}


const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (tag: string) => /^[^:,;.()\[\]{}]+$/.test(tag),
      message: "Username cannot contain special characters like :,;.()[]{}",
    },
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: "Invalid Email"
    }
  },
  password: {
    type: String,
    required: true,
  },
  // type: {
  //   type: String,
  //   enum: Object.values(USER_ROLE),
  //   default: USER_ROLE.USER
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ]
});



enum MEDIA_TYPE {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
}

const ImageMediaSchema: Schema = new Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(MEDIA_TYPE),
    default: MEDIA_TYPE.IMAGE,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  }
});

const TagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (tag: string) => /^[a-zA-Z0-9-]+$/.test(tag),
      message: "Tags can only contain letters, numbers, and hyphens (-), but no spaces or special characters.",
    }

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ]
});


const BlogSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    slug: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (slug: string) => /^[a-z-]+$/.test(slug),
        message: "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters.",
      },
    },
    featuredImage: { type: String },
    content: { type: String },
    status: { type: String, enum: Object.values(POST_STATUS), default: POST_STATUS.DRAFT },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    // isListicles: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // seoTitle: {
    //   type: String,
    // },
    // seoDescription: {
    //   type: String,
    // },
    isDeleted: { type: Boolean, default: false },
  }
);

const waitListSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: "Invalid Email"
    }
  },
  message : {
    type: String,
    required: true
  },
});

const CommentSchema: Schema<IComment> = new Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    subComment: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);


// Indexing for faster queries
BlogSchema.index({ tags: 1 });
BlogSchema.index({ author: 1 });

// Export Mongoose Models
export const Tag = mongoose.model<TagDocument>("Tag", TagSchema);
export const Blog = mongoose.model<BlogDocument>("Blog", BlogSchema);
export const User = mongoose.model<UserDocument>("User", UserSchema);
export const ImageMedia = mongoose.model<ImageMediaDocument>("ImageMedia", ImageMediaSchema);
export const waitList = mongoose.model("WaitList", waitListSchema);
export const Comment = mongoose.model<IComment>("Comment", CommentSchema);


export const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT || "",
});


