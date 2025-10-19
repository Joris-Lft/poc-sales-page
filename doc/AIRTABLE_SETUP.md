# 📊 Configuration Airtable pour Crochet Artisan

Ce guide vous explique comment configurer Airtable comme CMS pour votre landing page de produits de crochet.

## 🚀 Étape 1 : Créer une base Airtable

1. **Créer un compte Airtable** : Allez sur [airtable.com](https://airtable.com) et créez un compte
2. **Créer une nouvelle base** : Cliquez sur "Add a base" → "Start from scratch"
3. **Nommer votre base** : "Produits Crochet" (ou le nom de votre choix)

## 📋 Étape 2 : Configurer la table "Produits"

### Structure des colonnes :

| Nom de la colonne | Type             | Description                    | Obligatoire |
| ----------------- | ---------------- | ------------------------------ | ----------- |
| `Nom`             | Single line text | Nom du produit                 | ✅          |
| `Description`     | Long text        | Description détaillée          | ✅          |
| `Prix`            | Number           | Prix en euros (ex: 25.50)      | ✅          |
| `Image`           | Attachment       | Photo du produit               | ❌          |
| `Actif`           | Checkbox         | Produit visible sur le site    | ✅          |
| `Ordre`           | Number           | Ordre d'affichage (1, 2, 3...) | ✅          |

### Configuration des colonnes :

1. **Nom** : Single line text
2. **Description** : Long text
3. **Prix** : Number → Format : Currency → Euro (€)
4. **Image** : Attachment → Allow multiple files : No
5. **Actif** : Checkbox → Default value : Checked
6. **Ordre** : Number → Format : Integer

## 🔑 Étape 3 : Obtenir les clés API

### Personal Access Token :

1. Allez sur [airtable.com/account](https://airtable.com/account)
2. Dans la section "Developer Hub", cliquez sur "Personal access tokens"
3. Cliquez sur "Create new token"
4. **Nom du token** : "Crochet Artisan API"
5. **Scopes** : Sélectionnez uniquement les permissions nécessaires :
   - ✅ `data.records:read` (lecture des enregistrements)
   - ❌ `data.records:write` (écriture - pas nécessaire)
   - ❌ `schema.bases:read` (lecture du schéma - pas nécessaire)
6. **Bases** : Sélectionnez votre base "Produits Crochet"
7. Cliquez sur "Create token"
8. **⚠️ IMPORTANT** : Copiez le token immédiatement, il ne sera plus visible après !

### Base ID :

1. Ouvrez votre base Airtable
2. Allez sur [airtable.com/api](https://airtable.com/api)
3. Sélectionnez votre base
4. Copiez l'ID de la base (commence par `app...`)

## ⚙️ Étape 4 : Configurer le code

Modifiez le fichier `script.js` aux lignes 45-47 :

```javascript
// CONFIGURATION AIRTABLE - Remplacez par vos vraies valeurs
this.personalAccessToken = "YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN"; // Votre Personal Access Token
this.baseId = "YOUR_AIRTABLE_BASE_ID"; // Votre ID de base
this.tableName = "Produits"; // Nom de votre table
```

## 📝 Étape 5 : Ajouter vos produits

### Exemple de données :

| Nom                | Description                                       | Prix | Image       | Actif | Ordre |
| ------------------ | ------------------------------------------------- | ---- | ----------- | ----- | ----- |
| Sac à Main Crochet | Sac élégant en coton, parfait pour tous les jours | 25   | [photo.jpg] | ✅    | 1     |
| Écharpe Hiver      | Écharpe douce et chaude en laine merinos          | 35   | [photo.jpg] | ✅    | 2     |
| Coussin Décoratif  | Coussin coloré pour égayer votre salon            | 20   | [photo.jpg] | ✅    | 3     |

### Conseils :

- **Images** : Format recommandé JPG/PNG, taille optimale 400x400px
- **Ordre** : Utilisez des nombres entiers (1, 2, 3...) pour contrôler l'affichage
- **Actif** : Décochez pour masquer temporairement un produit
- **Prix** : Utilisez le point comme séparateur décimal (25.50)

## 🔒 Étape 6 : Sécurité (Important !)

⚠️ **ATTENTION** : Les clés API sont visibles dans le code JavaScript côté client.

### Solutions recommandées :

1. **Pour le développement** : Utilisez des clés de test
2. **Pour la production** : Limitez les permissions de votre token API
3. **Alternative sécurisée** : Créez un proxy backend (Node.js/PHP) qui cache vos clés

### Permissions API recommandées :

- ✅ `data.records:read` (lecture des enregistrements)
- ❌ `data.records:write` (écriture - pas nécessaire)
- ❌ `schema.bases:read` (lecture du schéma - pas nécessaire)

## 🧪 Étape 7 : Tester la configuration

1. **Ouvrez votre landing page** dans le navigateur
2. **Ouvrez la console** (F12 → Console)
3. **Vérifiez les messages** :
   - ✅ "🧶 Crochet Artisan - Landing Page chargée avec succès!"
   - ✅ "📊 Chargement des produits depuis Airtable..."
   - ✅ Pas d'erreurs en rouge

## 🐛 Dépannage

### Erreur "401 Unauthorized" :

- Vérifiez votre Personal Access Token
- Vérifiez que le token a les bonnes permissions (data.records:read)
- Vérifiez que le token a accès à votre base spécifique

### Erreur "404 Not Found" :

- Vérifiez votre Base ID
- Vérifiez le nom de la table (doit être exactement "Produits")

### Produits ne s'affichent pas :

- Vérifiez que la colonne "Actif" est cochée
- Vérifiez que les colonnes ont les bons noms
- Vérifiez la console pour les erreurs

### Images ne s'affichent pas :

- Vérifiez que les images sont bien uploadées dans Airtable
- Vérifiez que le format est supporté (JPG, PNG)

## 📈 Fonctionnalités avancées

### Filtrage par catégorie :

Ajoutez une colonne "Catégorie" et modifiez la requête API :

```javascript
const url = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}?filterByFormula=AND({Actif}=1,{Catégorie}='Accessoires')`;
```

### Tri personnalisé :

Modifiez le paramètre de tri :

```javascript
const url = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}?sort[0][field]=Prix&sort[0][direction]=desc`;
```

## 🎯 Avantages de cette approche

✅ **Gestion facile** : Ajoutez/modifiez des produits sans toucher au code
✅ **Images intégrées** : Upload direct dans Airtable
✅ **Contrôle de visibilité** : Activez/désactivez des produits
✅ **Ordre personnalisé** : Organisez vos produits comme vous voulez
✅ **Synchronisation temps réel** : Les changements apparaissent immédiatement

---

_Besoin d'aide ? Consultez la [documentation Airtable API](https://airtable.com/developers/web/api/introduction)_
