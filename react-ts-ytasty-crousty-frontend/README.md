# Ytasty Crousty

Frontend React 19 / TypeScript de Ytasty Crousty : restaurants, catalogue, panier, commandes, espace cuisine et administration.

## Stack

- Vite, React et TypeScript
- Material UI pour l’interface et le thème
- Redux Toolkit pour l’authentification et le panier
- Axios pour l’API REST
- Socket.IO pour les nouvelles commandes côté cuisine

L’API FastAPI et PostgreSQL sont dans le dépôt voisin `Ytasty-Crousty`.

## Prérequis

- Node.js et npm
- Docker Desktop avec Docker Compose
- Python 3.12+ et `uv` si l’API est lancée sans Docker

## Démarrage

### API et base de données

Depuis le dossier frontend `react-ts-ytasty-crousty-frontend` :

```powershell
Set-Location ..\..\Ytasty-Crousty
docker compose up -d --build api
```

Compose démarre PostgreSQL et l’API. L’API est disponible sur `http://localhost:8080`; PostgreSQL est exposé sur le port `5433`.

Le fichier `database.sql` fournit les données de démonstration lors de la première création du volume PostgreSQL. Un volume existant n’est pas réinitialisé par `docker compose up`.

Pour lancer l’API hors Docker, démarrez d’abord PostgreSQL avec `docker compose up -d db`, puis depuis le dépôt API :

```powershell
uv run uvicorn main:app --reload --port 8080
```

### Frontend

Revenez dans `react-ts-ytasty-crousty-frontend`, puis installez et lancez le projet :

```powershell
Set-Location ..\Ytasty-Crousty-frontend\react-ts-ytasty-crousty-frontend
npm install
npm run dev
```

Vite affiche l’adresse de l’application au démarrage, par défaut `http://localhost:5173`. Si le port est occupé, Vite peut en choisir un autre.

### Configuration

Les variables Vite se placent dans `.env.local`, à côté du `package.json` frontend :

```dotenv
VITE_API_URL=http://localhost:8080
```

Socket.IO utilise par défaut l’origine du frontend et le proxy Vite `/socket.io`. Pour connecter le client directement à l’API, ajouter également :

```dotenv
VITE_SOCKET_URL=http://localhost:8080
```

Redémarrez Vite après une modification de ces variables. Pour le développement, les origines locales `5173`, `5174` et `5175` sont autorisées par l’API; si Vite utilise un autre port, ajoutez-le aux listes CORS de `Ytasty-Crousty/main.py` et `Ytasty-Crousty/src/app/common/realtime.py`.

## Fonctionnalités

- **Restaurants** : liste des établissements, horaires et disponibilité; le choix d’un restaurant filtre le catalogue.
- **Catalogue et panier** : recherche, filtres, fiche produit, gestion des quantités et persistance locale.
- **Commande client** : choix du mode de retrait, validation, confirmation et suivi par numéro.
- **Cuisine** : accès protégé staff/admin, filtrage par restaurant pour le staff, colonnes par statut, progression et annulation.
- **Temps réel** : réception Socket.IO de `new_order` dans la room du restaurant, notification visuelle et son activable depuis l’écran cuisine.
- **Administration** : création de comptes staff/admin; le staff est rattaché à un restaurant.

## Routes principales

| Route | Accès | Description |
| --- | --- | --- |
| `/` | Public | Liste des restaurants |
| `/carte?restaurant_id=1` | Public | Catalogue du restaurant choisi |
| `/produit/:id` | Public | Détail d’un produit |
| `/panier`, `/commande` | Public | Panier et validation de commande |
| `/confirmation/:order_number` | Public | Confirmation |
| `/suivi`, `/suivi/:order_number` | Public | Suivi de commande |
| `/login` | Public | Connexion |
| `/dashboard` | Staff/admin | Tableau cuisine |
| `/admin/users` | Admin | Création d’utilisateurs |

## Compte de démonstration

Le seed de l’API contient le compte administrateur suivant :

- Identifiant : `admin123`
- Mot de passe : `Admin@123456`

## Endpoints consommés

- `POST /auth/login`
- `GET /restaurants`, `GET /restaurants/{restaurant_id}`
- `GET /products`, `GET /products/{product_id}`
- `POST /orders`, `GET /orders/{order_number}`
- `GET /restaurants/{restaurant_id}/orders`
- `PATCH /orders/{order_number}/status`
- `POST /orders/{order_number}/cancel`
- `POST /users` (admin uniquement)

Axios ajoute automatiquement le JWT stocké dans `access_token`; Socket.IO transmet le même jeton lors du handshake.

## Scripts

À lancer depuis le dossier frontend :

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```