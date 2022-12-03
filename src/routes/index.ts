import express from "express";

import authRoute from "./auth";
import defaultRoute from "./default";
import emailRoute from "./emails";
import userRoute from "./user";

const router = express.Router();

router.use("/", defaultRoute);
// import { authMiddleware } from "../middleware";
// router.use("/user", authMiddleware, userRoute);
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/email", emailRoute);

export default router;
