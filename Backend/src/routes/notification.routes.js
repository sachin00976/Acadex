import express from "express";
import { getNotifications, markNotificationsAsRead } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/commonAuth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getNotifications);

router.route("/read").put(markNotificationsAsRead);

export { router };