import { Router } from "express";
import express from "express";
import multer from "multer";
import path from "path";
// import User from "../models/user.model.js";
import { signup, login, verifyToken, getProtected } from "../controllers/signupController.js";
import {
  getAdmin,
  postRuleByAdmin,
  getAllUsersByAdmin,
  getAllRulesByAdmin,
  getAllExercisesByAdmin,
  getSingleDataByIdViaAdmin,
  putUsersByIdViaAdmin,
  putRulesByIdViaAdmin,
  putExercisesByIdViaAdmin,
  deleteSingleDataByIdViaAdmin,
} from "../controllers/adminController.js";
import {
  postExerciseByTrainer,
  getAllUsersByTrainer,
  getAllRulesByTrainer,
  getAllExercisesByTrainer,
  getSingleDataByIdViaTrainer,
  updateExerciseByIdViaTrainer,
  updateProfileByIdViaTrainer,
} from "../controllers/trainerController.js";
import {
  getAllRulesByUser,
  getAllExercisesByUser,
  getUserProfileById,
  uploadProfilePictureByUser,
  updateUserProfileById,
} from "../controllers/userController.js";

import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isTrainer } from "../middleware/isTrainer.js";

const router = Router();
const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
		cb(null, "upload/images/")
	},
  filename: function(req, file, cb) {
		const splitFileName = file.originalname.split(".");
		const extension = splitFileName[splitFileName.length - 1];
		const filename = `${crypto.randomUUID()}.${extension}`;
		cb(null, filename);
	},
});

app.use("/profile", express.static("upload/images"));

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});

// General Section
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyToken);
router.get("/protected", isAuth, getProtected);
// Admin Section*********************************************************************
router.get("/admin", isAuth, isAdmin, getAdmin);
router.post("/rule/admin", isAuth, isAdmin, postRuleByAdmin);
router.get("/users/admin", isAuth, isAdmin, getAllUsersByAdmin);
router.get("/rules/admin", isAuth, isAdmin, getAllRulesByAdmin);
router.get("/exercises/admin", isAuth, isAdmin, getAllExercisesByAdmin);
router.get("/single/data/admin/:id", isAuth, isAdmin, getSingleDataByIdViaAdmin);
router.put("/users/admin/:id", isAuth, isAdmin, putUsersByIdViaAdmin);
router.put("/rules/admin/:id", isAuth, isAdmin, putRulesByIdViaAdmin);
router.put("/exercises/admin/:id", isAuth, isAdmin, putExercisesByIdViaAdmin);
router.delete("/single/data/admin/:id", isAuth, isAdmin, deleteSingleDataByIdViaAdmin);
// Trainer Section******************************************************************
router.post("/exercise/trainer", isAuth, isTrainer, postExerciseByTrainer);
router.get("/users/trainer", isAuth, isTrainer, getAllUsersByTrainer);
router.get("/rules/trainer", isAuth, isTrainer, getAllRulesByTrainer);
router.get("/exercises/trainer",isAuth, isTrainer, getAllExercisesByTrainer);
router.get("/single/data/trainer/:id", isAuth, isTrainer, getSingleDataByIdViaTrainer);
router.put("/exercise/trainer/:id", isAuth, isTrainer, updateExerciseByIdViaTrainer);
router.put("/profile/trainer/:id", isAuth, isTrainer, updateProfileByIdViaTrainer);
// User Section*********************************************************************
router.get("/rules/user", isAuth, getAllRulesByUser);
router.get("/exercises/user", isAuth, getAllExercisesByUser);
router.get("/profile/user/:id", isAuth, getUserProfileById);
router.put("/upload", isAuth, upload.single("profile"),uploadProfilePictureByUser);
router.put("/profile/user/:id", isAuth, updateUserProfileById);

export default router;
