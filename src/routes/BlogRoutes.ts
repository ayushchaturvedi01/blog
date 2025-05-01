// src/routes/blogRoutes.ts
import { Router } from 'express';
import { createBlog, createComment, deleteBlog, deleteComment, getBlogById, getBlogBySlug, getBlogType, getBlogs, getBlogsByRank, getCommentsByBlogId, getFeaturedBlogs, getListiclesBlogs, likeRoute, permanentDeleteBlog, updateBlog, updateComment } from '../controllers/BlogController';
import BlogValidationController from '../controllers/BlogValidationController';
import { authenticateUser, validateRequest } from '../middlewares';
import { Validators } from '../validations';

const router = Router();

router.get('/', getBlogs); 
router.get('/rank/data', getBlogsByRank); 
router.get('/:id', validateRequest(Validators.getBlogByIdSchema), getBlogById); 
router.get('/slug/:slug', validateRequest(Validators.getBlogBySlugSchema), getBlogBySlug); 
router.get('/type/:type', authenticateUser, getBlogType);
router.get('/featured/all', getFeaturedBlogs);
router.post('/', authenticateUser, validateRequest(Validators.createBlogSchema), createBlog);
router.patch('/:id', authenticateUser, validateRequest(Validators.updateBlogSchema), updateBlog);
router.delete('/:id', authenticateUser, validateRequest(Validators.deleteBlogSchema), deleteBlog);
router.delete('/permanent/:id', authenticateUser, validateRequest(Validators.deleteBlogSchema), permanentDeleteBlog);
router.post("/like/:blogId/:inc", validateRequest(Validators.likeSchema), likeRoute);
router.post('/:blogId/comments', authenticateUser, validateRequest(Validators.createCommentSchema), createComment);
router.get('/:blogId/comments', getCommentsByBlogId);
router.patch('/comment/:commentId', authenticateUser, validateRequest(Validators.updateCommentSchema), updateComment);
router.delete('/comment/:commentId', authenticateUser, validateRequest(Validators.deleteCommentSchema), deleteComment); 

export default router;