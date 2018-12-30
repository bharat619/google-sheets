import express from "express";
import userController from "./controllers/UserController";
const router = express.Router();

router.get("/", userController.fetchAllStudent);
router.get("/student/:id", userController.getStudent);
router.post("/edit/:id", userController.editStudent);

export default router;
