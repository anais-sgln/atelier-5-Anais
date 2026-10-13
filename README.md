# Atelier 5 · Kata comportemental

**Séance 5 · Patterns comportementaux · 55 min, avec la validation des sujets de dossier**

Retour sur **VenteFlash**, le code que vous avez audité à l’atelier 1 et commencé à transformer à l’atelier 2, et dont vous avez branché le paiement à l’atelier 4. Les tests de `tests/app.test.ts` décrivent le comportement actuel du code. Ils sont **verts au départ** et doivent le rester à chaque commit : c’est un refactoring, pas une réécriture.

**Trois missions, dans l’ordre.** Deux patterns à introduire, puis un pattern à retirer. En parallèle, l’intervenant passe de table en table pour valider votre sujet de dossier.

## Déroulé conseillé

| Temps  | Étape                                                 |
|--------|-------------------------------------------------------|
| 5 min  | Démarrage : création du dépôt, branche, installation  |
| 15 min | Mission 1 · Strategy pour les frais de livraison      |
| 15 min | Mission 2 · Observer pour les réactions à la commande |
| 10 min | Mission 3 · retirer le golden hammer                  |
| 10 min | Sujets de dossier et pull request, avant 12:20        |
| 7 min  | Débrief collectif avec l’intervenant                  |

Le passage de l’intervenant pour votre sujet de dossier prend une minute par étudiant. Préparez votre fichier `SUJET-DOSSIER-nom.md` dès le début, puis reprenez le code.

## 1. Démarrage : créer votre dépôt GitHub

Vous connaissez la procédure depuis l’atelier 1. Elle est rappelée ici en entier, pour ceux qui étaient absents ou qui changent de poste.

**Un seul membre crée le dépôt et pousse.** Il tient le clavier et fait les commits. L’autre relit chaque transformation avant le commit. Échangez les rôles entre deux missions.

Deux façons de faire. Choisissez **A** si Git et Node.js sont installés sur votre poste. Sinon, choisissez **B** : tout se passe dans le navigateur.

### A. Sur votre poste, avec Git

**1. Créez le dépôt vide sur GitHub.** En haut à droite de github.com : **+**, puis **New repository**.

- Nom : `atelier-05-nom1-nom2`, avec vos deux noms de famille, en minuscules et sans accents.
- Visibilité : **Private**.
- Ne cochez **rien** d’autre : ni README, ni .gitignore, ni licence. Le dépôt doit être vide.

Cliquez sur **Create repository**. Gardez la page ouverte : elle affiche l’adresse du dépôt.

**2. Envoyez le code de départ.** Décompressez l’archive `atelier-05-kata-comportemental.zip` téléchargée sur l’espace du cours. Ouvrez un terminal dans le dossier obtenu, puis :

``` bash
git init
git add .
git commit -m "Code de départ VenteFlash"
git branch -M main
git remote add origin https://github.com/<votre-pseudo>/atelier-05-nom1-nom2.git
git push -u origin main
```

Rechargez la page GitHub : les fichiers apparaissent. Le dossier `.github` est caché sur votre poste, c’est normal. Vérifiez sur GitHub qu’il est bien présent.

**3. Créez votre branche de travail et lancez les tests.**

``` bash
git switch -c travail
npm install
npm test
```

### B. Dans le navigateur, avec Codespaces

**1. Créez le dépôt sur GitHub.** En haut à droite de github.com : **+**, puis **New repository**. Nom `atelier-05-nom1-nom2`, visibilité **Private**, et cochez cette fois **Add a README file**. Cliquez sur **Create repository**.

**2. Ouvrez un Codespace.** Bouton **Code**, onglet **Codespaces**, **Create codespace on main**. Un éditeur s’ouvre dans le navigateur après une minute environ.

**3. Envoyez le code de départ.** Glissez l’archive `atelier-05-kata-comportemental.zip` dans l’explorateur de fichiers, à gauche. Puis, dans le terminal en bas de l’écran :

``` bash
unzip atelier-05-kata-comportemental.zip
cp -r atelier-05-kata-comportemental/. .
rm -rf atelier-05-kata-comportemental atelier-05-kata-comportemental.zip __MACOSX
git add .
git commit -m "Code de départ VenteFlash"
git push
git switch -c travail
npm install
npm test
```

Dans un Codespace, Git est déjà connecté à votre compte : aucun mot de passe à saisir.

### Dans les deux cas

Vous devez voir **6 tests au vert**. Ce sont des tests de caractérisation, comme à l’atelier 2 : ils photographient ce que fait le code aujourd’hui. S’ils passent au rouge, vous avez changé le comportement.

**Invitez votre binôme et l’intervenant.** Sur la page du dépôt : **Settings**, puis **Collaborators**, puis **Add people**. Ajoutez le pseudo GitHub de votre binôme, puis celui de l’intervenant, communiqué en séance. Chaque invité reçoit un email et doit accepter l’invitation.

