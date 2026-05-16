"use strict";

import {
  getAllCountries,
  getCountryByName,
  getByRegion,
  getCountryByCode,
  Country,
} from "./api.js";

import { Storage } from "./storage.js";

const UI = {
  countriesContainer: document.getElementById(
    "countries-container",
  ) as HTMLDivElement,
  searchCountries: document.getElementById("searchCountry") as HTMLInputElement,
  filterByRegion: document.getElementById(
    "filterByRegion",
  ) as HTMLSelectElement,
  allLink: document.getElementById("all-link") as HTMLAnchorElement,
  favoritesLink: document.getElementById("favorites-link") as HTMLAnchorElement,
  loading: document.getElementById("loading") as HTMLDivElement,
  toast: document.getElementById("toast") as HTMLDivElement,
  root: document.documentElement as HTMLElement,
  themeToggleBtn: document.getElementById("themeToggle") as HTMLButtonElement,
};

let favoriteCountries: Set<string>;

try {
  favoriteCountries = new Set<string>(
    JSON.parse(Storage.getFavoriteCountries() || "[]"),
  );
} catch {
  favoriteCountries = new Set<string>();
}

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function getLanguages(country: Country): string {
  let results: string = "";

  for (const [k, v] of Object.entries(country.languages)) results += v + ", ";
  return results.slice(0, -2);
}

function getBorders(country: Country): string {
  if (country.borders.length === 0) return "N/A";

  let results: string = "";
  country.borders.forEach((b: string) => {
    results += `<button class="borders">${b}</button>`;
  });
  return results;
}

function handleCheckedStatus(countryName: string): string {
  return favoriteCountries.has(countryName) ? "checked" : "";
}

// Returns template to fill in the webpage for each country
function fillTemplate(country: Country): string {
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
function setLoading(isLoading: boolean): void {
  UI.loading.style.display = isLoading ? "flex" : "none";
}

// loads all countries into the webpage
async function loadAllCountries(): Promise<void> {
  setLoading(true);

  try {
    const countries: Country[] | undefined = await getAllCountries();
    if (typeof countries === "undefined") return;

    UI.countriesContainer.innerHTML = countries.map(fillTemplate).join("");
  } catch (error) {
    console.log(error);
    UI.countriesContainer.innerHTML = "<p>Failed to load countries</p>";
  } finally {
    setLoading(false);
  }
}

async function searchCountry(): Promise<void> {
  const countryName: string = UI.searchCountries.value.trim();
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

async function searchCountryByCode(countryCode: string): Promise<void> {
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

async function filterRegion(): Promise<void> {
  const region: string = UI.filterByRegion.value;
  if (region === "") {
    loadAllCountries();
    return;
  }
  setLoading(true);
  try {
    UI.searchCountries.value = "";
    let results: string = "";
    const countries: Country[] | undefined = await getByRegion(region);
    if (typeof countries === "undefined") return;
    for (let c of countries) results += fillTemplate(c);
    UI.countriesContainer.innerHTML = results;
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

async function showFavoriteCountries(): Promise<void> {
  setLoading(true);
  try {
    const countries: Country[] = await Promise.all(
      [...favoriteCountries].map((c) => getCountryByName(c)),
    );
    UI.countriesContainer.innerHTML = countries.map(fillTemplate).join("");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

// Show a temporary message in the bottom-right corner
function showToast(message: string): void {
  UI.toast.textContent = message;
  UI.toast.style.display = "block";
  setTimeout(() => (UI.toast.style.display = "none"), 2200);
}

function applyTheme(theme: string): void {
  UI.root.setAttribute("data-theme", theme);
  Storage.addToTheme(theme);
  UI.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark")); // reflect state

  const span: HTMLSpanElement | null = UI.themeToggleBtn.querySelector("span");
  if (!span) return;
  span.textContent = theme === "dark" ? "Light Mode" : "Dark Mode"; // user-friendly label
}

// Handles adding to or removing from favorite countries
function handleFavorites(e: Event): void {
  const element = e.target as HTMLElement;
  if (!element.matches("input")) return;

  const countryName = element
    .closest(".country-card")
    ?.querySelector("figcaption")?.textContent;

  if (!countryName) return;

  if (element.checked) {
    favoriteCountries.add(countryName);
    Storage.addToFavoriteCountries(JSON.stringify(favoriteCountries));
    showToast("✅ Country is added to favorites successfully!");
  } else {
    // The checkbox is unchecked, so we remove the country from favorits
    favoriteCountries.delete(countryName);
    Storage.addToFavoriteCountries(JSON.stringify([...favoriteCountries]));
    showToast("✅ Country is removed from favorites.");
  }
}

// Handles clicking a country's border
async function clickBorder(e: Event): Promise<void> {
  const element = e.target as HTMLElement;
  if (!element.matches(".borders")) return;
  await searchCountryByCode(element.textContent);
}

function flipTheme(): void {
  const next: string =
    UI.root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
}

// Click handler flips theme
UI.themeToggleBtn?.addEventListener("click", flipTheme);

// Initialize UI from current attribute or default to light
applyTheme(Storage.getTheme() || "light");

await loadAllCountries(); // Initialy load all countries in the webpage

// Adding events for controls
UI.searchCountries.addEventListener("input", debounce(searchCountry, 800));
UI.filterByRegion.addEventListener("change", filterRegion);
UI.countriesContainer.addEventListener("change", handleFavorites);
UI.favoritesLink.addEventListener("click", showFavoriteCountries);
UI.allLink?.addEventListener("click", loadAllCountries);
UI.countriesContainer.addEventListener("click", clickBorder);
