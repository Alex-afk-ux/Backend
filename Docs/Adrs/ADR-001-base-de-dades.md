# ADR-001: Base de dades del projecte

## Context

Necessitem una base de dades flexible per emmagatzemar chubasqueros per a peixos, usuaris i comandes amb relacions no rígides. El catàleg de productes és heterogeni (talla, color, material impermeable, espècie de peix objectiu) i esperem afegir-hi atributs nous sovint durant les primeres fases del projecte.

## Decisió

Farem servir MongoDB com a base de dades principal, gestionada via Docker.

## Conseqüències

+ Flexibilitat per a nous camps i entitats.
+ Bona integració amb Node/Express.
- Menys adequat per a consultes molt relacionals.
