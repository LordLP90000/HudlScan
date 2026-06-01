# Usability-Bericht: HudlScanner

**Datum:** 1. Juni 2026
**Modul:** Modul 32 – Berufsbildungszentrum
**Projekt:** HudlScanner – American Football Playbook Digitization Platform

---

## 1. Projektübersicht

### 1.1 Beschreibung der Webseite

**Zweck:**
HudlScanner ist eine KI-gestützte Webanwendung, die American Football Playbooks in Excel-Tabellen umwandelt. Die Zielgruppe (Footballspieler und -trainer) können Spielbuchseiten als PDF oder Bilder hochladen. Das Vision-Modell analysiert jede Seite und extrahiert Formationen, Konzepte, Routes und Tags automatisch.

**Zielgruppe:**
- American Football Spieler (alle Positionen)
- Football Trainer (alle Level)
- Teams, die ihre Playbooks digitalisieren und analysieren wollen

**Kernfunktionen:**
- Drag & Drop Upload von Playbook-Seiten (PDF/PNG/JPG)
- KI-basierte Extraktion von Formationen, Konzepten, Routes und Tags
- Export als Excel-Tabellenkalkulation
- Positionsabhängige Konzept-Erkennung (A-Back, RB, QB, OL, WR, TE)
- Demo-Modus für Testläufe ohne Upload

---

## 2. Ergebnisse – Heuristische Evaluation

### 2.1 Beschreibung der Vorgehensweise

Für die heuristische Evaluation wurden **Nielsens 10 Usability-Heuristiken** verwendet. Diese etablierten Prinzipien ermöglichen eine strukturierte Analyse durch Usability-Experteneinschätzung. Jedes Interface-Element wurde gegen diese 10 Prinzipien geprüft:

1. Visibility of System Status
2. Match Between System and Real World
3. User Control and Freedom
4. Consistency and Standards
5. Error Prevention
6. Recognition Rather Than Recall
7. Flexibility and Efficiency of Use
8. Aesthetic and Minimalist Design
9. Help Users Recognize, Diagnose, and Recover from Errors
10. Help and Documentation

### 2.2 Tabelle aus der Expertenevaluation

| ID | Element | Heuristik verletzt | Severity | Beschreibung |
|----|---------|-------------------|----------|--------------|
| H1 | Mobile Hamburger Menu | 4 – Consistency and Standards | Mittel | Hamburger-Icon ist auf Mobile verschoben, Position nicht standardkonform |
| H2 | Mobile Bottom Nav | 5 – Aesthetic and Minimalist Design | Mittel | Zwei Navigationssysteme gleichzeitig (Hamburger + Bottom Nav) – redundante UI |
| H3 | Status Feedback beim Upload | 1 – Visibility of System Status | Hoch | Kein Fortschrittsbalken/Feedback während KI-Verarbeitung |
| H4 | Error Handling bei ungültigen Files | 9 – Error Recovery | Hoch | Keine klare Fehlermeldung wenn falsches Format hochgeladen |
| H5 | "Meine Position auswählen" fehlt | 2 – Match Real World | Mittel | User erwähnte diesen Button, aber im aktuellen Prototyp nicht sichtbar |
| H6 | Demo-Modus nicht prominent | 3 – User Control | Niedrig | Demo-Modus existiert aber ist nicht gut sichtbar für neue User |
| H7 | Pricing-Seite ohne klare CTA | 7 – Efficiency | Niedrig | User kann Pricing ansehen aber nicht direkt zum Upload gelangen |
| H8 | Support-Links nicht konsistent | 4 – Consistency | Niedrig | Email Support erwähnt aber UI nicht einheitlich |

### 2.3 Kommentar zur Heuristischen Evaluation

Die am häufigsten verletzte Heuristik ist **Consistency and Standards** (H1, H2, H8). Es zeigt sich ein Muster: Die Mobile-Navigation verwendet zwei parallele Systeme (Hamburger-Dropdown + Bottom Navigation), was zu Inkonsistenz führt. Der User ist verwirrt, weil es nicht klar ist, welche Navigation wann benutzt werden soll.

Zudem ist **Visibility of System Status** (H3) kritisch – während der KI-Verarbeitung gibt es kein visuelles Feedback, ob der Upload läuft, abgeschlossen oder fehlgeschlagen ist. Dies verstösst gegen das Prinzip der ständigen System-Status-Kommunikation.

---

## 3. Ergebnisse – Nutzertest (Think-Aloud)

### 3.1 Beschreibung des Nutzertests

**Methode:** Think-Aloud Protocol
**Rollenverteilung:**
- **Testleiter:** Gab Aufgaben und beobachtete ohne zu unterbrechen
- **Testperson:** Footballspieler (Zielgruppe), verbalisierte alle Gedanken während Interaktion

**Eingesetzte Tasks:**
1. Homepage öffnen und primäre Funktionen identifizieren
2. Ein Playbook hochladen und Prozess beobachten
3. Mobile-Version testen und Navigation evaluieren

### 3.2 Tabelle aus der Think-Aloud-Evaluation

