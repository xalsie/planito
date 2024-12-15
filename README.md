# Projet de Gestion de planning

Créé par :

-   Taslima (Taslima-Ahamed-Mze)
-   Bastien (Bass913)
-   Alexis Giard (rxalsie)
-   Erkant YILDIZ (EEEEEEKRAN)
-   Léo GUIRADO (horotopia)


## Fonctionnalités

-   **Connexion** Erkant
-   **Dashboard école** Front -> Bastien, Back -> Taslima
    -   Onglet Calendrier: Visualisation des cours sur le calendrier (Mois, semaine, jour)
    -   Onglet Intervenants: Liste des intervenants (possibilité de les supprimer)
    -   Onglet Salles: Liste des salles (possibilité d'ajouter et de les supprimer) 
    -   Onglet Modules: Liste des modules (possibilité d'ajouter et de les supprimer)
    -   Onglet Disponibilités: Calendrier où on peut saisir les disponibilités des classes
    -   Onglet Génération de planning: Générer le planning complet d'une classe
    -   Onglet Préferences: Saisir les préferences de planification des intervenants (Léo GUIRADO)
-   **Dashboard intervenant** Front -> Erkant, Back -> Alexis
    -   Onglet Calendrier: Visualisation des cours sur le calendrier (Mois, semaine, jour) avec filtre école, classe et modules
    -   Onglet Import de calendrier: Importation d'un agenda par URL format ics (Léo GUIRADO)



## Installation

Pour installer et exécuter l'application localement, suivez ces étapes :

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/xalsie/planito.git
    ```
2. Naviguez dans le répertoire du projet :
    ```sh
    cd planito
    ```
3. Créez l'image docker
    ```sh
    docker compose build
    ```
4. Démarrez l'application :
    ```sh
    docker compose up
    ```
5. Lancer les migration   
    ```sh
    docker exec -it backend sh
    npm run migrate
    ```
6. Lancer les fixtures   
    ```sh
    docker exec -it backend sh
    npm run fixtures
    ```

## Utilisation

Une fois l'application démarrée, ouvrez votre navigateur et accédez à `http://localhost:5173` pour utiliser l'application.