Si l’installation échoue, prévenez l’intervenant. Aujourd’hui, vous ne pouvez pas refactorer sans les tests : ce sont eux qui prouvent que vous n’avez rien cassé. Commencez en attendant votre `SUJET-DOSSIER-nom.md`.

### En cas de problème

| Message ou symptôme                                  | Solution                                                                                                                          |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `Please tell me who you are` au premier commit       | `git config --global user.name "Prénom Nom"` puis `git config --global user.email "votre-email-github"`, et recommencez le commit |
| `Password authentication is not supported` au push   | GitHub refuse les mots de passe dans le terminal. Utilisez GitHub Desktop, ou `gh auth login`, ou passez à la méthode B           |
| `rejected` au premier push                           | Le dépôt n’était pas vide. Recréez-le sans README, ou passez à la méthode B                                                       |
| `remote origin already exists`                       | `git remote set-url origin <adresse-du-depot>`                                                                                    |
| Le dossier `.github` n’apparaît pas sur GitHub       | Il n’a pas été copié. Vérifiez avec `ls -a` dans le terminal                                                                      |
| Un test passe au rouge après une transformation      | Ne commitez pas. Annulez avec `git restore src/`, puis refaites la transformation en plus petit                                   |
| `Expected 5 arguments, but got 6` après la mission 2 | Vous avez retiré `sendEmail` de `processOrder`. Retirez aussi le dernier argument, `false`, des six appels de `tests/app.test.ts` |

## 2. Les trois missions

### Mission 1 · Strategy : les frais de livraison

**Où** : `orderManager.ts · processOrder · l. 45-52`.

La cascade `if/else` sur `shipping` grossit à chaque nouveau mode. Le marketing annonce « POINT-RELAIS » et « DRONE » pour Noël. Remplacez-la par une **Strategy** : ajouter un mode ne doit plus toucher au code de `OrderManager`. La direction assume ce choix : les deux nouveaux modes sont annoncés, et le DRONE sera facturé au poids. Pour l’instant, chaque mode garde un tarif fixe.

Les tests passent le mode sous forme de texte, par exemple `"STANDARD"`. Il vous faut donc un pont entre ce texte et l’objet qui calcule les frais.

> Question pour vous guider : aujourd’hui, un mode inconnu n’ajoute aucun frais. Votre version fait-elle pareil ? Un refactoring ne change pas le comportement, même quand il paraît discutable.

### Mission 2 · Observer : les réactions à la commande

**Où** : `orderManager.ts · processOrder`, bloc « envoi de l’email de confirmation », l. 55-58 du code de départ.

L’email de confirmation est enfoui dans `processOrder`, derrière un booléen. La comptabilité veut des statistiques, et le stock veut être notifié. Introduisez un **Observer** : la validation d’une commande notifie des abonnés que `OrderManager` ne connaît pas.

1.  Déplacez le `console.log` de l’email dans un premier abonné.
2.  Ajoutez un second abonné, `Statistiques`, qui compte les commandes validées.
3.  Supprimez ensuite le paramètre `sendEmail` de `processOrder`.

**C’est la seule modification de tests autorisée** : retirer le dernier argument, `false`, des six appels de `tests/app.test.ts`. Les assertions ne bougent pas.

> Attention : aucun des 6 tests ne vérifie le texte de l’email, car tous passent `sendEmail = false`. Vous pourriez casser le message sans le voir, comme à l’atelier 2. Avant de le déplacer, ajoutez un test qui vérifie ce texte, dans un **nouveau** fichier de `tests/`.

> Question pour vous guider : une fois la mission terminée, `OrderManager` contient-il encore le mot « email » ? Qui décide alors qu’un email part ?

### Mission 3 · Le golden hammer : à retirer

Un pattern a été utilisé **sans nécessité** quelque part dans `src/`. Trouvez-le, supprimez-le, et expliquez dans le message de commit pourquoi c’en était un.

> Question pour vous guider : un golden hammer est un **pattern**. Le code inutile qui n’est pas un pattern porte un autre nom. Vous l’avez vu en séance 1.

## 3. Consignes

### Ce qu’il ne faut pas toucher

- les assertions des tests existants : seul le dernier argument `false` disparaît, après la mission 2,
- le texte exact du reçu renvoyé par `processOrder`,
- le texte exact de l’email de confirmation,
- l’attribut `orders`, `getTotalRevenue()` et `estimateTtc(ht, type)`.

### Règles du refactoring, non négociables

- `npm test` **au vert après chaque commit**. Le comportement ne change pas.
- **Un commit = une transformation.** Une extraction, un déplacement, une suppression. Jamais trois à la fois.
- Pas de fonctionnalité nouvelle. Pas de « pendant que j’y suis ».

### Le message de commit

Chaque message suit le format **principe → transformation → bénéfice**, comme à l’atelier 2.

    OCP : cascade sur le mode de livraison → Strategy, une classe par mode → un nouveau mode ne touche plus OrderManager

