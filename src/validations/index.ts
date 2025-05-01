import {z} from "zod"
import mongoose from "mongoose";


export class Validators{

  static signIn=z.object({
    body:z.object({
      email:z.string({required_error:"Email is required"}).email("Invalid email format"),
      password:z.string({required_error:"Password is required"})
    }).strict(),
    params:z.object({}).strict(),
    query:z.object({}).strict()
  })

  static signUp=z.object({
    body:z.object({
      name:z.string({required_error:"Name is required"}),
      userName:z.string({required_error:"User Name is required"}),
      email:z.string({required_error:"Email is required"}).email("Invalid email format"),
      password:z.string({required_error:"Password is required"})
    }).strict(),
    params:z.object({}).strict(),
    query:z.object({}).strict()
  })

  static objectIdValidator = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

  static createBlogSchema = z.object({
  body: z
    .object({
      title: z.string({ required_error: "Title is required" }),
      description: z.string().optional(),
      slug: z
        .string({ required_error: "Slug is required" })
        .regex(/^[a-z-]+$/, {
          message:
            "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters",
        }),
      featuredImage: z.string().url().optional(),
      content: z.string({ required_error: "Content is required" }),
      status: z.enum(["draft", "published"]).optional(),
      isFeatured: z.boolean().optional(),
      tags: z.array(z.any()).optional(),
      authors: z.array(z.any()).optional(),
    })
    .strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

static updateBlogSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      slug: z
        .string()
        .regex(/^[a-z-]+$/, {
          message:
            "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters",
        })
        .optional(),
      featuredImage: z.string().url().optional(),
      content: z.string().optional(),
      status: z.enum(["draft", "published"]).optional(),
      isFeatured: z.boolean().optional(),
      tags: z.array(this.objectIdValidator).optional(),
      authors: z.array(this.objectIdValidator).optional(),
    })
    .strict(),
  params: z
    .object({
      id: this.objectIdValidator,
    })
    .strict(),
  query: z.object({}).strict(),
});

static createCommentSchema = z.object({
  body: z.object({
    content: z.string({ required_error: "Comment content is required" }),
    subComment: z.string().optional(),
  }).strict(),
  params: z.object({
    blogId: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static updateCommentSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    subComment: z.string().optional(),
  }).strict(),
  params: z.object({
    commentId: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static deleteCommentSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    commentId: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static getBlogByIdSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static getBlogBySlugSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    slug: z.string().regex(/^[a-z-]+$/, {
      message: "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters",
    }),
  }).strict(),
  query: z.object({}).strict(),
});

static deleteBlogSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static likeSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    blogId: this.objectIdValidator,
    inc: z.enum(['1', '-1']),
  }).strict(),
  query: z.object({}).strict(),
});

// Image Route Validators
static uploadImageSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Image title is required" }),
    altText: z.string({ required_error: "Image alt text is required" }),
  }).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

static updateImageSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Image title is required" }),
    altText: z.string({ required_error: "Image alt text is required" }),
  }).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static deleteImagesSchema = z.object({
  body: z.object({
    idArray: z.array(this.objectIdValidator, { required_error: "Image IDs are required" }),
  }).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

// Tag Route Validators
static createTagSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Tag name is required" }),
    slug: z.string({ required_error: "Tag slug is required" })
      .regex(/^[a-z-]+$/, {
        message: "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters",
      }),
    isPrimary: z.boolean().optional(),
  }).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

static updateTagSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string()
      .regex(/^[a-z-]+$/, {
        message: "Slug can only contain lowercase letters and hyphens (-), no spaces or special characters",
      })
      .optional(),
    isPrimary: z.boolean().optional(),
  }).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

// User Route Validators
static updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    userName: z.string()
      .regex(/^[^:,;.()\[\]{}]+$/, {
        message: "Username cannot contain special characters like :,;.()[]{}",
      })
      .optional(),
    email: z.string().email("Invalid email format").optional(),
  }).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

static getUserByIdSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

static getUserTypeSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    type: z.string({ required_error: "User type is required" }),
  }).strict(),
  query: z.object({}).strict(),
});

// WaitList Route Validators
static createWaitListSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    message: z.string({ required_error: "Message is required" }),
  }).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

static deleteWaitListSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({
    id: this.objectIdValidator,
  }).strict(),
  query: z.object({}).strict(),
});

}