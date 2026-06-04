const filterButtons = document.querySelectorAll(".filter");
const listings = document.querySelectorAll(".listing-card");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const alertForm = document.querySelector("#alertForm");
const formMessage = document.querySelector("#formMessage");

let activeFilter = "all";

function updateListings() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  listings.forEach((listing) => {
    const matchesFilter = activeFilter === "all" || listing.dataset.category === activeFilter;
    const matchesSearch = listing.dataset.title.includes(searchTerm);
    const shouldShow = matchesFilter && matchesSearch;

    listing.hidden = !shouldShow;
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeFilter = button.dataset.filter;
    updateListings();
  });
});

searchInput.addEventListener("input", updateListings);

alertForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(alertForm);
  const email = formData.get("email");

  formMessage.textContent = `${email} recevra les prochaines annonces.`;
  alertForm.reset();
});