Le commit de la mission 3 dit en plus **pourquoi** le pattern retiré était un golden hammer : à quoi il servait, et pourquoi personne n’en avait besoin.

### Le sujet de dossier

Chaque membre du binôme copie `SUJET-DOSSIER.md` en `SUJET-DOSSIER-nom.md`, puis le complète. Le modèle est le fichier `SUJET-DOSSIER.md`, repris en annexe A du document Word. Pendant le kata, l’intervenant passe à votre table : vous présentez votre sujet en une minute, et il le valide sur place ou vous demande une reprise.

Un bon sujet a trois qualités : un accès réel au code, au moins deux problèmes de conception que vous soupçonnez déjà, et une taille suffisante, plusieurs centaines de lignes réparties en plusieurs modules. Un projet personnel, d’école ou d’alternance convient, à condition de pouvoir montrer le code.

**Sujet non validé à la fin du kata ?** Envoyez-le à l’intervenant avant la séance 6. Le jalon suivant est un diagnostic au brouillon, pour le point d’étape de la séance 7.

### Ce que regarde l’intervenant

| Critère          | Ce qui est attendu                                                                      |
|------------------|-----------------------------------------------------------------------------------------|
| Tests            | Verts à chaque commit. Seul l’argument `sendEmail` a disparu des tests                  |
| Strategy         | Un mode égale une classe. Un nouveau mode ne touche pas `OrderManager`                  |
| Observer         | `OrderManager` ne connaît aucun abonné concret. Email identique, `Statistiques` présent |
| Golden hammer    | Le bon pattern retiré, avec un commit qui explique pourquoi                             |
| Commits          | Une transformation par commit, message au format principe → transformation → bénéfice   |
| Sujet de dossier | Un fichier `SUJET-DOSSIER-nom.md` par étudiant, présenté à l’intervenant                |
| Usage de l’IA    | Déclaré dans la description de la pull request                                          |

## 4. Rendu : pull request avant 12:20

``` bash
npm test
git log --oneline
git add SUJET-DOSSIER-*.md
git commit -m "Sujets de dossier"
git push -u origin travail
```

`git log --oneline` affiche vos commits, un par ligne. Relisez-les avant de pousser : chacun doit raconter une transformation.

Sur GitHub, ouvrez ensuite **Pull requests**, puis **New pull request**. Choisissez base `main` et compare `travail`. Titre : « Atelier 5 · prénom 1 + prénom 2 ». Dans la description, indiquez la mission la plus difficile et votre usage de l’IA.

Copiez enfin l’adresse de votre pull request et déposez-la sur l’espace du cours, dans le devoir « Atelier 5 ». Vérifiez que l’intervenant a bien accepté votre invitation : sans elle, il ne peut pas lire un dépôt privé.

Un contrôle automatique tourne sur votre pull request :

- **CI** : elle compile le projet en TypeScript strict, puis lance les tests. Elle doit rester verte.

Un contrôle rouge ? Ouvrez le détail, lisez le premier message d’erreur, corrigez, puis faites un nouveau `git commit` et `git push`. La pull request se met à jour toute seule.

## Pour aller plus loin

Votre binôme a fini en avance ? Trois défis au choix, toujours un commit par transformation :

- Ajoutez le mode « POINT-RELAIS », à 3,50 EUR, et prouvez-le par un test. Combien de lignes de `OrderManager` avez-vous modifiées ?
- `estimateTtc` dans `ReportGenerator` répète la cascade des remises par type de client. Appliquez-lui une Strategy, et supprimez la duplication avec `processOrder`.
- Un abonné lève une erreur. Les abonnés suivants sont-ils encore notifiés ? Décidez du comportement voulu, et fixez-le par un test.

## Règles communes à tous les ateliers

- Travail en binôme, dans un dépôt GitHub privé créé par le binôme. L’intervenant y est invité.
- Les tests restent au vert à chaque commit. La CI le vérifie.
- Rendu par pull request de la branche `travail` vers `main`.
- IA autorisée dans le cadre du syllabus : l’IA propose, vous arbitrez et justifiez. Tout usage se signale dans la description de la pull request.

## Contenu du dépôt

| Fichier                    | Rôle                                                              |
|----------------------------|-------------------------------------------------------------------|
| `src/orderManager.ts`      | La classe centrale de VenteFlash, à refactorer                    |
| `src/reportGenerator.ts`   | Le rapport et l’estimation de devis                               |
| `src/legacyUtils.ts`       | Des utilitaires repérés à l’atelier 1                             |
| `tests/app.test.ts`        | Les 6 tests de caractérisation                                    |
| `SUJET-DOSSIER.md`         | Le modèle de sujet de dossier, à copier en `SUJET-DOSSIER-nom.md` |
| `.github/workflows/ci.yml` | La CI lancée à chaque push                                        |
| `Atelier-05-Kata-comportemental.docx` | Cette consigne au format Word, avec les annexes |
