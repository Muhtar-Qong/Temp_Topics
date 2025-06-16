# Application Design: FrontGuard

## Overview
This application is a simple, modern Node.js-based web app for monitoring a front door webcam, detecting motion, and capturing screenshots when motion is detected. It uses a combination of Bootstrap and Tailwind CSS for a responsive and visually appealing UI.

## Architecture
- **Backend:** Node.js HTTP server (custom, no frameworks)
  - Serves static files (HTML, JS, CSS)
  - Handles root and static asset requests
- **Frontend:** HTML, JavaScript, Bootstrap, Tailwind CSS
  - Responsive grid layout (Bootstrap)
  - Modern button and font styling (Tailwind)
  - Webcam and motion detection logic in `webcam.js`

## Main Components

### 1. Server
- `server.js` and `serverCore.js`
  - Listens on `localhost:3000`
  - Serves `index.html` and static assets

### 2. User Interface (`index.html`)
- **Header:** App title
  - Modern, colorful gradient using Tailwind (`bg-gradient-to-r from-[#512BD4] via-[#6B21A8] to-[#23A6D5] bg-clip-text text-transparent drop-shadow-2xl`)
  - Responsive, large font for visibility
- **Controls:**
  - Start Webcam
  - Stop Webcam
  - Start Motion Detection
  - Stop Motion Detection
  - Buttons use Tailwind for modern look and clear disabled state (`disabled:bg-*-300 disabled:cursor-not-allowed`)
- **Webcam Feed:**
  - Live video (hidden)
  - Canvas for live feed
  - Below the canvas, a label displays the webcam number (e.g., "Webcam #1")
  - Canvas for change detection
  - Canvas for screenshot at detection
  - Datetime label for last screenshot
- **Styling:**
  - Bootstrap for grid/responsive layout
  - Tailwind for buttons, fonts, gradients, and shadows
  - Prominent drop shadows and color transitions for modern look

### 3. Client Logic (`webcam.js`)
- Handles:
  - Webcam access and streaming
  - Drawing video to canvas
  - Motion detection by comparing frames
  - Displaying change and screenshots
  - Button state management (enabling/disabling)
  - Responsive UI updates
  - DOMContentLoaded event used to ensure all elements are available before attaching event listeners
  - Error logging for missing DOM elements
  - Fixed initialization bug for `screenshotCtx`

## User Flow
1. User opens the app at `http://localhost:3000/`.
2. User clicks "Start Webcam" to begin video stream.
3. User can start/stop motion detection.
4. When motion is detected, a screenshot is captured and timestamped.
5. User can stop the webcam, which disables all controls except "Start Webcam".

## Design Considerations
- **Accessibility:** Buttons are visually and functionally disabled when not available.
- **Responsiveness:** Layout adapts to different screen sizes.
- **Separation of Concerns:** Server, UI, and logic are in separate files.
- **Extensibility:** Easy to add new features (e.g., saving screenshots, notifications).
- **Visuals:**
  - Colorful, modern gradients and shadows for the title
  - Disabled buttons are clearly styled
  - Webcam number is displayed below the feed

## File Structure
- `index.html` — Main UI
- `webcam.js` — Client-side logic
- `server.js` / `serverCore.js` — Node.js server
- `README.md` — Project info
- `App.prompt.md` — Prompt and instructions
- `App.design.md` — (This file)

---
This design file serves as a reference for understanding and extending the application, including all recent style updates and error fixes.