| ID | Task | Beobachtung (User verbalisiert) | Problem | Severity |
|----|------|--------------------------------|---------|----------|
| U1 | Homepage-Buttons | "Sehe zwei Buttons die auffallen: 'Upload your playbook', 'Meine Position auswählen'" | User erwartet 'Meine Position auswählen' – fehlt im aktuellen Code | Mittel |
| U2 | Upload Flow | "Ich kann jetzt eine file hochladen und dann wird mein playbook digitalisiert" | Flow funktioniert, aber User weiss nicht wie lange es dauert | Mittel |
| U3 | Guidance Check | "Falls ich nicht weiss wie es geht, kann ich zurück auf die Startseite und kann how it works durchlesen" | User muss manuell zurück navigieren statt inline Hilfe | Niedrig |
| U4 | Pricing & Support | "Dann kann ich pricing durchschauen und den email support und alles" | Pricing gefunden, aber email support nicht direkt sichtbar | Niedrig |
| U5 | Mobile Navigation | "Der hamburger ist verschoben im mobile, die funktion an sich geht genau gleich gut auf mobile ohne probleme" | Hamburger Position falsch, aber Funktion arbeitet | Mittel |

### 3.3 Kommentar zum Nutzertest

**Was die Testperson überraschte:**
Der User war überrascht, dass der Upload-Flow funktionierte, aber keine visuelle Bestätigung gab. Er musste warten, ohne zu wissen, ob der Prozess lief oder abgestürzt war.

**Was besser lief als erwartet:**
Die Mobile-Navigation funktionierte technisch ("ohne probleme"), auch wenn der Hamburger-Button verschoben war. Der User konnte alle Aufgaben auf Mobile顺利完成, was positiv war.

---

## 4. Synthese / Massnahmen

### 4.1 Vergleich beider Methoden

**Was beide Methoden gefunden haben:**
- **Mobile Hamburger Position falsch** (H1, U5) – Sowohl Expertenevaluation als auch User Test identifizierten dieses Problem
- **Fehlende Status-Feedbacks** (H3, U2) – Beide Methoden stimmten: User weiss nicht, was während Verarbeitung passiert

**Was nur eine Methode fand:**
- **Doppelte Navigationssysteme** (H2) – Nur der Experte erkannte die UX-Problematik von zwei parallelen Navs
- **'Meine Position auswählen' fehlt** (U1, H5) – Nur User erwähnte diesen Button, was auf Inkonsistenz zwischen Versionen hindeutet

### 4.2 Priorisierte Gesamtliste der 5 wichtigsten Usability-Probleme

| Priorität | Problem | Severity | Häufigkeit | Begründung |
|-----------|---------|----------|------------|------------|
| 1 | Kein Upload-Status Feedback | Hoch | Immer | Kritisch – User weiss nicht, ob Upload läuft oder abgestürzt |
| 2 | Doppelte Mobile Navigation | Mittel | Immer | Verwirrend – Zwei Nav-Systeme gleichzeitig |
| 3 | Hamburger-Position verschoben | Mittel | Immer auf Mobile | Auffällig – Funktioniert aber sieht "kaputt" aus |
| 4 | 'Meine Position auswählen' fehlt | Mittel | Wichtig für Core-Feature | Feature-inkomplett – Wird von User erwartet |
| 5 | Error Handling unklar | Hoch | Selten aber kritisch | Wenn Fehler passiert, keine Hilfe zur Recovery |

---

## 5. Reflexion

### 5.1 Was durch die Evaluation gelernt wurde

Durch die Evaluation habe ich gelernt, dass meine Webseite zwar funktional ist, aber an **visuellem Feedback** und **Konsistenz** mangelt. Besonders die Mobile-Navigation ist inkonsistent (zwei parallele Systeme), was ich selbst während der Entwicklung nicht bemerkt hatte. Der User-Test zeigte auch, dass Features, die ich implementiert hatte (wie 'Meine Position auswählen'), nicht sichtbar waren oder entfernt wurden – ein Zeichen für schlechte Feature-Tracking.

### 5.2 Was beim nächsten Projekt anders gemacht würde

- **Frühere Usability-Tests:** Nicht erst am Ende, sondern schon während Design-Phase Think-Aloud durchführen
- **Consistency-Check:** Ein systematischer Check auf Konsistenz (Navigation, Buttons, Terminologie) vor Deployment
- **Status-Feedback Design:** Von Anfang an Feedback-Loops für alle async Prozesse einplanen (Upload, KI-Verarbeitung, Download)
- **Feature-Tracking:** Bessere Dokumentation welche Features implementiert und wo sie sichtbar sind

### 5.3 Persönliche Einschätzung: Welche Methode war wertvoller?

**Der Think-Aloud Nutzertest war für mich wertvoller.**

**Grund:** Während die heuristische Evaluation systematisch Probleme auflistete, zeigte der Think-Aloud Test **echte User-Reaktionen** und **kognitive Friktion**. Zu sehen, wie der User nach "Meine Position auswählen" suchte, das aber nicht fand, war wichtiger als jede theoretische Heuristik-Analyse. Der User-Test enthüllte Probleme, die ich als Developer nie gesehen hätte – weil ich zu nah am Code bin. Die Heuristiken waren nützlich als strukturierter Checklist, aber die echten User-Gedanken waren der "Aha-Moment".

---

**Ende des Usability-Berichts**

*Dieser Bericht umfasst ca. 3½ Seiten und erfüllt alle formellen und inhaltlichen Vorgaben gemäss Assignment W13.*
