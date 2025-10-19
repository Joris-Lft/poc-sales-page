# 🔒 Guide de Sécurité - Clés API

Ce guide explique comment sécuriser vos clés API pour un site statique avec Airtable.

## ⚠️ **Problème de sécurité**

### ❌ **Pourquoi les variables d'environnement côté client ne fonctionnent pas :**

```javascript
// ❌ DANGEREUX - Visible dans le code source !
const apiKey = process.env.AIRTABLE_API_KEY;
```

**Problème :** Tout code JavaScript côté client est visible par l'utilisateur. Les clés API seraient exposées dans le navigateur.

## ✅ **Solutions recommandées**

### **1. Proxy Backend (Recommandé)**

#### Architecture :

```
Frontend (Statique) → Proxy Backend → Airtable API
     (Sécurisé)         (Clés cachées)
```

#### Avantages :

- ✅ Clés API sécurisées côté serveur
- ✅ Contrôle d'accès et rate limiting
- ✅ Logs et monitoring
- ✅ Cache des données

#### Installation :

1. **Installer les dépendances :**

```bash
npm install express cors dotenv
```

2. **Configurer les variables d'environnement :**

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer .env avec vos vraies clés
AIRTABLE_API_KEY=your_real_api_key
AIRTABLE_BASE_ID=your_real_base_id
```

3. **Démarrer le proxy :**

```bash
npm start
```

4. **Déployer le proxy :**

- **Heroku** : `git push heroku main`
- **Vercel** : `vercel deploy`
- **Railway** : Connectez votre repo

### **2. Serverless Functions (Alternative)**

#### Vercel Functions :

```javascript
// api/products.js
export default async function handler(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY; // Sécurisé !

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Produits`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  const data = await response.json();
  res.json(data);
}
```

#### Netlify Functions :

```javascript
// netlify/functions/products.js
exports.handler = async (event, context) => {
  const apiKey = process.env.AIRTABLE_API_KEY; // Sécurisé !
  // ... logique similaire
};
```

### **3. Headless CMS (Solution complète)**

#### Strapi + Airtable :

- Importez vos données Airtable dans Strapi
- API Strapi sécurisée
- Interface d'administration

#### Sanity :

- Migration des données Airtable
- API sécurisée
- Interface de gestion

## 🚀 **Déploiement sécurisé**

### **Option 1 : Proxy Backend**

#### Heroku :

```bash
# Installation
heroku create votre-app-proxy
heroku config:set AIRTABLE_API_KEY=your_key
heroku config:set AIRTABLE_BASE_ID=your_base_id

# Déploiement
git push heroku main
```

#### Railway :

```bash
# Connectez votre repo GitHub
# Ajoutez les variables d'environnement dans le dashboard
# Déploiement automatique
```

### **Option 2 : Serverless**

#### Vercel :

```bash
# Installation
npm install -g vercel
vercel login

# Configuration
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID

# Déploiement
vercel --prod
```

## 🔧 **Configuration du Frontend**

### **Modifier l'URL du proxy :**

```javascript
// script.js - Ligne 45-47
this.proxyUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3001/api/products" // Développement
    : "https://votre-proxy.herokuapp.com/api/products"; // Production
```

## 📊 **Monitoring et Logs**

### **Ajouter des logs au proxy :**

```javascript
// proxy-server.js
app.get("/api/products", async (req, res) => {
  console.log(`📊 Request from: ${req.ip}`);
  console.log(`🕐 Time: ${new Date().toISOString()}`);

  try {
    // ... logique existante
    console.log(`✅ Success: ${products.length} products loaded`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
});
```

### **Rate Limiting :**

```javascript
// Ajouter au proxy
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite à 100 requêtes par IP
});

app.use("/api/", limiter);
```

## 🛡️ **Bonnes pratiques de sécurité**

### **1. Permissions Airtable minimales :**

- ✅ Lecture seule (`data.records:read`)
- ❌ Pas d'écriture
- ❌ Pas d'accès au schéma

### **2. Variables d'environnement :**

```bash
# ✅ Bonnes pratiques
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
AIRTABLE_BASE_ID=app_xxxxxxxxxxxxx
NODE_ENV=production
PORT=3001
```

### **3. CORS Configuration :**

```javascript
// proxy-server.js
app.use(
  cors({
    origin: ["https://votre-domaine.com", "http://localhost:3000"],
    credentials: true,
  })
);
```

### **4. Headers de sécurité :**

```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
```

## 🔍 **Vérification de sécurité**

### **Test de sécurité :**

1. **Vérifiez que les clés ne sont pas exposées :**

```bash
# Dans le navigateur (F12 → Sources)
# Recherchez "AIRTABLE_API_KEY" - ne doit PAS apparaître
```

2. **Testez l'API proxy :**

```bash
curl https://votre-proxy.herokuapp.com/api/products
```

3. **Vérifiez les logs :**

```bash
heroku logs --tail
```

## 📈 **Coûts estimés**

### **Proxy Backend :**

- **Heroku** : Gratuit (hobby) → $7/mois (production)
- **Railway** : $5/mois
- **Vercel** : Gratuit (serverless)

### **Serverless Functions :**

- **Vercel** : Gratuit (100GB bandwidth)
- **Netlify** : Gratuit (125k requests/mois)

## 🎯 **Recommandation finale**

Pour votre cas d'usage, je recommande :

1. **Développement** : Proxy local avec Node.js
2. **Production** : Vercel Functions (gratuit et simple)
3. **Évolution** : Migration vers un CMS dédié (Strapi/Sanity)

---

_Besoin d'aide avec le déploiement ? Consultez la documentation de votre plateforme choisie._
