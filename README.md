# JIT-Campus-Navigator

An interactive campus map navigator built with React, Vite, and Tailwind CSS. This app provides smooth multi-floor navigation for campus blocks with responsive pan and zoom interactions that work on desktop and mobile.

## Overview

JIT-Campus-Navigator is designed to help students, staff, and visitors quickly understand building layouts and switch between floors with a clean and fast user interface.

The current implementation includes:
- Block-based navigation for A Block and B Block
- Multi-floor map viewing (Basement, Ground, 1st, 2nd, and 3rd where available)
- Center-locked zoom controls
- Drag and touch pan support
- Pinch-to-zoom support on mobile
- Floor-switch reset behavior to prevent transform carryover
- Modern glass-style UI for map controls and navigation panels

## Key Features

### Interactive Map Controls
- Zoom in, zoom out, and fit-to-screen actions
- Mouse wheel zoom on desktop
- Double-tap zoom behavior on touch devices
- Smooth drag and touch panning

### Floor and Block Navigation
- Sidebar quick floor selector
- Footer floor tabs for fast switching
- Header block switcher between A and B blocks
- Dynamic location badge showing selected block and floor

### UX and Stability
- Map opens centered by default
- Floor changes reset transform state and fit map cleanly
- Separation of zoom and pan logic to reduce drift
- Responsive layout for desktop and mobile viewport sizes

## Tech Stack

- React
- Vite
- Tailwind CSS
- Plain SVG floor assets

## Project Structure

- src/App.jsx: Main UI, map interaction logic, block and floor controls
- src/index.css: Global styles, map canvas behavior, UI effects
- public/: Floor SVG map assets
- package.json: Scripts and dependencies

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm

### Installation

1. Install dependencies
   npm install

2. Start development server
   npm run dev

3. Build for production
   npm run build

4. Preview production build
   npm run preview

## Usage Guide

1. Select a block from the top navigation (A Block or B Block).
2. Choose a floor from the left sidebar or bottom floor tabs.
3. Use:
   - Plus button for zoom in
   - Minus button for zoom out
   - Target button for fit-to-screen
4. Drag the map to pan.
5. On mobile, pinch to zoom and drag with one finger to pan.

## Current Status

This repository contains a working map navigator prototype with stable center-based zoom and floor reset behavior.

Planned improvements can include:
- Pathfinding between rooms
- Search for rooms, labs, and offices
- Landmark pins and route overlays
- Accessibility enhancements and keyboard-only navigation

## Author

Mehaboob S

## License

This project is currently maintained as an academic and portfolio project. Add a formal license if open-source distribution is intended.
