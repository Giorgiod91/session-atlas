---
project: /Users/demo/code/rezept-app
---
# Anforderungen: Rezeptsuche

## Ziel
Rezepte sollen in unter einer Sekunde über Titel, Zutaten und Tags auffindbar sein.

## Muss
- Volltextsuche über Titel und Zutaten
- Tippfehler tolerieren (z.B. "Tomatn" findet "Tomaten")
- Treffer nach Relevanz sortieren, frische Rezepte leicht bevorzugen
- Funktioniert offline auf dem Handy

## Kann
- Filter nach Kochzeit und Ernährungsform
- Letzte Suchen merken

## Nicht
- Keine externe Such-API, alles lokal

## Offene Fragen
- Wie viele Rezepte erwarten wir maximal? 500 oder 50.000?
