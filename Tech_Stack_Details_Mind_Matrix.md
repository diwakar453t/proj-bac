# Mind Matrix: Detailed Technology Stack

Mind Matrix is built on a highly modern, enterprise-grade architecture designed for maximum performance, security, and developer velocity. This document outlines the rationale behind every major technology choice.

---

## 1. Frontend: The Presentation Layer

**Framework: React 19 + TypeScript**
*   **Why:** React is the industry standard for component-based UI engineering. The use of React 19 ensures we are leveraging the latest concurrent rendering features.
*   **TypeScript:** Enforces strict type-safety across the application, virtually eliminating runtime errors and ensuring predictable data flow from the API all the way to the UI components.

**Build Tool: Vite 7**
*   **Why:** Unlike older bundlers like Webpack, Vite uses native ES modules to provide near-instantaneous Server Start and Hot Module Replacement (HMR). It highly optimizes the production build output for blazing-fast load times.

**Styling & UI Components: Tailwind CSS v4 + Radix UI**
*   **Why:** Tailwind provides utility-first styling, enabling rapid UI iteration without bloated CSS files or specificity wars. 
*   **Radix UI:** Used for foundational primitives (like accessible modals/dialogs), ensuring our custom components are fully accessible (a11y compliant) without sacrificing design control.

**State Management & Data Fetching: TanStack Query (React Query)**
*   **Why:** Replaces complex Redux boilerplate. It automatically handles data caching, background refetching, pagination, and stale-data management, drastically reducing frontend complexity when interfacing with the FastAPI backend.

**Visuals & Animations: Three.js + Framer Motion**
*   **Three.js (WebGL):** Powers the immersive, interactive 3D particle background and neural network canvases. This elevates the app from a basic form-filler to a premium, futuristic product.
*   **Framer Motion:** Handles seamless, physics-based page transitions and micro-interactions (like hover spring effects on cards and buttons).

**Routing: React Router v7**
*   **Why:** Used for declarative, nested routing. Ensures protected routes (Dashboard, Insights, Settings) are strictly guarded and lazy-loaded only when the user navigates to them, keeping the initial JavaScript bundle small.

---

## 2. Backend: The Application Logic & API

**Framework: FastAPI (Python 3.9+)**
*   **Why:** FastAPI is currently one of the fastest Python frameworks available, matching the performance specifications of NodeJS and Go. 
*   **Native Async:** Handles thousands of concurrent requests smoothly (crucial for real-time AI generation and rapid check-in logging).
*   **AI Readiness:** Because it is built in Python, integrating heavy Machine Learning models (like Hugging Face Transformers, PyTorch, or OpenAI) is native and frictionless compared to Node or Ruby backends.

**Data Validation: Pydantic v2**
*   **Why:** Written in Rust, Pydantic parses and deeply validates all incoming and outgoing JSON data instantly. If a user sends a malformed email or an invalid mood score, Pydantic rejects it before it ever touches our database logic.

**Database Management: SQLAlchemy 2.0 (Async) + SQLite**
*   **Why:** SQLAlchemy 2.0 allows us to use asynchronous database queries, preventing database calls from blocking the event loop.
*   **Current DB:** SQLite is used currently for the MVP (rapid local development). However, because we use SQLAlchemy's ORM, migrating to a massive distributed PostgreSQL or AWS Aurora database in the future requires changing exactly *one line of code* (the connection string).

---

## 3. Security & Authentication

**Authentication Strategy: HTTP-only JWT (JSON Web Tokens)**
*   **Why:** Traditional apps store JWTs in `localStorage`, making them vulnerable to XSS (Cross-Site Scripting) attacks where hackers steal the token. 
*   **The Mind Matrix Secure Approach:** When a user logs in, the backend issues an HTTP-only, Secure Cookie containing the JWT. JavaScript cannot read this cookie, making the app immune to standard XSS token theft.

**Password Security: Bcrypt Hashing**
*   **Why:** Bcrypt incorporates "salting" and an adjustable cost factor, making passwords extremely resistant to rainbow table and brute-force attacks.

**Authorization Layer:**
*   **Role-Based Access Control (RBAC):** The backend employs strict dependency injection decorators. Routes like `/admin` automatically verify if the decoded JWT belongs to a user with the `admin` role, throwing a 403 Forbidden error otherwise.

---

## 4. Artificial Intelligence Architecture

**Current MVP (Phase 1): Heuristic/Rule-Based Engine**
*   The current AI chat uses complex regex parsing and sentiment heuristic mapping to provide immediate, robust responses regarding sleep, mood, and stress without incurring massive cloud compute costs.

**Integration Layer (Phase 2 Ready)**
*   The FastAPI router allows for instantaneous swapping to a Generative LLM. We have structured the `AskAIPage.tsx` frontend so that replacing the internal logic with an API call to the **Hugging Face Inference API** or **OpenAI's streaming API** involves zero changes to the UI layer.
