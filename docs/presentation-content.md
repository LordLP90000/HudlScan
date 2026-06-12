# Präsentation: HudlScanner Usability Evaluation

**Dauer:** 3-5 Minuten
**Modul:** Modul 32 – Berufsbildungszentrum

---

## Folie 1: Titel

**HudlScanner – Usability Evaluation & Verbesserungen**

American Football Playbook Digitization Platform

---

## Folie 2: Webseite – Zielgruppe & Ziele

### Zielgruppe

- **American Football Spieler** (alle Positionen)
- **Football Trainer** (alle Level)
- Teams, die ihre Playbooks digitalisieren wollen

### Ziele der Zielgruppe

1. **Playbook hochladen** (PDF oder Bilder)
2. **Automatische Extraktion** von Formationen, Konzepten, Routes und Tags
3. **Export als Excel** – sofort einsatzbereit für Analyse und scouting

---

## Folie 3: Grösstes Problem + Verbesserung

### Das Problem: Kein Upload-Status Feedback

**Severity:** Hoch | **Heuristik verletzt:** Visibility of System Status

**User im Think-Aloud Test:**
_"Ich kann jetzt eine file hochladen und dann wird mein playbook digitalisiert"_
– Aber **kein visuelles Feedback** während der KI-Verarbeitung!

User wusste nicht:

- Läuft der Upload noch?
- Ist er abgestürzt?
- Wie lange dauert es noch?

### Die Verbesserung

**Vorher:** Nur "Extracting plays with AI..." ohne Fortschritt

**Nachher:**

- ✓ **Progress Bar** mit Prozentanzeige (0-100%)
- ✓ **Geschätzte Restzeit** (z.B. "~30 seconds remaining")
- ✓ **Detail-Status** für jede verarbeitete Seite

**Technisch:** `uploadProgress` State + `estimatedTimeRemaining` im ProcessingSpinner

---

## Folie 4: Mobile Navigation Fix

### Zusätzliche Verbesserung: Redundante Mobile Navigation

**Problem:**

- Zwei parallele Nav-Systeme (Hamburger Dropdown + Bottom Nav)
- Inkonsistent – verletzt **Consistency and Standards** Heuristik
- User Test: _"Der hamburger ist verschoben im mobile"_

**Lösung:**

- Redundanten Hamburger entfernt
- Einheitliche Bottom Navigation (thumb-friendly)
- Konsistente UX zwischen Desktop und Mobile

---

## Folie 5: Wichtigste Erkenntnis

### Was durch die Usability-Übung gelernt wurde

**Key Insight:** **Der Think-Aloud Nutzertest war wertvoller als die heuristische Evaluation.**

**Warum?**

- Heuristiken sind systematisch, aber theoretisch
- Think-Aloud zeigt **echte kognitive Friktion**
- User suchte nach "Meine Position auswählen" – ein Feature, das ich als Developer vergessen hatte!

**Für das nächste Projekt:**

- ✓ Frühere Usability-Tests (nicht erst am Ende)
- ✓ Consistency-Checks vor Deployment
- ✓ Status-Feedback für alle async Prozesse einplanen
- ✓ Feature-Tracking für bessere Übersicht

---

## Folie 6: Demo / Abschluss

**Prototyp mit Verbesserungen:**

- ✓ Upload-Status Feedback mit Progress Bar
- ✓ Mobile Navigation konsolidiert
- ✓ Bessere UX-Transparenz

**Fazit:** Die Usability-Evaluation hat versteckte Probleme aufgedeckt, die ich als Developer nie gesehen hätte.

**Fragen?**

---

_Ende der Präsentation_
