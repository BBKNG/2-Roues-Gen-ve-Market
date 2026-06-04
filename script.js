const listingsSeed = [
  {
    id: "mt07-2021",
    title: "Yamaha MT-07",
    category: "moto",
    price: 6900,
    km: "12'400 km",
    year: "2021",
    permit: "A",
    location: "Plainpalais",
    expertise: true,
    photos: true,
    tone: "moto",
    description: "Roadster suivi, pneus récents, carnet d'entretien disponible et essai possible sur rendez-vous."
  },
  {
    id: "vespa-125",
    title: "Vespa Primavera 125",
    category: "scooter",
    price: 3800,
    km: "7'900 km",
    year: "2020",
    permit: "A1",
    location: "Carouge",
    expertise: true,
    photos: true,
    tone: "scooter",
    description: "Scooter urbain élégant, top case inclus, idéal pour Genève et les trajets courts."
  },
  {
    id: "trekking-ebike",
    title: "Trekking E-Bike 500 Wh",
    category: "velo",
    price: 1650,
    km: "1'200 km",
    year: "2023",
    permit: "Libre",
    location: "Eaux-Vives",
    expertise: false,
    photos: true,
    tone: "velo",
    description: "Vélo électrique confortable, batterie 500 Wh, porte-bagages et antivol inclus."
  },
  {
    id: "casque-integral",
    title: "Casque intégral touring",
    category: "equipement",
    price: 180,
    km: "Taille M",
    year: "2024",
    permit: "Équipement",
    location: "Meyrin",
    expertise: false,
    photos: true,
    tone: "gear",
    description: "Casque propre avec visière solaire intégrée, housse et pinlock fournis."
  },
  {
    id: "bmw-c400",
    title: "BMW C 400 GT",
    category: "scooter",
    price: 8200,
    km: "4'600 km",
    year: "2022",
    permit: "A",
    location: "Vernier",
    expertise: true,
    photos: true,
    tone: "scooter",
    description: "Maxi-scooter premium, poignées chauffantes, grand coffre et entretien BMW."
  },
  {
    id: "ducati-scrambler",
    title: "Ducati Scrambler Icon",
    category: "moto",
    price: 9400,
    km: "9'200 km",
    year: "2022",
    permit: "A",
    location: "Lancy",
    expertise: true,
    photos: true,
    tone: "moto",
    description: "Moto vive et soignée, échappement homologué, pièces d'origine disponibles."
  }
];

const state = {
  listings: [...listingsSeed],
  activeCategory: "all",
  selectedListing: null,
  appointments: 0
};

const listingGrid = document.querySelector("#listingGrid");
const searchInput = document.querySelector("#searchInput");
const priceRange = document.querySelector("#priceRange");
const priceLabel = document.querySelector("#priceLabel");
const categoryFilters = document.querySelector("#categoryFilters");
const expertiseOnly = document.querySelector("#expertiseOnly");
const photoOnly = document.querySelector("#photoOnly");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const metricListings = document.querySelector("#metricListings");
const metricAppointments = document.querySelector("#metricAppointments");
const adminPending = document.querySelector("#adminPending");
const adminMeetings = document.querySelector("#adminMeetings");
const themeToggle = document.querySelector("#themeToggle");
const sellerForm = document.querySelector("#sellerForm");
const sellerPreview = document.querySelector("#sellerPreview");
const sellerMessage = document.querySelector("#sellerMessage");
const dialog = document.querySelector("#vehicleDialog");
const dialogClose = document.querySelector("#dialogClose");
const dialogVisual = document.querySelector("#dialogVisual");
const dialogCategory = document.querySelector("#dialogCategory");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
const dialogSpecs = document.querySelector("#dialogSpecs");
const appointmentForm = document.querySelector("#appointmentForm");
const appointmentMessage = document.querySelector("#appointmentMessage");

function formatPrice(value) {
  return `CHF ${Number(value).toLocaleString("fr-CH").replace(/\u202f/g, "'")}`;
}

function categoryLabel(category) {
  const labels = {
    moto: "Moto",
    scooter: "Scooter",
    velo: "Vélo électrique",
    equipement: "Équipement"
  };
  return labels[category] || "Annonce";
}

function getFilteredListings() {
  const query = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(priceRange.value);

  return state.listings.filter((listing) => {
    const haystack = `${listing.title} ${listing.location} ${listing.permit} ${listing.description}`.toLowerCase();
    const matchesQuery = haystack.includes(query);
    const matchesCategory = state.activeCategory === "all" || listing.category === state.activeCategory;
    const matchesPrice = listing.price <= maxPrice;
    const matchesExpertise = !expertiseOnly.checked || listing.expertise;
    const matchesPhotos = !photoOnly.checked || listing.photos;

    return matchesQuery && matchesCategory && matchesPrice && matchesExpertise && matchesPhotos;
  });
}

