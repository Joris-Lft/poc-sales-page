# 🧶 Crochet Artisan - Landing Page

Une landing page moderne et responsive pour vendre des produits de crochet faits main, avec gestion des produits via **Airtable CMS** et sécurité **Vercel Functions**.

## ✨ Fonctionnalités

- **Design minimaliste** avec thème sombre/clair
- **Responsive** - s'adapte à tous les écrans
- **SEO optimisé** - Meta tags, structured data, Open Graph
- **CMS Airtable** - Gestion des produits sans toucher au code
- **Sécurité Vercel** - Clés API protégées avec serverless functions
- **Liens PayPal** pré-configurés avec prix et nom du produit
- **Images dynamiques** depuis Airtable
- **Animations fluides** et interactions tactiles
- **Accessibilité** optimisée

## 🚀 Démarrage rapide

### **Option 1 : Déploiement complet (Recommandé)**

1. **Suivez le [Guide de déploiement](doc/DEPLOYMENT_GUIDE.md)** pour un déploiement complet en 15 minutes
2. **Architecture :** GitHub Pages + Vercel Functions + Airtable

### **Option 2 : Développement local**

1. Téléchargez tous les fichiers dans un dossier
2. **Configurez Airtable** (voir [Guide Airtable](doc/AIRTABLE_SETUP.md))
3. **Configurez Vercel** (voir [Guide Vercel](doc/VERCEL_SECURITY_GUIDE.md))
4. **Configurez PayPal** (voir section Configuration)
5. Ouvrez `index.html` dans votre navigateur

## ⚙️ Configuration

### **Configuration PayPal**

Pour activer les liens PayPal, modifiez le fichier `script.js` :

```javascript
// Ligne 181 dans script.js
this.paypalEmail = "votre-email@paypal.com";
```

Remplacez `votre-email@paypal.com` par votre adresse email PayPal.

## 📁 Structure du projet

```
├── index.html              # Page principale (SEO optimisé)
├── styles.css              # Styles CSS avec thèmes
├── script.js               # JavaScript pour interactions et Vercel
├── api/products.js         # Vercel serverless function (sécurisé)
├── vercel.json             # Configuration Vercel
├── README.md               # Documentation principale
└── doc/                    # Documentation complète
    ├── AIRTABLE_SETUP.md             # Guide de configuration Airtable
    ├── VERCEL_SECURITY_GUIDE.md      # Guide de sécurité Vercel
    ├── ARCHITECTURE_EXPLANATION.md  # Explication de l'architecture
    └── DEPLOYMENT_GUIDE.md           # Guide de déploiement rapide
```

## 🎨 Personnalisation

### **Gestion des produits via Airtable**

Les produits sont gérés depuis Airtable ! Plus besoin de modifier le code :

1. **Ajouter un produit** : Créez un nouvel enregistrement dans Airtable
2. **Modifier un produit** : Éditez directement dans Airtable
3. **Masquer un produit** : Décochez la case "Actif"
4. **Changer l'ordre** : Modifiez la colonne "Ordre"

### **Structure Airtable requise :**

- `Nom` : Nom du produit
- `Description` : Description détaillée
- `Prix` : Prix en euros
- `Image` : Photo du produit (optionnel)
- `Actif` : Produit visible (checkbox)
- `Ordre` : Ordre d'affichage (nombre)

### **Modifier les couleurs**

Les couleurs sont définies dans les variables CSS au début de `styles.css` :

```css
:root {
  --accent-color: #e74c3c; /* Couleur principale */
  --bg-primary: #ffffff; /* Arrière-plan principal */
  /* ... autres variables */
}
```

## 📱 Responsive Design

La page s'adapte automatiquement :

- **Desktop** : Grille 3 colonnes
- **Tablet** : Grille 2 colonnes
- **Mobile** : 1 colonne

## 🌙 Thème sombre/clair

Le thème est sauvegardé dans le localStorage du navigateur et se souvient du choix de l'utilisateur.

## 🔧 Technologies utilisées

- **HTML5** - Structure sémantique avec SEO optimisé
- **CSS3** - Variables, Grid, Flexbox, Animations
- **JavaScript ES6+** - Classes, Modules, LocalStorage, Fetch API
- **Vercel Functions** - Serverless functions sécurisées
- **Airtable API** - CMS pour la gestion des produits
- **PayPal API** - Intégration paiements

## 📚 Documentation

- **[Guide de déploiement](doc/DEPLOYMENT_GUIDE.md)** - Déploiement rapide en 15 minutes
- **[Guide Airtable](doc/AIRTABLE_SETUP.md)** - Configuration de la base de données
- **[Guide Vercel](doc/VERCEL_SECURITY_GUIDE.md)** - Sécurité et serverless functions
- **[Architecture](doc/ARCHITECTURE_EXPLANATION.md)** - Explication détaillée du fonctionnement

## 📞 Support

Pour toute question ou personnalisation, n'hésitez pas à me contacter !

---

_Fait avec ❤️ pour les artisans du crochet_
