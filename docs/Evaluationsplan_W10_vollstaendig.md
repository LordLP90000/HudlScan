# W10: Lern- und Arbeitsauftrag – Komplette Lösung

**Projekt:** HudlScanner – Playbook OCR Application
**Datum:** 14. Mai 2026
**Modul:** Modul 322 – Fachbereich Informatik

---

# Teil 1: Diskussionsfrage

## Welche der 10 Heuristiken verletzt der HudlScanner-Prototyp wahrscheinlich am häufigsten – und warum?

### Analyse basierend auf dem aktuellen Prototyp:

| Heuristik | Verletzung? | Begründung |
|-----------|-------------|------------|
| 1. Visibility of system status | ⚠️ Mittel | Upload-Processing zeigt Spinner, aber **keinen Fortschrittsbalken** oder Zeit-Indikator. Bei langsamer Verbindung weiss Nutzer nicht, ob System arbeitet oder hängt. |
| 2. Match between system and real world | ⚠️ Mittel | **"Concept"** ist Football-Fachjargon. Laien verstehen nicht, was gemeint ist. **"Formation"** und **"A-Back Route"** sind klarer, aber auch domain-spezifisch. |
| 3. User control and freedom | ✅ Gering | Zurück-Button vorhanden. Aber **keine "Abbrechen"-Option** während der Verarbeitung. |
| 4. Consistency and standards | ⚠️ Mittel | **Mobile vs Desktop:** Mobile Menü ist Dropdown, Desktop ist inline. Das ist OK (responsive), aber **Styling des Upload-Buttons** unterscheidet sich zwischen beiden. |
| 5. Error prevention | ⚠️ Mittel | Keine Validierung vor Upload (z.B. Dateigrösse). Erst während Upload oder danach erscheint Fehler. |
| 6. Recognition rather than recall | ✅ Gering | Navigation ist sichtbar, keine versteckten Menüs. |
| 7. Flexibility and efficiency of use | ✅ Gering | Keine Shortcuts für Power-User (z.B. "Batch Upload" oder "Drag & Drop" – aber noch nicht gefordert). |
| 8. Aesthetic and minimalist design | ✅ Gering | Design ist clean, kein unnötiges "Chrome". |
| 9. Help users recognize, diagnose, recover from errors | ❌ Hoch | **Wenn OCR fehlschlägt:** Keine Fehlermeldung erklärt WARUM oder wie zu beheben. Nur "Error" – keine Hilfestellung. |
| 10. Help and documentation | ❌ Hoch | **Kein Help-Link, keine FAQ, keine Erklärung** was "Concept" oder "Formation" bedeutet. Für Nicht-Football-Experten nicht verständlich. |

### Fazit:
Die **schwerwiegendsten Verletzungen** sind:
- **Heuristik 9 (Error Recovery):** Keine hilfreichen Fehlermeldungen
- **Heuristik 10 (Help):** Keine Dokumentation für Domain-Begriffe
- **Heuristik 1 (Visibility):** Kein Fortschritts-Feedback während langer OCR-Verarbeitung

---

# Teil 2: Evaluationsplan

## 1. Testziele

Dieser Test soll folgende konkreten Fragen beantworten:

1. **Können Football-Trainer (oder Personen mit Sport-Interesse) ohne technische Vorkenntnisse innerhalb von 3 Minuten ein Playbook-Bild hochladen und die erste Extraktion erhalten?**

2. **Verstehen die Nutzer die Ergebnisseite (Formation, Concept, A-Back Route) korrekt und können sie mit ihrem Playbook-Bild vergleichen?**

3. **Sind Nutzer in der Lage, bei falscher Erkennung den Vorgang zu wiederholen oder zu korrigieren?**

4. **Wie hoch ist die subjektive Zufriedenheit mit der Anwendung? (SUS-Score ≥ 68 als Ziel)**

---

## 2. Zu prüfende Abläufe (Scope)

### ✅ Im Test enthalten:

| User Flow | Beschreibung |
|-----------|--------------|
| Landing Page | Verständnis des Value Proposition ("Was macht diese Seite?") |
| Navigation | Zugriff auf Upload Page über Menu |
| Upload Page | Datei-Auswahl und Upload-Prozess |
| Results Page | Anzeige von Formation, Concept, A-Back Route |
| Navigation zwischen Seiten | Zurück-Button, Menü-Zugriff |

### ❌ Ausgeklammert (nicht Teil dieses Tests):

