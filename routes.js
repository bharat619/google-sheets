import express from "express";
import userController from "./controllers/UserController";
const router = express.Router();

router.get("/", userController.fetchAllStudent);

export default router;
