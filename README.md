# AI Utility Widgets

A Chrome extension with a side panel containing a collection of useful widgets with AI integration. The main UI features a 3x2 grid of widgets, including:

- A calculator (toggleable between basic and scientific modes)
- A two-timezone clock with alarm and stopwatch functions
- An online dictionary
- A weather widget
- A currency converter
- A unit converter (metric/imperial)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

4. The extension will appear in your extensions toolbar. Click it to open the side panel with all widgets.

## Tech Stack

- React + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn UI
- Chrome Extension Manifest v3
