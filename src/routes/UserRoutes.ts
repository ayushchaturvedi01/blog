import { Router } from "express"
import { UserController } from "../controllers/UserController";
import { authenticateUser, validateRequest } from "../middlewares";
import { Validators } from "../validations";

const userRouter = Router();

userRouter.get("/", UserController.get);
userRouter.get("/:id", validateRequest(Validators.getUserByIdSchema), UserController.getById);
userRouter.get("/type/:type", authenticateUser, validateRequest(Validators.getUserTypeSchema), UserController.getUserType);
userRouter.put("/", authenticateUser, validateRequest(Validators.updateUserSchema), UserController.update);
userRouter.delete("/", authenticateUser, validateRequest(Validators.deleteBlogSchema), UserController.delete);

export default userRouter;