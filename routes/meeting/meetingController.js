// meetingController.js

import { joinTeamsMeeting } from "../../services/teamsBot.service.js";

export const joinMeeting = async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const displayName = "Meeting Bot";

    if (!meetingLink || !displayName) {
      return res.status(400).json({
        error: "meetingLink and displayName are required",
      });
    }

    const result = await joinTeamsMeeting({
      meetingLink,
      displayName,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join meeting" });
  }
};
