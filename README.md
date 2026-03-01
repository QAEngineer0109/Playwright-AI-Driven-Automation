🤖 Playwright AI-Driven Automation

A modern Playwright automation framework integrating AI-driven testing concepts with structured, maintainable test architecture. This project demonstrates scalable automation design using Playwright and JavaScript.

Overview

This project includes:

Structured test organization

Dedicated specs and test plans

Modular and reusable test patterns

Clean Playwright configuration

Scalable framework structure for UI and API automation

Project Structure

Playwright-AI-Driven-Automation
│
├── .playwright-mcp/ # Playwright local configuration/cache
├── .vscode/ # Editor configuration (local)
├── specs/ # Spec definitions
├── test-plans/ # Organized test planning files
├── tests/ # Test cases
├── .gitignore # Ignored files and folders
├── package.json # Project dependencies
├── package-lock.json # Dependency lock file
└── playwright.config.js # Playwright configuration

Tech Stack

Playwright

Node.js

JavaScript

npm

Installation

Clone the repository:

git clone https://github.com/QAEngineer0109/Playwright-AI-Driven-Automation.git

Navigate into the project:

cd Playwright-AI-Driven-Automation

Install dependencies:

npm install

Install Playwright browsers:

npx playwright install

Running Tests

Run all tests:

npx playwright test

Run a specific test file:

npx playwright test tests/yourTestFile.spec.js

View Test Report

After execution:

npx playwright show-report

Repository Notes

This repository does NOT include GitHub Actions workflows

No tests run automatically on push

The project is intended for educational and classroom use

Author

QAEngineer0109 – Brett Skiff

License

This project is intended for educational purposes only.
