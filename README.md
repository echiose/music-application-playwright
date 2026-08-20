# Music Application Playwright Tests

Playwright end-to-end tests for a locally served vanilla JavaScript music app, covering authentication, navigation, and album CRUD workflows. Created for the Front-End Technologies Basics course.

## Project Overview

The application provides a simple music catalog experience where users can:

- register and log in
- browse albums
- search albums
- create, edit, and view album details

## Requirements

- Node.js
- npm

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the application server:

   ```bash
   npm run server
   ```

3. In a separate terminal, run the Playwright tests:
   ```bash
   npm test
   ```

## Available Scripts

- `npm run server` - starts the local backend server
- `npm test` - runs the Playwright test suite
- `npm run test:ui` - opens Playwright UI mode
- `npm run test:report` - shows the HTML test report

## Test Structure

Tests are located in the `tests` folder and currently cover:

- authentication flow
- navbar navigation
- CRUD album operations

## Notes

Make sure the app is running on `http://localhost:3000` before executing the tests.
