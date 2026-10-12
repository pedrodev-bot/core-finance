# Multi-Platform Finance Tracker

**Current Phase:** Conception, Requirements Engineering, and MVP Definition.

## Executive Summary
This project is a multi-platform (Web and Mobile) personal finance management application. Its primary goal is to minimize friction in data entry, prioritizing an agile, minimalist User Experience (UX). It features direct expense importing via spreadsheets (Excel) and rapid categorization, eliminating the need for tedious manual forms. The UI is built with internationalization (i18n) in mind, primarily supporting English with full localization for Portuguese.

## Engineering & Architecture Goals
Beyond solving a real-world financial tracking problem, this repository serves as a software engineering laboratory. It is designed to simulate the rigor of production-scale applications. The architecture relies on isolated components/microservices utilizing a polyglot stack:
*   **Data Persistence:** PostgreSQL, ensuring ACID compliance for financial records.
*   **API & Business Logic:** Python (Flask/FastAPI) to handle core RESTful communication and data integration (e.g., spreadsheet parsing).
*   **High-Performance Processing:** An isolated C++ service dedicated to heavy computational tasks, such as complex financial projections or automated categorization algorithms.
*   **Frontend:** Cross-platform framework (React Native or Flutter) to deliver unified Web and Mobile experiences from a single codebase.

The system will be deployed via Cloud infrastructure, fully containerized with Docker, and will feature Continuous Integration (CI), automated testing, and strict code review workflows.

## Development Transparency & AI Usage
This project is engineered entirely by Pedro Lopes. To ensure continuous learning and adhere to industry best practices, an AI (Gemini) is utilized strictly as a Staff/Senior Engineering mentor. The AI provides architectural guidance, code reviews, and acts as a sounding board for design decisions. It is not used to generate the core codebase. This approach guarantees that I, as the developer, am challenged to build the foundation, organize tasks, and apply software engineering principles firsthand.