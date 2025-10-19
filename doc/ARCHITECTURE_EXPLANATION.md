# 🏗️ Architecture : GitHub Pages + Vercel

## 📋 **Explication détaillée de l'architecture**

### **Question : "Si je déploie le site sur GitHub Pages, est-ce que le lien avec le proxy de Vercel fonctionnera ?"**

**Réponse : OUI, absolument !** Voici pourquoi et comment :

## 🔄 **Flux de données complet**

```
1. Utilisateur tape l'URL de votre site
   ↓
2. GitHub Pages sert les fichiers statiques (HTML, CSS, JS)
   ↓
3. JavaScript s'exécute dans le navigateur
   ↓
4. JavaScript fait une requête AJAX vers Vercel Functions
   ↓
5. Vercel Functions (sécurisé) récupère les données d'Airtable
   ↓
6. Données retournées au JavaScript
   ↓
7. Page mise à jour avec les produits
```

## 🎯 **Pourquoi ça fonctionne**

### **1. Séparation des responsabilités :**

- **GitHub Pages** = Hébergement des fichiers statiques (gratuit)
- **Vercel Functions** = Logique backend sécurisée (gratuit)
- **Airtable** = Base de données (gratuit)

### **2. Communication cross-origin :**

```javascript
// Votre JavaScript peut appeler n'importe quelle API
fetch("https://votre-projet.vercel.app/api/products")
  .then((response) => response.json())
  .then((data) => {
    // Afficher les produits
  });
```

### **3. CORS géré automatiquement :**

Vercel configure automatiquement CORS pour permettre les requêtes depuis GitHub Pages.

## 🏗️ **Architecture détaillée**

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 1. Visite https://votre-username.github.io/votre-repo
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    GITHUB PAGES                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ index.html  │  │ styles.css  │  │ script.js   │              │
│  │ (SEO optim) │  │ (Thèmes)    │  │ (Frontend)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 2. JavaScript s'exécute
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   NAVIGATEUR                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ JavaScript fait une requête vers Vercel Functions           ││
│  │ fetch('https://votre-projet.vercel.app/api/products')       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 3. Requête HTTP vers Vercel
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                  VERCEL FUNCTIONS                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ api/products.js (Sécurisé)                                  ││
│  │ - Variables d'environnement protégées                       ││
│  │ - Clés API cachées                                          ││
│  │ - Logique de sécurité                                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 4. Appel sécurisé vers Airtable
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    AIRTABLE API                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ - Base de données des produits                              ││
│  │ - Images des produits                                       ││
│  │ - Gestion via interface web                                 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **Configuration technique**

### **1. GitHub Pages (Frontend) :**

```bash
# Repository structure
├── index.html          # Page principale
├── styles.css          # Styles
├── script.js           # JavaScript frontend
└── api/                # Dossier ignoré par GitHub Pages
    └── products.js     # Fonction Vercel
```

**URL finale :** `https://votre-username.github.io/votre-repo`

### **2. Vercel Functions (Backend) :**

```javascript
// api/products.js
export default async function handler(req, res) {
  // Variables d'environnement sécurisées
  const apiKey = process.env.AIRTABLE_API_KEY; // Caché !
  const baseId = process.env.AIRTABLE_BASE_ID; // Caché !

  // Logique sécurisée
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/Produits`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  const data = await response.json();
  res.json(data);
}
```

**URL finale :** `https://votre-projet.vercel.app/api/products`

### **3. Configuration CORS :**

```javascript
// api/products.js
export default async function handler(req, res) {
  // CORS headers pour GitHub Pages
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ... reste du code
}
```

## 🚀 **Déploiement étape par étape**

### **Étape 1 : GitHub Pages**

1. **Créer le repository :**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

2. **Activer GitHub Pages :**
   - Settings → Pages
   - Source : Deploy from a branch
   - Branch : main
   - Folder : / (root)

### **Étape 2 : Vercel Functions**

1. **Connecter à Vercel :**

   - [vercel.com](https://vercel.com) → Import Project
   - Connecter le même repository GitHub

2. **Variables d'environnement :**

   - Dashboard Vercel → Settings → Environment Variables
   - Ajouter : `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

3. **Déploiement automatique :**
   - Vercel détecte `api/products.js`
   - Déploie automatiquement la fonction

### **Étape 3 : Configuration finale**

```javascript
// script.js - Modifier l'URL
this.proxyUrl = "https://votre-projet.vercel.app/api/products";
```

## ✅ **Avantages de cette architecture**

### **Gratuit :**

- ✅ GitHub Pages : 100% gratuit
- ✅ Vercel Functions : 100% gratuit (100GB/mois)
- ✅ Airtable : 100% gratuit (1200 records)

### **Sécurisé :**

- ✅ Clés API cachées côté serveur
- ✅ Variables d'environnement protégées
- ✅ CORS configuré automatiquement

### **Performant :**

- ✅ CDN GitHub Pages (global)
- ✅ Edge functions Vercel (global)
- ✅ Cache automatique

### **Maintenance :**

- ✅ Déploiement automatique
- ✅ Logs intégrés
- ✅ Monitoring gratuit

## 🔍 **Test de l'architecture**

### **1. Test local :**

```bash
# Démarrer Vercel en local
vercel dev

# Tester l'API
curl http://localhost:3000/api/products
```

### **2. Test en production :**

```bash
# Tester l'API Vercel
curl https://votre-projet.vercel.app/api/products

# Tester depuis GitHub Pages
# Ouvrir https://votre-username.github.io/votre-repo
# Vérifier la console (F12)
```

## 🎯 **Résumé**

**OUI, GitHub Pages + Vercel Functions fonctionne parfaitement !**

- **GitHub Pages** héberge votre site statique
- **Vercel Functions** gère la logique backend sécurisée
- **Communication** via requêtes HTTP standard
- **CORS** géré automatiquement par Vercel
- **100% gratuit** et performant

Cette architecture est idéale pour des sites statiques avec des besoins backend sécurisés !

---

_Besoin d'aide avec le déploiement ? Consultez le [VERCEL_SECURITY_GUIDE.md](VERCEL_SECURITY_GUIDE.md)_
