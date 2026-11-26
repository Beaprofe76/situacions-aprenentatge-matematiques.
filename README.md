# Situacions d’aprenentatge · Matemàtiques ESO

Aplicació web estàtica en català per planificar situacions d’aprenentatge de matemàtiques a l’ESO. No necessita instal·lació ni servidor: obre `index.html` o publica el repositori amb GitHub Pages.

## Funcionalitats

- Formulari per definir context, repte, producte final, competències, criteris d’avaluació, sabers, objectius, sessions, metodologia, inclusió, instruments i recursos.
- Exemple editable per començar ràpidament.
- Desa, edita i elimina situacions al `localStorage` del navegador.
- Importa una situació o una col·lecció des d’un fitxer JSON i exporta-les individualment o totes juntes.
- Disseny adaptable a mòbils i ordinadors.

## Publicar amb GitHub Pages

1. Al repositori, ves a **Settings → Pages**.
2. A **Build and deployment**, tria **Deploy from a branch**.
3. Selecciona la branca `main` i la carpeta `/(root)` i desa.
4. Quan GitHub Pages hagi acabat la publicació, obre l’adreça que apareix a la mateixa pàgina de configuració.

## Dades i còpies de seguretat

Les situacions que crees es desen al navegador i no s’envien a cap servidor. Per conservar-les o moure-les a un altre dispositiu, prem **Exporta-les totes** i desa el fitxer JSON. Després podràs recuperar-les amb **Importa JSON**. Esborra les dades del navegador només després d’haver-ne fet una còpia si vols conservar-les.

La carpeta `data/situacions.json` és un fitxer JSON inicial buit; l’aplicació no hi desa automàticament les dades, perquè GitHub Pages només publica fitxers estàtics.
