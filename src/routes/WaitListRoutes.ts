import Router from "express"
import { WaitListController } from "../controllers/WaitListController"
import { validateRequest } from "../middlewares";
import { Validators } from "../validations";

const waitListRouter = Router()

waitListRouter.post("/", validateRequest(Validators.createWaitListSchema), WaitListController.insertWaitList)
waitListRouter.get("/", WaitListController.getWaitList)
waitListRouter.delete("/:id", validateRequest(Validators.deleteWaitListSchema), WaitListController.deleteWaitList)

export default waitListRouter