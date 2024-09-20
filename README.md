# Youtube Extension

## Overview

**Youtube Extension** is a Chrome extension designed to monitor and manage all your YouTube video tabs in one place. It provides a clean interface displaying each tab's video status, title, and thumbnail, allowing you to easily switch between or manage multiple open YouTube tabs.

## Features

- Track all open YouTube tabs in your browser.
- Display video statuses (playing, paused) in real-time.
- View the title and thumbnail of each YouTube video.
- Easily manage, pause, or switch between different YouTube tabs.

## Installation

To install **Youtube Extension** and get it running locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/Lmonk/yt-extension-2.git
```

2. Navigate to the project directory:

```sh
cd yt-extension-2
```

3. Install dependencies:

```sh
npm install
```

## Building the Extension

After installation, you need to build the project before adding it to Chrome:

```sh
npm run build
```

This will create the dist directory, which contains the compiled extension files.

## Adding the Extension to Chrome

To use the extension in Chrome:

1. Open Chrome and navigate to chrome://extensions/.
2. Enable Developer mode by toggling the switch in the top-right corner.
3. Click Load unpacked and select the dist directory from the root of the cloned project.
4. The extension will now appear in your Chrome extensions bar.

## Usage

Once the extension is installed:

1. Click on the extension icon in the toolbar.
2. A popup will display all currently open YouTube tabs.
3. Use the interface to manage or view each video’s status (e.g., play, pause).
4. Easily navigate between your open YouTube tabs using the provided thumbnails and titles.
