# 🚀 Guide de Déploiement - GitHub Pages + Vercel

## ⚡ **Déploiement rapide (15 minutes)**

### **Étape 1 : Préparer le repository GitHub**

```bash
# 1. Initialiser le repository
git init
git add .
git commit -m "Initial commit: Landing page crochet avec Vercel"

# 2. Créer le repository sur GitHub
# Allez sur github.com → New repository
# Nom : crochet-landing-page
# Public ou Private

# 3. Connecter et pousser
git remote add origin https://github.com/votre-username/crochet-landing-page.git
git push -u origin main
```

### **Étape 2 : Activer GitHub Pages**

1. **Dans votre repository GitHub :**

   - Settings → Pages
   - Source : Deploy from a branch
   - Branch : main
   - Folder : / (root)
   - Save

2. **Attendre 2-3 minutes**
3. **Votre site sera disponible sur :**
   ```
   https://votre-username.github.io/crochet-landing-page
   ```

### **Étape 3 : Configurer Vercel Functions**

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import Project :**

   - Sélectionner votre repository
   - Framework Preset : Other
   - Root Directory : ./
   - Deploy

4. **Configurer les variables d'environnement :**

   - Dashboard Vercel → Settings → Environment Variables
   - Ajouter :
     ```
     AIRTABLE_PERSONAL_ACCESS_TOKEN = votre_personal_access_token
     AIRTABLE_BASE_ID = votre_base_id
     ```

5. **Récupérer l'URL de votre fonction :**
   ```
   https://votre-projet.vercel.app/api/products
   ```

### **Étape 4 : Mettre à jour l'URL dans le code**

```javascript
// script.js - Ligne 47
this.proxyUrl = "https://votre-projet.vercel.app/api/products";
```

**Commit et push :**

```bash
git add script.js
git commit -m "Update Vercel URL"
git push
```

## 🔧 **Configuration Airtable**

### **1. Créer la base Airtable :**

1. **Aller sur [airtable.com](https://airtable.com)**
2. **Créer une nouvelle base : "Produits Crochet"**
3. **Configurer les colonnes :**

| Nom de la colonne | Type             | Description           |
| ----------------- | ---------------- | --------------------- |
| `Nom`             | Single line text | Nom du produit        |
| `Description`     | Long text        | Description détaillée |
| `Prix`            | Number           | Prix en euros         |
| `Image`           | Attachment       | Photo du produit      |
| `Actif`           | Checkbox         | Produit visible       |
| `Ordre`           | Number           | Ordre d'affichage     |

### **2. Ajouter des produits d'exemple :**

| Nom                | Description             | Prix | Actif | Ordre |
| ------------------ | ----------------------- | ---- | ----- | ----- |
| Sac à Main Crochet | Sac élégant en coton    | 25   | ✅    | 1     |
| Écharpe Hiver      | Écharpe douce et chaude | 35   | ✅    | 2     |
| Coussin Décoratif  | Coussin coloré          | 20   | ✅    | 3     |

### **3. Obtenir les clés API :**

1. **Personal Access Token :**

   - [airtable.com/account](https://airtable.com/account)
   - Developer Hub → Personal access tokens
   - Create new token
   - **Nom** : "Crochet Artisan API"
   - **Scopes** : `data.records:read` uniquement
   - **Bases** : Sélectionnez votre base "Produits Crochet"
   - Copier le token (⚠️ visible une seule fois !)

2. **Base ID :**
   - [airtable.com/api](https://airtable.com/api)
   - Sélectionner votre base
   - Copier l'ID (commence par `app...`)

## 🧪 **Test de l'architecture**

### **1. Test de l'API Vercel :**

```bash
# Tester directement l'API
curl https://votre-projet.vercel.app/api/products

# Réponse attendue :
{
  "success": true,
  "products": [
    {
      "id": "rec...",
      "name": "Sac à Main Crochet",
      "description": "Sac élégant en coton",
      "price": 25,
      "image": {...},
      "active": true
    }
  ]
}
```

### **2. Test du site complet :**

1. **Ouvrir :** `https://votre-username.github.io/crochet-landing-page`
2. **Vérifier :** Les produits s'affichent
3. **Console (F12) :** Pas d'erreurs
4. **Test PayPal :** Cliquer sur "Acheter maintenant"

## 🔍 **Dépannage**

### **Erreur CORS :**

```javascript
// Vérifier dans api/products.js
res.setHeader("Access-Control-Allow-Origin", "*");
```

### **Variables d'environnement :**

- Vérifier dans Vercel Dashboard → Settings → Environment Variables
- Redéployer après modification

### **Produits ne s'affichent pas :**

- Vérifier la console (F12)
- Tester l'API directement
- Vérifier les colonnes Airtable

## 📊 **Monitoring**

### **Vercel Dashboard :**

- **Functions** → Voir les logs
- **Analytics** → Statistiques d'utilisation
- **Deployments** → Historique des déploiements

### **GitHub Pages :**

- **Actions** → Voir les déploiements
- **Settings** → Pages → Voir les logs

## 🎯 **Résultat final**

Vous aurez :

- ✅ **Site statique** sur GitHub Pages (gratuit)
- ✅ **API sécurisée** sur Vercel (gratuit)
- ✅ **Base de données** sur Airtable (gratuit)
- ✅ **Paiements** via PayPal
- ✅ **SEO optimisé**
- ✅ **Responsive design**

**URL finale :** `https://votre-username.github.io/crochet-landing-page`

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

---

_Besoin d'aide ? Consultez [ARCHITECTURE_EXPLANATION.md](ARCHITECTURE_EXPLANATION.md)_
