# BoardManager - Modular Vanilla JS Management Dashboard

![BoardManager Screenshot](screenshots/Screenshot.png)


BoardManager is a lightweight, component-based web application for managing categories and items. The project is developed using **Vanilla JavaScript (ES6+)**.

## Key Features

- **Pure Vanilla JS:** No framework dependencies, full control over the DOM.
- **Event-Driven Architecture:** Communication via a central Event Bus (Pub/Sub pattern).
- **Modular MVC:** Clear separation between data (Store), logic (Controller), and presentation (View).
- **Dynamic Form Generation:** Automated creation of UI forms based on JSON schemas.
- **State Management:** Centralized stores with data normalization and type safety.
- **Responsive Design:** Integrated with Bootstrap 5.3.
- **Commit System:** Flexible data persistence with support for both real-time updates and manual batch commits.

---

## Data Persistence & Commit System

The BoardManager implements a robust commit system to manage how data changes are sent to the backend. This system provides users with two distinct modes of operation:

### 1. Automatic Commits (Real-time)
When the "Commits automatisch speichern" (Automatic Commits) switch is **enabled**:
- Every data operation (Adding, Updating, or Removing items/categories) is processed immediately.
- The system bypasses the local commit queue and prepares the data for instant backend synchronization.
- Users receive immediate feedback via the message system once the operation is successful.

### 2. Manual Batch Commits
When the "Commits automatisch speichern" switch is **disabled**:
- **Commit Queueing:** All changes are temporarily stored in the `CommitStore`.
- **UI Feedback:** A notification bar (`.commit-ctrl`) appears automatically as soon as there is at least one uncommitted change in the queue.
- **Batch Processing:** Users can continue making multiple changes (e.g., editing several items).
- **Manual Submit:** By clicking "Neuen Commit speichern", all queued changes are sent to the backend in a single batch operation.
- **Queue Management:** Upon successful submission, the `CommitStore` is cleared, and the notification bar is hidden.

### Technical Implementation
- **`CommitStore`:** Acts as a local buffer for pending changes.
- **`CommitController`:** Orchestrates the logic between the UI switch, the store, and the event bus.
- **Event-Driven:** The system uses the central `EventBus` to listen for `commit:add` events emitted by data controllers, ensuring a decoupled architecture.

---

## Architecture & Patterns

The project follows a strict modular structure:

### 1. Core Layer (`public/js/app/core/`)
The application's base infrastructure provides the glue between components:
- **EventBus.js:** A central Pub/Sub system that enables decoupled communication between different modules (e.g., notifying the Store when a Controller action occurs).
- **DomEventManager.js:** A specialized utility for handling DOM events efficiently, ensuring clean event binding and delegation.
- **Api.js:** Automated component initialization and data import logic.
- **Modal & ModalAdapter:** A decoupled modal system for user interaction, abstracting Bootstrap's modal logic.
- **Form.js / Dom.js / Validator.js:** Helper classes for DOM manipulation, form serialization, and input validation.
- **Utils.js:** General purpose utility functions used across the application.

### 2. State Layer (`State/`)
Manages data integrity and persistence:
- **AbstractStore:** Base class for all data operations, including a `schema`-based `normalize` process that ensures data (e.g., from the DOM) is correctly cast (Strings to Numbers, etc.).
- **ItemStore / CategoryStore:** Specific implementations for managing application resources.

### 3. Controller Layer (`Controller/`)
The bridge between View and State:
- **AbstractController:** Contains DRY (Don't Repeat Yourself) logic for standard actions such as `add`, `edit`, `delete`, and `modalForm`.
- **Specific Controllers:** Inherit from AbstractController and implement individual business logic (e.g., linking items to categories).

### 4. View Layer (`View/`)
Responsible for rendering:
- **BoardView:** Utilizes HTML templates (`<template>`) to display data efficiently and reactively in the UI, responding to state changes.

---

## Installation & Local Development

### Prerequisites
Since the project uses ES modules, a local web server is required (security policies for the `file://` protocol prevent modules from loading).

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BoardManager.git
   cd BoardManager
   ```

2. **Start a web server:**
   You can use any web server you prefer. Here are a few examples:

    - **PHP (built-in):**
      ```bash
      php -S localhost:8000
      ```
    - **Python:**
      ```bash
      python3 -m http.server 8000
      ```
    - **Node.js (http-server):**
      ```bash
      npx http-server
      ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`.

---

## Project Structure

```text
BoardManager/
├── public/
│   ├── js/
│   │   ├── app/
│   │   │   ├── component/
│   │   │   │   └── BoardManager/      # Main component
│   │   │   │       ├── Controller/    # Business logic
│   │   │   │       ├── State/         # Data stores
│   │   │   │       ├── View/          # UI rendering
│   │   │   │       ├── Factory/       # UI Component factories
│   │   │   │       └── Service/       # Helper services (IDs, Templates)
│   │   │   ├── core/                  # Base framework (EventBus, DOM, etc.)
│   │   │   └── App.js                 # Entry point
│   ├── css/                           # Styling (App & Bootstrap)
│   └── data/                          # JSON data sources
├── index.html                          # Entry page with HTML templates
└── README.md
```