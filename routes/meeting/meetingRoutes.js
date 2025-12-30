import express from "express";
import { joinMeeting } from "./meetingController";

const router = express.Router();

router.post("/join", joinMeeting);

export default router;