| Bereich | Grund |
|---------|-------|
| Registrierung / Login | Noch nicht im Prototyp implementiert |
| Kontakt- & Feedback-Formulare | Nice-to-have, nicht Kernfunktion |
| Pricing-Seite | Nur informativ, keine Interaktion |
| Local Model Mode (Docker) | Nur für Entwickler, nicht für Endnutzer |
| Export / Download-Funktionen | Noch nicht vollständig implementiert |

---

## 3. Evaluationsmethode

### 3.1 Heuristische Expertenevaluation

**Durchgeführt von:** Einem Kommilitonen aus Informatik-Kurs

**Vorgehen:**
1. Der Klassenkamerad erhält Zugriff auf den Prototyp (http://localhost:5174)
2. Er geht durch alle Seiten und notiert Verletzungen von Nielsens 10 Heuristiken
3. Jedes Issue wird mit Schweregrad 1-4 bewertet
4. Ergebnisse werden im "Issue Log" dokumentiert

**Zeitbedarf:** Ca. 20 Minuten

---

### 3.2 Testnutzer:innen

**Zielgruppe:**
- **2–3 Personen** die **beruflich nichts mit IT zu tun haben**
- Ideal: Personen mit Sport-/Football-Interesse (aber keine Experten)
- Alter: 18–65 Jahre
- Vorkenntnisse: Keine technischen Vorkenntnisse erforderlich

**Setting:**
- **Einzeltest** (nicht in Gruppe)
- **Moderiert** – Moderator gibt Tasks und beobachtet
- **Think-Aloud-Protokoll** – Nutzer sagt laut, was er denkt
- **Keine Hilfestellung** während der Tasks (ausser bei Abbruch)

**Ort:** Ruhiger Raum, Laptop mit Internet

---

## 4. Tasks (Aufgaben)

### Task 1: First Impression (2 Minuten)

> *"Du bist American Football Coach an einer High School. Du hast hunderte von手绘 Playbooks als Papier oder Bild und möchtest sie digitalisieren. Ein Kolleague empfiehlt dir diese Website. Was bietet sie dir genau an?"*

**Ziel:** Versteht der Nutzer das Value Proposition?

**Erfolgskriterium:** Nutzer kann beschreiben, dass die Seite Playbook-Bilder in digitale Daten umwandelt.

---

### Task 2: Upload & First Extraction (5 Minuten)

> *"Lade eines deiner Playbook-Bilder hoch und warte auf das Ergebnis. Beschriebe laut, was auf dem Bildschirm passiert, während du wartest."*

**Ziel:** Ist der Upload-Prozess intuitiv? Gibt es ausreichendes Feedback?

**Erfolgskriterium:** Nutzer findet Upload-Button und versteht, dass System arbeitet.

---

### Task 3: Result Interpretation (5 Minuten)

> *"Du hast jetzt ein Ergebnis. Vergleiche es mit deinem Original-Bild. Welche Formation hat das System erkannt? Welches Concept? Was macht der A-Back laut Ergebnis?"*

**Ziel:** Versteht der Nutzer die Ergebnisseite? Sind die Labels "Formation", "Concept", "A-Back Route" verständlich?

**Erfolgskriterium:** Nutzer kann alle drei Informationen identifizieren.

---

### Task 4: Error Handling (3 Minuten)

> *"Stell dir vor, die Erkennung ist falsch. Was kannst du tun, um das Ergebnis zu korrigieren oder den Vorgang zu wiederholen?"*

**Ziel:** Findet der Nutzer die Korrektur-Optionen?

**Erfolgskriterium:** Nutzer findet "Upload another" oder "Retry"-Option.

---

### Task 5: Mobile Navigation (3 Minuten)

> *"Ein Kollege zeigt dir die Website auf seinem Handy. Wie findest du die Upload-Funktion auf dem Mobilgerät?"*

**Ziel:** Funktioniert die Mobile Navigation?

**Erfolgskriterium:** Nutzer findet Menü und Upload-Option auch auf kleinem Screen.

---

## 5. Rollen

| Rolle | Person | Aufgabe |
|-------|--------|---------|
| **Moderator** | Anton | Führt durch, stellt Tasks, gibt keine Hilfestellung (ausser bei Abbruch) |
| **Beobachter** | Anton | Notiert Probleme, Stockungen, emotionale Reaktionen |
| **Protokollant** | Anton | Hält Issues im Issue Log fest mit Schweregrad |
| **Testnutzer** | 2–3 Personen | Führt Tasks aus, "denkt laut" |

*Hinweis:* Bei Einzelprojekt werden alle drei Rollen (Moderator, Beobachter, Protokollant) von einer Person übernommen.

---

## 6. Bewertungssystem (Schweregrad)

| Schweregrad | Bedeutung | Priorität | Beispiel |
|-------------|-----------|-----------|----------|
| **1** | **Kosmetisches Problem** – nur beheben, wenn Zeit vorhanden | Niedrig | Rechtschreibfehler, kleiner Pixel-Ruck, Farbe leicht unterschiedlich |
| **2** | **Kleines Problem** – niedrige Priorität | Mittel | Button-Text etwas unklar, aber Nutzer findet Lösung innerhalb 30 Sekunden |
| **3** | **Grosses Problem** – hohe Priorität | Hoch | Nutzer landet in Sackgasse, braucht >30 Sekunden oder ist frustriert |
| **4** | **Katastrophe** – muss vor Launch behoben werden | Kritisch | Task bricht ab, Nutzer gibt auf, keine Lösung möglich |

---

## 7. Verwendeter Fragebogen

**SUS-Fragebogen (System Usability Scale)**

Der SUS-Fragebogen wird **nach dem Nutzertest** eingesetzt.

*10 Fragen mit 5-point Likert-Skala (1 = stimme gar nicht zu, 5 = stimme voll zu)*

**Zielwert:** SUS-Score ≥ 68 (durchschnittlich bis gut)

*Hinweis:* Der eigentliche Fragebogen wird in einer späteren Lektion ausgefüllt. Hier wird nur vorbereitet, dass SUS verwendet wird.

---

## 8. Issue Log Template

```
Datum: ___________  Task-Nummer: ___  Schweregrad: ___
Beschreibung:
_______________________________________________________
_______________________________________________________
Heuristik-Verletzung (falls zutreffend):
_______________________________________________________
_______________________________________________________
```

---

## 9. Testumgebung

| Komponente | Spezifikation |
|------------|---------------|
| **Browser** | Chrome / Edge (aktuellste Version) |
| **Desktop** | 1920 × 1080 Auflösung |
| **Mobile** | iPhone 12 Pro Viewport (390 × 844) |
| **Testdaten** | 3 Playbook-Bilder aus `training/images/` |
| **Local Model** | Docker Container muss laufen (`cd docker && docker-compose up -d`) |
| **URL** | http://localhost:5174 |

---

## 10. Erfolgskriterien

Der Test ist **erfolgreich**, wenn:

1. ✅ Mindestens **80% der Tasks** ohne externe Hilfe gelöst werden
2. ✅ **Kein Issue** mit Schweregrad 4 auftritt
3. ✅ **SUS-Score ≥ 68** (durchschnittlich bis gut)
4. ✅ Alle kritischen "Grossen Probleme" (Grad 3) werden dokumentiert und priorisiert

---

# Anhang: ISO 9241-110 vs. Nielsen Heuristiken

## ISO 9241-110: 7 Dialogprinzipien

| Prinzip | Kurzbeschreibung | HudlScanner-Bezug |
|---------|------------------|-------------------|
| 1. **Aufgabenangemessenheit** | Dialog unterstützt Aufgabe effizient | ✅ Upload-Flow ist auf Kernfunktion fokussiert |
| 2. **Selbstbeschreibungsfähigkeit** | Dialog erklärt sich selbst | ⚠️ "Concept" nicht erklärt |
| 3. **Steuerbarkeit** | Nutzer kontrolliert Ablauf | ⚠️ Kein Abbruch während Upload |
| 4. **Erwartungskonformität** | Konsistent mit mentalen Modellen | ✅ Upload-Button erwartungsgemäss |
| 5. **Fehlertoleranz** | Fehler führen nicht zu Abbruch | ❌ Fehler nicht gut behandelt |
| 6. **Individualisierbarkeit** | Anpassbar an Nutzerbedürfnisse | ⚠️ Keine Einstellungen möglich |
| 7. **Lernförderlichkeit** | Unterstützt Lernen des Systems | ⚠️ Kein Tutorial oder Hilfe |

## Nielsens 10 Heuristiken

(siehe Tabelle in Teil 1 dieser Lösung)

**Hauptunterschied:** ISO 9241-110 ist **prinzipienbasiert** (abstrakte Dialog-Gütekriterien), Nielsen ist **regelbasiert** (konkrete Interface-Design-Regeln). Beide ergänzen sich für umfassende Evaluation.
