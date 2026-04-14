# JIT Campus Navigator

## Project Report

### Submitted By
Bhavana M J
Naveen Reddy
Neppalli Divish Kumar
Lalitha R
Manoj Kumar
Mehaboob S

Raksha R Nadig

### Project Title
JIT Campus Navigator

### Domain
Interactive Campus Navigation System

### Technology Stack
React, Vite, Tailwind CSS, HTML, CSS, JavaScript, SVG

### Purpose
This project was developed as a campus navigation interface for viewing building floors and exploring floor maps in a responsive, interactive way. The application is designed to help users switch between blocks and floors while maintaining a smooth map experience on both desktop and mobile devices.

## 1. Abstract

JIT Campus Navigator is a React-based web application that provides a clean and interactive campus map experience. The system allows users to select a campus block, switch between floors, zoom in and out, pan the map, and view floor layouts in a responsive full-screen interface.

The project focuses on usability, visual clarity, and stable map interaction. It solves common issues found in map viewers such as drifting during zoom, misalignment after floor changes, and content being hidden behind the header on smaller screens.

## 2. Introduction

Campus navigation is an important part of improving accessibility and reducing confusion for students, staff, and visitors. In large educational institutions, users often need a quick way to understand where rooms, staircases, lift areas, and departments are located.

This application was built to present floor maps in a modern digital format. Instead of using a static image viewer, the app supports dynamic controls and a layout structure that adapts to screen size.

## 3. Problem Statement

Traditional campus floor maps are often difficult to use on mobile devices because of the following issues:

- Maps are displayed without proper screen-fit handling.
- Zooming causes unwanted drift.
- Floor changes reuse previous transform values.
- The header can overlap the map area on mobile screens.
- Important map sections may become hidden behind UI elements.

This project addresses these problems by creating a stable layout system and a controlled map viewport.

## 4. Objectives

The main objectives of the project are:

- To build a responsive campus navigation interface.
- To support multiple blocks and multiple floors.
- To provide smooth zoom and pan interactions.
- To ensure the map always opens centered.
- To reset map state cleanly when switching floors or blocks.
- To prevent the header from overlapping map content on mobile.
- To create a visually polished and easy-to-use UI.

## 5. Scope of the Project

The current version of the application supports:

- Block selection for A Block and B Block.
- Floor selection for Basement, Ground, 1st Floor, 2nd Floor, and 3rd Floor where available.
- Zoom in, zoom out, and fit-to-screen controls.
- Mouse drag support for desktop users.
- Touch pan and pinch zoom support for mobile users.
- A safe layout structure where the header, map, and footer occupy separate regions.

The project is structured so that future features such as room search, pathfinding, or marker-based navigation can be added easily.

## 6. System Design

The application is divided into three major UI areas:

### 6.1 Header Section
The header contains the project title, block switching buttons, and a help button. It remains part of the normal document flow so that it does not overlap the map content.

### 6.2 Map Section
The map section is the main interactive area. It takes the remaining available space between the header and footer and renders the selected floor SVG inside a controlled viewport.

### 6.3 Footer Section
The footer contains floor tabs and block shortcuts. It provides quick navigation without affecting the map layout.

## 7. Implementation Details

### 7.1 Main Application Structure
The core application is implemented in [src/App.jsx](src/App.jsx). It manages:

- block state
- floor state
- loading state
- help panel visibility
- map transform state

### 7.2 Map Interaction Logic
The map viewport uses a controlled transform system to keep pan and zoom behavior stable.

Important implementation decisions:

- Scale is managed separately from pan.
- Zoom updates only the scale value.
- Pan updates only the translation values.
- Floor or block changes trigger a full reset.
- The map is fit to screen again after new SVG content loads.

This architecture prevents drift and avoids stacking incorrect transforms across interactions.

### 7.3 Responsive Layout
The layout is handled by the global styles in [src/index.css](src/index.css). The page uses a grid-based shell with three rows:

- auto-sized header
- flexible map region
- auto-sized footer

This ensures the map always uses only the remaining height and never starts behind the header.

### 7.4 SVG Floor Maps
The building floors are rendered as SVG files stored in the public directory. SVG was chosen because it provides crisp scaling, good responsiveness, and lightweight rendering.

## 8. Core Features

### 8.1 Block and Floor Navigation
Users can switch between campus blocks and floors using the header buttons, sidebar, and footer controls.

### 8.2 Centered Map Startup
Each floor map opens in a centered state so the content is immediately visible and balanced on the screen.

### 8.3 Stable Zoom Behavior
Zooming is centered and does not drift toward one side. The map remains visually stable during repeated zoom operations.

### 8.4 Mobile Support
The interface supports touch-based interaction:

- single-finger pan
- pinch zoom
- responsive header and footer spacing
- safe area padding for modern mobile browsers

### 8.5 Floor Reset Behavior
When the user changes the floor or block, the map resets to a clean view rather than reusing the previous zoom or position.

## 9. UI and User Experience

The UI is designed with a modern glass-style appearance to make the application look professional and clean. The interface includes:

- a branded top bar
- floor selector sidebar
- floating map controls
- floor tabs in the footer
- an information badge showing the current block and floor

The design aims to balance aesthetics with usability.

## 10. Technologies Used

### 10.1 React
React is used for building the component-based UI and managing application state.

### 10.2 Vite
Vite provides the development server and production build pipeline.

### 10.3 Tailwind CSS
Tailwind is included for utility-based styling support.

### 10.4 CSS
Custom CSS is used for layout control, glass effects, safe-area handling, and map viewport behavior.

### 10.5 SVG
The floor plans are stored as SVG files for better scalability and rendering clarity.

## 11. Testing and Validation

The application was validated with the following checks:

- Production build completed successfully.
- Dev server starts correctly after dependency adjustments.
- Map zoom logic was refactored to avoid drift.
- Floor switching was tested to ensure transform reset behavior.
- Layout was restructured to prevent header overlap on mobile.

## 12. Challenges Faced

During development, the following issues were identified and fixed:

- zoom drift caused by mixed transform calculations
- floor changes inheriting previous map position
- unwanted Main block references
- mobile layout overlap between the header and map
- inconsistent map alignment after resize and orientation changes

These problems were addressed through layout restructuring and transform separation.

## 13. Outcome

The final outcome is a responsive campus map application that:

- opens in a centered state
- supports smooth zoom and pan interactions
- switches floors without layout corruption
- works on desktop and mobile
- keeps the map fully visible below the header
- presents a cleaner and more professional navigation experience

## 14. Future Enhancements

Possible improvements for later versions include:

- room search and filtering
- route planning between rooms
- clickable location markers
- highlighted lift, stair, and emergency areas
- accessibility improvements for keyboard users
- dark/light theme switching
- offline caching of map assets

## 15. Conclusion

JIT Campus Navigator demonstrates how a modern React application can be used to build a practical and responsive campus mapping interface. The project combines responsive layout design, SVG rendering, and careful transform management to deliver a stable user experience.

The application successfully solves key usability problems related to zoom drift, floor switching, and mobile overlap. It is suitable as an academic project submission and can also serve as a foundation for a larger indoor navigation system.

## 16. Project Structure

- [src/App.jsx](src/App.jsx): Main application logic, floor selection, and map interactions
- [src/index.css](src/index.css): Global layout and styling rules
- [public/](public/): SVG floor maps and static assets
- [package.json](package.json): Project scripts and dependencies

## 17. How to Run the Project

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 18. Author Details

Name: Mehaboob S
Project: JIT Campus Navigator
Institution: College Submission Project

## 19. License

This project is currently intended for academic use and demonstration purposes. A formal open-source license can be added later if required.