function renderListings() {
  const filtered = getFilteredListings();
  listingGrid.innerHTML = filtered
    .map((listing) => {
      const tags = [
        listing.expertise ? "Expertisé" : "À vérifier",
        listing.photos ? "Photos" : "Sans photo",
        listing.permit
      ];

      return `
        <article class="listing-card">
          <button class="listing-button" type="button" data-id="${listing.id}">
            <span class="listing-media ${listing.tone}">
              <span class="vehicle-art ${listing.tone}-art" aria-hidden="true"></span>
            </span>
            <span class="listing-body">
              <span class="listing-meta">${categoryLabel(listing.category)} · ${listing.location}</span>
              <strong>${listing.title}</strong>
              <span>${listing.year} · ${listing.km}</span>
              <span class="tag-row">${tags.map((tag) => `<em>${tag}</em>`).join("")}</span>
              <span class="price-line">${formatPrice(listing.price)}</span>
            </span>
          </button>
        </article>
      `;
    })
    .join("");

  emptyState.hidden = filtered.length > 0;
  resultCount.textContent = `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`;
  metricListings.textContent = state.listings.length;
  adminPending.textContent = state.listings.filter((listing) => !listing.expertise).length;

  document.querySelectorAll(".listing-button").forEach((button) => {
    button.addEventListener("click", () => openListing(button.dataset.id));
  });
}

function updatePriceLabel() {
  priceLabel.textContent = formatPrice(priceRange.value);
}

function openListing(id) {
  const listing = state.listings.find((item) => item.id === id);
  if (!listing) {
    return;
  }

  state.selectedListing = listing;
  dialogVisual.className = `dialog-visual ${listing.tone}`;
  dialogVisual.innerHTML = `<span class="vehicle-art ${listing.tone}-art" aria-hidden="true"></span>`;
  dialogCategory.textContent = categoryLabel(listing.category);
  dialogTitle.textContent = listing.title;
  dialogDescription.textContent = listing.description;
  dialogSpecs.innerHTML = `
    <div><dt>Prix</dt><dd>${formatPrice(listing.price)}</dd></div>
    <div><dt>Année</dt><dd>${listing.year}</dd></div>
    <div><dt>Kilométrage</dt><dd>${listing.km}</dd></div>
    <div><dt>Permis</dt><dd>${listing.permit}</dd></div>
    <div><dt>Lieu</dt><dd>${listing.location}</dd></div>
    <div><dt>Statut</dt><dd>${listing.expertise ? "Expertisé" : "À vérifier"}</dd></div>
  `;
  appointmentMessage.textContent = "";
  appointmentForm.reset();
  dialog.showModal();
}

function updateTheme() {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  localStorage.setItem("theme", document.documentElement.dataset.theme);
}

function renderSellerPreview(form) {
  const formData = new FormData(form);
  const title = formData.get("title") || "Prévisualisation";
  const category = formData.get("category") || "moto";
  const price = formData.get("price") || "0";
  const tone = category === "equipement" ? "gear" : category;

  sellerPreview.innerHTML = `
    <span class="vehicle-art ${tone}-art" aria-hidden="true"></span>
    <div>
      <strong>${title}</strong>
      <span>${categoryLabel(category)} · ${formatPrice(price)}</span>
    </div>
  `;
}

function addSellerListing(event) {
  event.preventDefault();
  const formData = new FormData(sellerForm);
  const category = formData.get("category");
  const title = formData.get("title").trim();
  const price = Number(formData.get("price"));
  const location = formData.get("location").trim();
  const description = formData.get("description").trim();
  const tone = category === "equipement" ? "gear" : category;

  const listing = {
    id: `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title,
    category,
    price,
    km: formData.get("km") || "Non indiqué",
    year: "Nouveau",
    permit: category === "velo" || category === "equipement" ? "Libre" : "À préciser",
    location,
    expertise: formData.get("expertise") === "on",
    photos: formData.get("photos") === "on",
    tone,
    description
  };

  state.listings.unshift(listing);
  sellerMessage.textContent = "Annonce ajoutée à la sélection locale.";
  sellerForm.reset();
  renderSellerPreview(sellerForm);
  renderListings();
  document.querySelector("#annonces").scrollIntoView({ behavior: "smooth", block: "start" });
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) {
    return;
  }

  state.activeCategory = button.dataset.category;
  categoryFilters.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  renderListings();
});

[searchInput, priceRange, expertiseOnly, photoOnly].forEach((control) => {
  control.addEventListener("input", () => {
    updatePriceLabel();
    renderListings();
  });
});

themeToggle.addEventListener("click", updateTheme);

sellerForm.addEventListener("input", () => renderSellerPreview(sellerForm));
sellerForm.addEventListener("submit", addSellerListing);

dialogClose.addEventListener("click", () => dialog.close());

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(appointmentForm);
  const date = formData.get("date");
  const name = formData.get("name");
  state.appointments += 1;
  appointmentMessage.textContent = `${name}, votre demande pour ${state.selectedListing.title} est enregistrée pour le ${date}.`;
  metricAppointments.textContent = state.appointments;
  adminMeetings.textContent = state.appointments;
  appointmentForm.reset();
});

document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";
updatePriceLabel();
renderSellerPreview(sellerForm);
renderListings();
