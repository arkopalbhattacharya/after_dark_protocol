# BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Document Control**

- **Project Name:** AFTER_DARK_PROTOCOL_V1.0
- **Document Version:** 1.0.0
- **Date:** 2026-08-20
- **Status:** Approved / Architecture Baseline

## 1. Executive Summary & Project Vision

**AFTER_DARK_PROTOCOL_V1.0** is an offline-first, high-density personal telemetry and journal portal designed around a strict monospace, cyber-noir terminal aesthetic.

The application streamlines the capture of recurring personal metrics—specifically local AI experimentation, specialty coffee brewing, physical walks/mood telemetry, and freeform logs—into structured, searchable records without friction or third-party cloud dependence.

## 2. Business & User Objectives

- **High-Speed Telemetry Capture:** Minimize input friction with context-aware, category-specific data forms accessible in under two clicks.
- **Aesthetic Consistency:** Enforce an uncompromising sci-fi terminal visual language (`JetBrains Mono`/`Fira Code`, dark-mode high contrast, neon telemetry accents).
- **Complete Data Ownership:** Store all entries locally in client-controlled storage with exportable schema-standardized JSON/Markdown structures.
- **Scannable Retrieval:** Provide instant query, category filtering, and raw payload inspection for all historical logs.

## 3. Scope & System Capabilities

### In Scope

- Client-side responsive web portal with custom HUD layout.
- Dynamic logging forms with four distinct schema types: `AI_EXPERIMENT`, `CAFFEINE_LOG`, `ACTIVITY_LOG`, and `FREEFORM_LOG`.
- Local storage persistence (IndexedDB/Local Storage API) with zero mandatory cloud sync.
- Real-time metadata aggregators (Total logs, Category counters, Status readouts).
- Search, multi-category filtering, raw JSON inspection, and Markdown export.

### Out of Scope (Version 1.0)

- Multi-user multi-tenant access control and authentication.
- Cloud database synchronizations (AWS/Firebase).
- Native mobile application wrappers (Android/iOS APKs).

## 4. Functional Requirements

### 4.1 HUD Command Header & Telemetry

- **FR-1.1:** Display active system status indicator (`ONLINE // STANDALONE_NODE`).
- **FR-1.2:** Display live local time in 24-hour UTC/Local monospace readout.
- **FR-1.3:** Provide aggregate telemetry pills showing dynamic count of total committed logs broken down by category.

### 4.2 Dynamic Entry Capture Subsystem

- **FR-2.1:** Dynamic category selector switching between four core operational schemas:
  - **`AI_EXPERIMENT`**: Target Model/Stack, Context/Prompt Objective, Epochs/Loss/Metrics, Outcome Observation, and optional Code/Prompt block.
  - **`CAFFEINE_LOG`**: Bean Origin/Roaster, Brew Method, Verdict Toggle (`[LIKED]` vs `[DISLIKED]`), Acidity/Body notes.
  - **`ACTIVITY_LOG`**: Physical Walk Confirmation (`BOOLEAN [YES / NO]`), Duration (minutes), Route/Location, Post-Walk Mood Scale (`Drained`, `Centered`, `Recharged`, `Euphoric`).
  - **`FREEFORM_LOG`**: Raw monospace text buffer supporting standard syntax and markdown formatting.
- **FR-2.2:** Form validation ensuring timestamp, category, and minimum required fields are present prior to committing.
- **FR-2.3:** Action trigger `[ TRANSMIT_LOG // COMMIT ]` that commits the payload to state and resets the form.

### 4.3 Log Stream & Terminal Archive

- **FR-3.1:** Display chronological descending feed of cards using geometric borders and category-specific status pills.
- **FR-3.2:** Provide real-time instant text search querying title, category, tags, and payload notes.
- **FR-3.3:** Tab-based category filter: `[ALL_LOGS]`, `[AI_LAB]`, `[CAFFEINE]`, `[BIOMETRICS]`, `[FREEFORM]`.
- **FR-3.4:** Dual view toggle per log entry: **HUD Render Mode** vs **Raw JSON Node Mode**.
- **FR-3.5:** Bulk export functionality: `[ EXPORT_PAYLOAD_JSON ]` and `[ EXPORT_MARKDOWN_BUNDLE ]`.

## 5. Non-Functional Requirements

| **Metric / Dimension** | **Specification**                                            |
| ---------------------- | ------------------------------------------------------------ |
| **Typography**         | Strict Monospace (`JetBrains Mono`, `Fira Code`, `Source Code Pro`). No serif or proportional sans-serif allowed. |
| **Color System**       | Deep Void Background (`#0A0D14`, `#1A1A1A`), Electric Cyan (`#00FFFF`), Amber Orange (`#FFBF00`), Terminal Emerald (`#00FF66`). |
| **Latency**            | Sub-16ms UI input latency; instant local persistence on commit. |
| **Data Privacy**       | 100% client-side data isolation. Zero telemetry analytics or external tracking scripts. |
| **Browser Support**    | Modern Chromium-based browsers, Firefox, Safari (desktop and mobile responsive viewport). |

## 6. Data Schema Specifications

Each log entry is committed as a structured JSON document conforming to the following baseline schema:

JSON

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ProtocolLogEntry",
  "type": "object",
  "required": ["id", "timestamp", "category", "title", "payload"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "category": {
      "type": "string",
      "enum": ["AI_EXPERIMENT", "CAFFEINE_LOG", "ACTIVITY_LOG", "FREEFORM_LOG"]
    },
    "title": { "type": "string" },
    "payload": {
      "type": "object",
      "properties": {
        "modelStack": { "type": "string" },
        "experimentNotes": { "type": "string" },
        "beanOrigin": { "type": "string" },
        "brewMethod": { "type": "string" },
        "liked": { "type": "boolean" },
        "flavorProfile": { "type": "string" },
        "walkCompleted": { "type": "boolean" },
        "durationMinutes": { "type": "integer" },
        "postMoodState": { "type": "string" },
        "rawContent": { "type": "string" }
      }
    }
  }
}
```

## 7. User Interface Layout Architecture

- **Top Bar (System HUD):** System identity `AFTER_DARK_PROTOCOL_V1.0`, active clock, metric indicators.
- **Control Bar:** Dynamic search input, filter pills, and `[ + NEW_RECORD ]` trigger.
- **Primary Frame (Split/Collapsible):**
  - **Input Terminal (Top or Left Tray):** Interactive dynamic form adapting to selected category type with clear visual validation bounds.
  - **Data Feed Stream (Main Area):** Monospace HUD cards with structured metadata tags, status pills, and JSON payload inspect toggles.