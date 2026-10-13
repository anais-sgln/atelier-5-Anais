# Explication des tests (tests/app.test.ts)

Les 6 tests sont des **tests de caractérisation** : ils fixent le comportement actuel du code et doivent rester verts à chaque commit.

| Test | Ce qu'il fait | Pattern |
|---|---|---|
| Commande particulier, livraison standard | Remise de 2 %, TVA, +5,90 de livraison, vérifie le texte exact du reçu | **Strategy** (mission 1), avec la livraison STANDARD |
| Commande VIP avec code promo, retrait | Remise de 10 %, code `WELCOME10`, TVA, livraison gratuite | **Strategy** (mission 1), avec la livraison RETRAIT |
| Commande PRO express | Remise de 5 %, TVA, +14,90 de livraison, vérifie le chiffre d'affaires | **Strategy** (mission 1), avec la livraison EXPRESS |
| Le chiffre d'affaires cumule les commandes | 2 commandes donnent un chiffre d'affaires total de 23,52 | **contexte** (mission 2) : l'enregistrement dans `orders` doit marcher encore une fois l'email sorti de `processOrder` |
| Le rapport HTML liste les commandes et le total | `generateHtml` affiche chaque commande et le total | **contexte** (mission 2) : `orders` et `getTotalRevenue()` ne doivent pas bouger |
| L'estimation de devis applique remise puis TVA | `estimateTtc(100, "PRO")` donne 114 | **Contexte** : `estimateTtc(ht, type)` ne doit pas bouger |


## Mission 1 · Strategy (frais de livraison)

Problème : la cascade `if/else` sur le mode de livraison oblige à modifier `OrderManager` à chaque nouveau mode (POINT-RELAIS, DRONE), ce qui viole l'OCP.

Solution : chaque mode devient une petite classe qui connaît son propre tarif (`StandardShipping`, `ExpressShipping`, `RetraitShipping`), et `OrderManager` se contente de lui demander `cost()`, sans connaître les tarifs.
