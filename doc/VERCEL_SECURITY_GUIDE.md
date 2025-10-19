# 🔒 Guide de Sécurité - Vercel Serverless

Ce guide explique comment sécuriser vos clés API avec **Vercel Serverless Functions** pour un site statique avec Airtable.

## ⚠️ **Problème de sécurité**

### ❌ **Pourquoi les variables d'environnement côté client ne fonctionnent pas :**

```javascript
// ❌ DANGEREUX - Visible dans le code source !
const apiKey = process.env.AIRTABLE_API_KEY;
```

**Problème :** Tout code JavaScript côté client est visible par l'utilisateur. Les clés API seraient exposées dans le navigateur.

## ✅ **Solution Vercel Serverless (Recommandée)**

### **Architecture Vercel :**

```
Frontend (GitHub Pages) → Vercel Functions → Airtable API
     (Statique)              (Sécurisé)        (Clés cachées)
```

### **Avantages Vercel :**

- ✅ **Gratuit** - 100GB bandwidth/mois
- ✅ **Sécurisé** - Variables d'environnement protégées
- ✅ **Rapide** - Edge functions globales
- ✅ **Simple** - Déploiement automatique
- ✅ **Monitoring** - Logs intégrés

## 🚀 **Configuration Vercel**

### **Étape 1 : Préparation du projet**

1. **Structure des fichiers :**

```
├── index.html              # Site statique
├── styles.css              # CSS
├── script.js               # JavaScript frontend
├── api/products.js         # Vercel serverless function
├── vercel.json             # Configuration Vercel
└── package.json            # Dépendances (optionnel)
```

2. **Vérifier que `api/products.js` existe :**

```javascript
// api/products.js - Déjà créé dans le projet
export default async function handler(req, res) {
  // Logique sécurisée avec variables d'environnement
}
```

### **Étape 2 : Déploiement sur Vercel**

#### **Option A : Interface Vercel (Recommandée)**

1. **Connecter GitHub :**

   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Import Project"
   - Connectez votre repo GitHub

2. **Configuration automatique :**

   - Vercel détecte automatiquement `api/products.js`
   - Les fonctions serverless sont créées automatiquement

3. **Variables d'environnement :**
   - Dans le dashboard Vercel → Settings → Environment Variables
   - Ajoutez :
     ```
     AIRTABLE_PERSONAL_ACCESS_TOKEN = votre_personal_access_token
     AIRTABLE_BASE_ID = votre_base_id
     AIRTABLE_TABLE_NAME = Produits
     ```

#### **Option B : CLI Vercel**

```bash
# Installation
npm install -g vercel

# Login
vercel login

# Déploiement
vercel

# Configuration des variables
vercel env add AIRTABLE_PERSONAL_ACCESS_TOKEN
vercel env add AIRTABLE_BASE_ID
vercel env add AIRTABLE_TABLE_NAME
```

### **Étape 3 : Configuration du Frontend**

Modifiez `script.js` pour pointer vers votre fonction Vercel :

```javascript
// script.js - Ligne 45-47
this.proxyUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/products" // Développement local
    : "https://votre-projet.vercel.app/api/products"; // Production Vercel
```

## 🌐 **Architecture Complète : GitHub Pages + Vercel**

### **Comment ça fonctionne :**

```
1. Utilisateur visite votre site sur GitHub Pages
   ↓
2. JavaScript charge depuis GitHub Pages
   ↓
3. JavaScript fait une requête vers Vercel Functions
   ↓
4. Vercel Functions (sécurisé) appelle Airtable
   ↓
5. Données retournées au frontend
```

### **Avantages de cette architecture :**

- ✅ **Frontend gratuit** - GitHub Pages
- ✅ **Backend sécurisé** - Vercel Functions
- ✅ **Séparation des responsabilités**
- ✅ **Déploiement indépendant**

### **Configuration CORS :**

Vercel gère automatiquement CORS, mais vous pouvez le personnaliser :

```javascript
// api/products.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ... reste du code
}
```

## 🔧 **Déploiement étape par étape**

### **1. Préparer le repository GitHub :**

```bash
# Initialiser le repo
git init
git add .
git commit -m "Initial commit"

# Créer le repo sur GitHub
# Pousser le code
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

### **2. Configurer GitHub Pages :**

1. Allez dans Settings → Pages
2. Source : Deploy from a branch
3. Branch : main
4. Folder : / (root)
5. Votre site sera disponible sur : `https://votre-username.github.io/votre-repo`

### **3. Configurer Vercel :**

1. Connectez votre repo GitHub à Vercel
2. Vercel détecte automatiquement les fonctions dans `/api`
3. Ajoutez les variables d'environnement
4. Déployez

### **4. Mettre à jour l'URL dans le code :**

```javascript
// script.js
this.proxyUrl = "https://votre-projet.vercel.app/api/products";
```

## 📊 **Monitoring et Logs**

### **Vercel Dashboard :**

1. **Functions** - Voir les logs des fonctions
2. **Analytics** - Statistiques d'utilisation
3. **Environment Variables** - Gestion des variables

### **Logs en temps réel :**

```bash
# CLI Vercel
vercel logs --follow

# Ou dans le dashboard Vercel
# Functions → products → View Function Logs
```

## 🛡️ **Sécurité avancée**

### **Rate Limiting :**

```javascript
// api/products.js
let requestCount = 0;
const RATE_LIMIT = 100; // requêtes par heure

export default async function handler(req, res) {
  requestCount++;

  if (requestCount > RATE_LIMIT) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  // ... reste du code
}
```

### **Validation des requêtes :**

```javascript
// api/products.js
export default async function handler(req, res) {
  // Vérifier l'origine
  const allowedOrigins = [
    "https://votre-username.github.io",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // ... reste du code
}
```

## 🚀 **Déploiement automatique**

### **GitHub Actions (Optionnel) :**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 **Coûts et limites**

### **Vercel (Gratuit) :**

- ✅ 100GB bandwidth/mois
- ✅ 1000 function invocations/mois
- ✅ Variables d'environnement illimitées
- ✅ Logs et monitoring

### **GitHub Pages (Gratuit) :**

- ✅ 1GB storage
- ✅ 100GB bandwidth/mois
- ✅ HTTPS automatique

## 🔍 **Dépannage**

### **Erreur CORS :**

```javascript
// Vérifiez les headers CORS dans api/products.js
res.setHeader("Access-Control-Allow-Origin", "*");
```

### **Variables d'environnement :**

```bash
# Vérifiez dans Vercel Dashboard
# Settings → Environment Variables
# Assurez-vous que AIRTABLE_PERSONAL_ACCESS_TOKEN est configuré
```

### **Logs d'erreur :**

```bash
# Vercel CLI
vercel logs --follow

# Ou dashboard Vercel → Functions → Logs
```

## 🎯 **Résumé de l'architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │  Vercel Functions│    │   Airtable API  │
│                 │    │                 │    │                 │
│  - index.html   │───▶│  - api/products │───▶│  - Clés API     │
│  - styles.css   │    │  - Variables    │    │  - Données      │
│  - script.js    │    │  - Sécurisé     │    │  - Images       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     (Gratuit)              (Gratuit)           (Gratuit)
```

**Résultat :** Solution 100% gratuite, sécurisée et performante !

---

_Besoin d'aide ? Consultez la [documentation Vercel](https://vercel.com/docs)_
