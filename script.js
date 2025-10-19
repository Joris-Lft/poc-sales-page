// Gestion du thème sombre/clair
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = this.themeToggle.querySelector(".theme-icon");
    this.currentTheme = localStorage.getItem("theme") || "light";

    this.init();
  }

  init() {
    // Appliquer le thème sauvegardé
    this.applyTheme(this.currentTheme);

    // Écouter les clics sur le bouton de thème
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(this.currentTheme);
    localStorage.setItem("theme", this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Mettre à jour l'icône
    if (theme === "dark") {
      this.themeIcon.textContent = "☀️";
      this.themeToggle.setAttribute("aria-label", "Passer au thème clair");
    } else {
      this.themeIcon.textContent = "🌙";
      this.themeToggle.setAttribute("aria-label", "Passer au thème sombre");
    }
  }
}

// Gestion des données via Proxy Backend (sécurisé)
class AirtableManager {
  constructor() {
    // Configuration Vercel Functions
    this.proxyUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/api/products" // Développement local (vercel dev)
        : "https://poc-sales-page.vercel.app/api/products"; // Production Vercel
    this.products = []; // Stocker tous les produits
    this.filteredProducts = []; // Produits filtrés
    this.init();
  }

  init() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.showLoading();
      const products = await this.fetchProducts();
      this.products = products; // Stocker tous les produits
      this.filteredProducts = [...products]; // Copie pour les filtres
      this.renderProducts(this.filteredProducts);
      this.hideLoading();
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      this.showError();
    }
  }

  async fetchProducts() {
    const response = await fetch(this.proxyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur proxy: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Erreur inconnue");
    }

    return data.products;
  }

  renderProducts(products) {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products">
          <p>Aucun produit disponible pour le moment.</p>
        </div>
      `;
      return;
    }

    products.forEach((product) => {
      const productCard = this.createProductCard(product);
      productsGrid.appendChild(productCard);
    });

    // Réinitialiser les animations
    this.initializeAnimations();
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const imageHtml = product.image
      ? `<img src="${product.image.url}" alt="${product.name}" class="product-photo">`
      : `<div class="placeholder-image">🧶</div>`;

    card.innerHTML = `
      <div class="product-image">
        ${imageHtml}
      </div>
      <div class="product-info">
        <h4 class="product-name">${product.name}</h4>
        <p class="product-description">${product.description}</p>
        <div class="product-price">${product.price}€</div>
        <a href="#" class="buy-button" data-product="${product.name}" data-price="${product.price}">
          Acheter maintenant
        </a>
      </div>
    `;

    return card;
  }

  showLoading() {
    const productsGrid = document.querySelector(".products-grid");
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      `;
    }
  }

  hideLoading() {
    const loadingContainer = document.querySelector(".loading-container");
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  showError() {
    const productsGrid = document.querySelector(".products-grid");
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="error-container">
          <p>❌ Erreur lors du chargement des produits</p>
          <button onclick="location.reload()" class="retry-button">Réessayer</button>
        </div>
      `;
    }
  }

  initializeAnimations() {
    // Réinitialiser les animations pour les nouvelles cartes
    const animationManager = new AnimationManager();
  }

  // Méthodes de recherche et tri
  searchProducts(searchTerm) {
    if (!searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }
    this.renderProducts(this.filteredProducts);
    this.updateSearchResults();
  }

  sortProducts(sortType) {
    switch (sortType) {
      case "nom":
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nom-desc":
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "prix-asc":
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "ordre":
      default:
        // Garder l'ordre original d'Airtable
        this.filteredProducts.sort((a, b) => {
          const indexA = this.products.findIndex((p) => p.id === a.id);
          const indexB = this.products.findIndex((p) => p.id === b.id);
          return indexA - indexB;
        });
        break;
    }
    this.renderProducts(this.filteredProducts);
  }

  updateSearchResults() {
    const searchResults = document.getElementById("searchResults");
    const resultsCount = document.getElementById("resultsCount");
    const searchInput = document.getElementById("productSearch");

    if (searchInput.value.trim()) {
      searchResults.style.display = "flex";
      resultsCount.textContent = `${this.filteredProducts.length} produit(s) trouvé(s)`;
    } else {
      searchResults.style.display = "none";
    }
  }

  clearSearch() {
    const searchInput = document.getElementById("productSearch");
    const searchResults = document.getElementById("searchResults");

    searchInput.value = "";
    searchResults.style.display = "none";
    this.filteredProducts = [...this.products];
    this.renderProducts(this.filteredProducts);
  }
}

// Gestion des liens PayPal
class PayPalManager {
  constructor() {
    // REMPLACEZ CETTE ADRESSE EMAIL PAR LA VÔTRE
    this.paypalEmail = "votre-email@paypal.com";
    this.init();
  }

  init() {
    // Écouter les clics sur les boutons d'achat
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("buy-button")) {
        e.preventDefault();
        this.handlePurchase(e.target);
      }
    });
  }

  handlePurchase(button) {
    const productName = button.getAttribute("data-product");
    const price = button.getAttribute("data-price");

    if (!productName || !price) {
      console.error("Informations produit manquantes");
      return;
    }

    // Créer le lien PayPal avec les paramètres pré-remplis
    const paypalUrl = this.generatePayPalUrl(productName, price);

    // Ouvrir PayPal dans un nouvel onglet
    window.open(paypalUrl, "_blank");

    // Animation de feedback
    this.showPurchaseFeedback(button);
  }

  generatePayPalUrl(productName, price) {
    // URL de base PayPal pour les paiements
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr";

    // Paramètres pour le paiement
    const params = new URLSearchParams({
      cmd: "_xclick",
      business: this.paypalEmail,
      item_name: productName,
      amount: price,
      currency_code: "EUR",
      no_shipping: "1",
      return: window.location.href,
      cancel_return: window.location.href,
      notify_url: window.location.href,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  showPurchaseFeedback(button) {
    // Sauvegarder le texte original
    const originalText = button.textContent;

    // Animation de feedback
    button.textContent = "Redirection...";
    button.style.backgroundColor = "#27ae60";

    // Restaurer après 2 secondes
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  }
}

// Gestion des animations et interactions
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Animation d'apparition des cartes produits
    this.observeProductCards();

    // Animation de hover pour les cartes
    this.addHoverEffects();
  }

  observeProductCards() {
    const cards = document.querySelectorAll(".product-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
  }

  addHoverEffects() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });
  }
}

// Gestion de la recherche et du tri
class SearchAndSortManager {
  constructor(airtableManager) {
    this.airtableManager = airtableManager;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Recherche en temps réel avec debounce
    const searchInput = document.getElementById("productSearch");
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.airtableManager.searchProducts(e.target.value);
        }, 300); // Attendre 300ms après la dernière frappe
      });
    }

    // Tri
    const sortSelect = document.getElementById("productSort");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.airtableManager.sortProducts(e.target.value);
      });
    }

    // Effacer la recherche
    const clearButton = document.getElementById("clearSearch");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.airtableManager.clearSearch();
      });
    }

    // Recherche avec Enter
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.airtableManager.searchProducts(e.target.value);
        }
      });
    }

    // Raccourcis clavier
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K pour focuser la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Échap pour effacer la recherche
      if (e.key === "Escape") {
        this.airtableManager.clearSearch();
        if (searchInput) {
          searchInput.blur();
        }
      }
    });
  }
}

// Gestion de la responsivité et des interactions mobiles
class ResponsiveManager {
  constructor() {
    this.init();
  }

  init() {
    // Gérer les interactions tactiles
    this.addTouchSupport();

    // Optimiser pour les petits écrans
    this.optimizeForMobile();
  }

  addTouchSupport() {
    // Améliorer les interactions tactiles
    const buttons = document.querySelectorAll(".buy-button, .theme-toggle");

    buttons.forEach((button) => {
      button.addEventListener("touchstart", (e) => {
        e.target.style.transform = "scale(0.95)";
      });

      button.addEventListener("touchend", (e) => {
        setTimeout(() => {
          e.target.style.transform = "";
        }, 150);
      });
    });
  }

  optimizeForMobile() {
    // Ajuster la taille des éléments pour mobile
    if (window.innerWidth <= 768) {
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) {
        heroTitle.style.fontSize = "2rem";
      }
    }
  }
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser tous les gestionnaires
  new ThemeManager();
  const airtableManager = new AirtableManager(); // Charger les produits depuis Airtable
  new SearchAndSortManager(airtableManager); // Gestionnaire de recherche et tri
  new PayPalManager();
  new AnimationManager();
  new ResponsiveManager();

  // Message de bienvenue dans la console
  console.log("🧶 Crochet Artisan - Landing Page chargée avec succès!");
  console.log("📊 Chargement des produits depuis Airtable...");
  console.log("🔍 Fonctionnalités de recherche et tri activées!");
});

// Gestion des erreurs
window.addEventListener("error", (e) => {
  console.error("Erreur détectée:", e.error);
});

// Service Worker pour la mise en cache (optionnel)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Vous pouvez ajouter un service worker ici si nécessaire
    console.log("Service Worker support détecté");
  });
}
