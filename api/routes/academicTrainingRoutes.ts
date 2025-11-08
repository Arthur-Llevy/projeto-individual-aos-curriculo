import { Router } from "express";
import { academicTrainingController } from "../controllers/academicTrainingController.js";

const router = Router();

router.get("/", academicTrainingController.getAllAcademicTraining);
router.get("/:id", academicTrainingController.getAcademicTrainingById);
router.post("/", academicTrainingController.createNewAcademicTraining);
router.patch("/:id", academicTrainingController.updateAcademicTrainingById);
router.delete("/:id", academicTrainingController.deleteAcademicTrainingById);

export default router;