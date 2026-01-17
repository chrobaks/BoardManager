# BoardManager - Modulares Vanilla JS Management Dashboard

![BoardManager Screenshot](screenshots/Screenshot.png)

BoardManager ist eine leichtgewichtige, komponentenbasierte Web-Anwendung zur Verwaltung von Kategorien und Items. Das Projekt wurde in **Vanilla JavaScript (ES6+)** entwickelt.

## 🚀 Key Features

- **Reines Vanilla JS:** Keine Framework-Abhängigkeiten, volle Kontrolle über den DOM.
- **Event-Driven Architecture:** Kommunikation über einen zentralen Event-Bus (Pub/Sub Pattern).
- **Modulares MVC:** Klare Trennung zwischen Daten (Store), Logik (Controller) und Darstellung (View).
- **Dynamische Formular-Generierung:** Automatisierte Erstellung von UI-Formularen basierend auf JSON-Schemas.
- **Zustandsmanagement:** Zentralisierte Stores mit Daten-Normalisierung und Typsicherheit.
- **Responsives Design:** Integriert mit Bootstrap 5.3 .

---

## 🏗 Architektur & Pattern

Das Projekt folgt einer strengen modularen Struktur:

### 1. Core Layer (`public/js/app/core/`)
Die Basis-Infrastruktur der Anwendung:
- **Api.js:** Automatisierte Komponenten-Initialisierung und Datenimport.
- **Modal & ModalAdapter:** Ein entkoppeltes Modal-System zur Interaktion.
- **Form.js / Dom.js:** Hilfsklassen für DOM-Manipulation und Formular-Serialisierung.

### 2. State Layer (`State/`)
Verwaltet die Datenintegrität:
- **AbstractStore:** Basisklasse für alle Daten-Operationen inklusive eines `schema`-basierten `normalize`-Prozesses, der sicherstellt, dass Daten (z. B. aus dem DOM) korrekt gecastet werden (Strings zu Numbers etc.).

### 3. Controller Layer (`Controller/`)
Die Brücke zwischen View und State:
- **AbstractController:** Enthält die DRY-Logik (Don't Repeat Yourself) für Standard-Aktionen wie `add`, `edit`, `delete` und `modalForm`.
- **Spezifische Controller:** Erben vom AbstractController und implementieren individuelle Geschäftslogik (z. B. Verknüpfung von Items zu Kategorien).

### 4. View Layer (`View/`)
Verantwortlich für das Rendering:
- **BoardView:** Nutzt HTML-Templates (`<template>`), um Daten effizient und reaktiv im UI darzustellen.

---

## 🛠 Installation & Lokale Entwicklung

### Voraussetzungen
Da das Projekt ES-Module verwendet, wird ein lokaler Webserver benötigt (Sicherheitsrichtlinien für `file://` Protokoll verhindern das Laden von Modulen).

### Schritt-für-Schritt Anleitung

1. **Repository klonen:**
   ```bash
   git clone https://github.com/DEIN_USERNAME/BoardManager.git
   cd BoardManager
   ```

2. **Webserver starten:**
   Du kannst jeden beliebigen Webserver nutzen. Hier sind einige Beispiele:

    - **PHP (eingebaut):**
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

3. **Browser öffnen:**
   Rufe `http://localhost:8000` auf.

---

## 📂 Projektstruktur

```text
BoardManager/
├── public/
│   ├── js/
│   │   ├── app/
│   │   │   ├── component/
│   │   │   │   └── BoardManager/      # Hauptkomponente
│   │   │   │       ├── Controller/    # Business Logik
│   │   │   │       ├── State/         # Data Stores
│   │   │   │       ├── View/          # UI Rendering
│   │   │   │       └── Service/       # Hilfsdienste (Events, IDs)
│   │   │   ├── core/                  # Basis-Framework
│   │   │   └── App.js                 # Einstiegspunkt
│   ├── css/                           # Styling (App & Bootstrap)
│   └── data/                          # JSON-Datenquellen
├── index.php                          # Einstiegsseite mit HTML-Templates
└── README.md
```