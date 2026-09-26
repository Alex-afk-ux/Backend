# ADR-002: Estructura inicial del projecte

## Context

Cal decidir com organitzar el codi del backend i el frontend de la botiga de chubasqueros per a peixos: en un monorepo o en repositoris separats. L'equip és petit, es troba a la fase inicial del projecte i necessita iterar ràpidament amb canvis que sovint afecten alhora l'API (catàleg, comandes) i la interfície (botiga, carret).

## Decisió

Farem servir un monorepo, amb el backend i el frontend en carpetes separades dins el mateix repositori (/backend, /frontend, /docs).

## Conseqüències

+ Els canvis que afecten backend i frontend alhora es revisen en un sol commit/PR.
+ Menys sobrecàrrega de gestió (un sol repositori, un sol issue tracker).
- El repositori creix més ràpid i els historials de backend/frontend queden barrejats.
