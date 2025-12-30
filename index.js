import express from "express";

import meetingRoutes from "./routes/meeting/meetingRoutes.js";
const app = express();
app.use(express.json());

app.use("/api/meeting", meetingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Teams Bot API running on port ${PORT}`);
});
