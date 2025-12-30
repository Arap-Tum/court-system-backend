// services/teamsBot.service.js
import { chromium } from "playwright";

export async function joinTeamsMeeting({ meetingLink, displayName }) {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Open meeting link
  await page.goto(meetingLink, { waitUntil: "networkidle" });

  // Click "Continue on this browser"
  await page.getByText("Continue on this browser").click();

  // Enter name
  await page.fill('input[placeholder="Type your name"]', displayName);

  // Turn off camera & mic (selectors may change)
  await page.click('[aria-label="Turn camera off"]');
  await page.click('[aria-label="Mute microphone"]');

  // Join meeting
  await page.getByText("Join now").click();

  return {
    status: "joined",
    name: displayName,
  };
}
