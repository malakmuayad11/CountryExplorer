"use strict";

import {
  getAllCountries,
  getCountryByName,
  getByRegion,
  getCountryByCode,
} from "./api.js";

import {
  addToFavoriteCountries,
  addToTheme,
  getFromLocalStorage,
} from "./storage.js";

const UI = {
  countriesContainer: document.getElementById("countries-container"),
  searchCountries: document.getElementById("searchCountry"),
  filterByRegion: document.getElementById("filterByRegion"),
  allLink: document.getElementById("all-link"),
  favoritesLink: document.getElementById("favorites-link"),
  loading: document.getElementById("loading"),
  toast: document.getElementById("toast"),
  root: document.documentElement,
  themeToggleBtn: document.getElementById("themeToggle"),
};

let favoriteCountries = JSON.parse(getFromLocalStorage()) || [];

function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function getLanguages(country) {
  let results = "";

  for (const [k, v] of Object.entries(country.languages)) results += v + ", ";
  return results.slice(0, -2);
}

function getBorders(country) {
  if (country.borders.length === 0) return "N/A";

  let results = "";
  country.borders.forEach((b) => {
    results += `<button class="borders">${b}</button>`;
  });
  return results;
}

function handleCheckedStatus(countryName) {
  return favoriteCountries.includes(countryName) ? "checked" : "";
}

// Returns template to fill in the webpage for each country
function fillTemplate(country) {
  return `<div class="country-card">
        <figure><img src="${country.flag}" alt="${country.name}'s Flag" width="150" height="70" loading="lazy">
        <figcaption>${country.name}</figcaption></figure>
        <p class="muted"><span class="bolder">Region:</span> ${country.region}</p>
        <div class="favoriteCheckBox">
          <input type="checkbox" name="favorite-check" id="favorite-check" ${handleCheckedStatus(country.name)}>
          <label for="favorite-check">Add to favorites</label>
        </div>
        <details>
          <summary>Click to view details</summary>
          <p class="muted"><span class="bolder">Capital:</span> ${country.capital}</p>
          <p class="muted"><span class="bolder">Population:</span> ${country.population}</p>
          <p class="muted"><span class="bolder">Languages:</span> ${getLanguages(country)}</p>
          <div class="row-buttons"><span class="bolder">Borders:</span> ${getBorders(country)}</p>
        </details>
      </div>`;
}

// Show/hide loading area (spinner)
function setLoading(isLoading) {
  UI.loading.style.display = isLoading ? "flex" : "none";
}

// loads all countries into the webpage
async function loadAllCountries() {
  setLoading(true);

  try {
    const countries = await getAllCountries();
    let results = "";

    for (let c of countries) results += fillTemplate(c);
    UI.countriesContainer.innerHTML = results;
  } catch (error) {
    console.log(error);
    UI.countriesContainer.innerHTML = "<p>Failed to load countries</p>";
  } finally {
    setLoading(false);
  }
}

async function searchCountry() {
  const countryName = UI.searchCountries.value.trim();
  if (countryName === "") {
    loadAllCountries();
    return;
  }
  setLoading(true);
  try {
    UI.filterByRegion.value = "";
    UI.countriesContainer.innerHTML = fillTemplate(
      await getCountryByName(countryName),
    );
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

async function searchCountryByCode(countryCode) {
  if (!countryCode) return;
  setLoading(true);
  try {
    UI.filterByRegion.value = "";
    UI.countriesContainer.innerHTML = fillTemplate(
      await getCountryByCode(countryCode),
    );
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

async function filterRegion() {
  const region = UI.filterByRegion.value;
  if (region === "") {
    loadAllCountries();
    return;
  }
  setLoading(true);
  try {
    UI.searchCountries.value = "";
    let results = "";
    const countries = await getByRegion(region);
    for (let c of countries) results += fillTemplate(c);
    UI.countriesContainer.innerHTML = results;
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

async function showFavoriteCountries() {
  setLoading(true);
  try {
    let results = "";
    for (let country of favoriteCountries)
      results += fillTemplate(await getCountryByName(country));
    UI.countriesContainer.innerHTML = results;
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

// Show a temporary message in the bottom-right corner
function showToast(message) {
  UI.toast.textContent = message;
  UI.toast.style.display = "block";
  setTimeout(() => (UI.toast.style.display = "none"), 2200);
}

function applyTheme(theme) {
  UI.root.setAttribute("data-theme", theme);
  addToTheme(theme);
  UI.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark")); // reflect state
  UI.themeToggleBtn.querySelector("span").textContent =
    theme === "dark" ? "Light Mode" : "Dark Mode"; // user-friendly label
}

// Handles adding to or removing from favorite countries
function handleFavorites(e) {
  if (!e.target.matches("input")) return;

  const countryName = e.target
    .closest(".country-card")
    ?.querySelector("figcaption")?.textContent;

  if (!countryName) return;

  if (e.target.checked) {
    favoriteCountries.push(countryName);
    addToFavoriteCountries(JSON.stringify(favoriteCountries));
    showToast("✅ Country is added to favorites successfully!");
  } else {
    // The checkbox is unchecked, so we remove the country from favorits
    favoriteCountries = favoriteCountries.filter((c) => c !== countryName);
    addToFavoriteCountries(JSON.stringify(favoriteCountries));
    showToast("✅ Country is removed from favorites.");
  }
}

// Handles clicking a country's border
async function clickBorder(e) {
  if (!e.target.matches(".borders")) return;
  await searchCountryByCode(e.target.textContent);
}

function flipTheme() {
  const next = UI.root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
}

// Click handler flips theme
UI.themeToggleBtn.addEventListener("click", flipTheme);

// Initialize UI from current attribute or default to light
applyTheme(UI.root.getAttribute("data-theme") || "light");

await loadAllCountries(); // Initialy load all countries in the webpage

// Adding events for controls
UI.searchCountries.addEventListener("input", debounce(searchCountry, 800));
UI.filterByRegion.addEventListener("change", filterRegion);
UI.countriesContainer.addEventListener("change", handleFavorites);
UI.favoritesLink.addEventListener("click", showFavoriteCountries);
UI.allLink.addEventListener("click", loadAllCountries);
UI.countriesContainer.addEventListener("click", clickBorder);
