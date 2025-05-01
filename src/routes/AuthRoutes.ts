import { Router } from "express";
import AuthRouter from "../controllers/AuthController";
import { authenticateUser, validateRequest } from "../middlewares";
import { Validators } from "../validations";

const router = Router();

router.post("/signin",validateRequest(Validators.signIn), AuthRouter.signIn)
router.post("/signup",validateRequest(Validators.signUp) ,AuthRouter.signUp)

export default router;