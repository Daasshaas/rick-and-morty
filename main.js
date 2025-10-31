const API_URL = "https://rickandmortyapi.com/api/episode";
const cardsContainer = document.querySelector(".cards");
const searchInput = document.getElementById("searchInput");
const seasonSelect = document.getElementById("seasonSelect");
const notFound = document.querySelector(".not-found");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");

let allEpisodes = [];

async function loadEpisodes() {
  let page = 1;
  let results = [];
  while (true) {
    const res = await fetch(`${API_URL}?page=${page}`);
    const data = await res.json();
    results = results.concat(data.results);
    if (!data.info.next) break;
    page++;
  }
  allEpisodes = results;
  renderEpisodes(allEpisodes);
}

function renderEpisodes(episodes) {
  cardsContainer.innerHTML = "";

  if (episodes.length === 0) {
    notFound.style.display = "block";
    return;
  } else {
    notFound.style.display = "none";
  }

  episodes.forEach((ep) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="https://static.wikia.nocookie.net/rickandmorty/images/4/4a/RickandMortyTitleCard.png" alt="${ep.name}">
      <h3>${ep.name}</h3>
      <p>${ep.air_date}</p>
    `;
    card.addEventListener("click", () => openModal(ep));
    cardsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  filterEpisodes();
});

seasonSelect.addEventListener("change", () => {
  filterEpisodes();
});

function filterEpisodes() {
  const searchValue = searchInput.value.toLowerCase();
  const seasonValue = seasonSelect.value;

  let filtered = allEpisodes.filter((ep) =>
    ep.name.toLowerCase().includes(searchValue)
  );

  if (seasonValue !== "all") {
    filtered = filtered.filter((ep) =>
      ep.episode.startsWith(`S${seasonValue.padStart(2, "0")}`)
    );
  }

  renderEpisodes(filtered);
}

async function openModal(ep) {
  modal.style.display = "flex";
  document.querySelector(".episode-title").textContent = ep.name;
  document.querySelector(".episode-id").textContent = ep.id;
  document.querySelector(".episode-date").textContent = ep.air_date;

  const charContainer = document.querySelector(".characters");
  charContainer.innerHTML = "";

  for (let url of ep.characters.slice(0, 5)) {
    const res = await fetch(url);
    const data = await res.json();

    const charEl = document.createElement("div");
    charEl.classList.add("character");
    charEl.innerHTML = `
      <img src="${data.image}" alt="${data.name}">
      <p>${data.name}</p>
    `;
    charContainer.appendChild(charEl);
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

loadEpisodes();
