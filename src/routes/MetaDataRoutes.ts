import { Router } from "express";
import { MetaDataController } from "../controllers/MetaDataController";



const router = Router()

router.get("/", MetaDataController.getMetaDataInfo)

export default router;