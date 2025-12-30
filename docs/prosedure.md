HIGH-LEVEL SYSTEM IN NODE.JS
Here’s the blueprint for the backend we’re going to build:

1. Teams Meeting Listener (Node.js)
   A Node.js service that automatically joins the Microsoft Teams meeting every morning.
2. Audio Capture + Streaming
   Capture audio from the meeting and stream it to STT (Speech-to-Text).

3. Speech-to-Text
   Use:
    OpenAI Whisper API, OR
    AssemblyAI realtime, OR
    Google STT realtime
   Node.js can handle all these.

4. NLP Processor
   Match extracted text to:
    Case numbers
    Advocate names
    Cause list order

5. Consistency Engine
   Track whether the judge is calling sequentially or randomly.

6. Alerts Engine
   Send:
    WhatsApp alerts
    SMS
    Email
    App notifications
    Websocket notifications

7. REST APIs for your frontend
   You will fetch:
    Current case
    Consistency %
    Upcoming case
    Alerts
   ALL OF THIS = fully doable in Node.js.

APPROACH 1 (BEST): Teams Bot via Microsoft Graph API
This is clean and legal.
You will:

1. Create an Azure App Registration

2. Enable Microsoft Teams Bot permissions

3. Use Node.js SDK:
   npm install @microsoft/microsoft-graph-client
   What it enables:
    Join meeting as bot
    Receive raw audio stream
    Pass audio chunks to your AI service
   This is the ideal long-term.

APPROACH 2 (EASY MVP): Playwright Automation
This is easier for V1.
You create a dedicated MS Teams account, then:
 Use Playwright to open Teams Web
 Auto-login using saved cookies
 Auto-join meeting link
 Capture system audio
You can use a Node package like:
 playwright

 sox or ffmpeg
 node-record-lpcm16 for audio capture
It works TODAY, no approvals needed.

STEP 2 — Real-Time Speech to Text
Recommended: Whisper API (OpenAI)
Example:
import OpenAI from &quot;openai&quot;;
import fs from &quot;fs&quot;;
const openai = new OpenAI();
const transcription = await openai.audio.transcriptions.create({
file: fs.createReadStream(&quot;audio.wav&quot;),
model: &quot;whisper-1&quot;
});
But you need real-time, so you send small chunks every few seconds.
Better option for LIVE:
AssemblyAI Real-Time Streaming
(Easier real-time integration)
const transcriber = new AssemblyAI.RealtimeTranscriber({ token: API_KEY })
transcriber.on(&quot;transcript&quot;, console.log);
Node.js handles this perfectly.

STEP 3 — NLP Case Extractor
After transcription, you run a small NLP function.
Extract case numbers:
function extractCaseNumber(text) {
const regex = /case\s*(number\s*)?(\d+)/i;

const match = text.match(regex);
return match ? parseInt(match[2]) : null;
}
Extract advocate names
Use fuzzy matching against the cause list.
Example:
import Fuse from &quot;fuse.js&quot;;

STEP 4 — Consistency Tracking Engine
Before the session starts:
 Load the cause list from a URL
 Store it like:
const causeList = [
{ number: 1, advocate: &quot;Wanjala&quot;, caseName: &quot;Republic vs John&quot; },
{ number: 2, advocate: &quot;Kilonzo&quot;, caseName: &quot;…&quot; },
];
During session:
const actualOrder = [];
function recordCall(caseNum) {
actualOrder.push(caseNum)
}
Then:
function computeConsistency() {
let score = 0;
for (let i = 0; i &lt; actualOrder.length; i++) {
if (actualOrder[i] === i + 1) score++;
}
return score / actualOrder.length;
}

STEP 5 — Alert Engine
When cases are called:

A. Inconsistency Alert
If deviation &gt; threshold:
if (consistency &lt; 0.60) sendAlert(&quot;Judge is inconsistent&quot;);
B. &quot;Your Turn Soon&quot;
if (currentCase + 2 === myCaseNumber) {
sendAlert(&quot;Your case is coming soon&quot;);
}
C. &quot;Your Case NOW&quot;
if (currentCase === myCaseNumber) {
sendAlert(&quot;Your case is being called NOW&quot;);
}

STEP 6 — REST API FOR YOUR
FRONTEND
You will build these endpoints:
GET /api/current
Get current case info.
GET /api/consistency
Returns judge consistency score.
GET /api/upcoming
Returns next case predicted.
GET /api/alerts
Returns alert history.
POST /api/cause-list
Upload cause list (JSON or CSV).

POST /api/subscribe
Register lawyer’s case number + contacts.

FULL BACKEND TECH STACK
 Node.js (Express or NestJS)
 PostgreSQL (cause list + sessions)
 Redis (optional for real-time)
 Playwright or Teams Bot
 Whisper / AssemblyAI
 Fuse.js (fuzzy matching)
 Twilio / WhatsApp API
 PM2 for running services
