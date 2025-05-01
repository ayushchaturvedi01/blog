import { Router } from "express"
import { TagController } from "../controllers/TagController";
import { authenticateUser, validateRequest } from "../middlewares";
import { Validators } from "../validations";

const router = Router();

router.get("/", TagController.get)
router.get("/:id", TagController.getById)
router.get("/primary/all", TagController.getPrimary)
router.post("/", authenticateUser, validateRequest(Validators.createTagSchema), TagController.create)
router.put("/:id", authenticateUser, validateRequest(Validators.updateTagSchema), TagController.update)
router.delete("/:id", authenticateUser, validateRequest(Validators.deleteBlogSchema), TagController.delete)


export default router