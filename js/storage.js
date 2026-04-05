"use strict";

export function addToFavoriteCountries(value) {
  localStorage.setItem("favoriteCountries", value);
}

export function addToTheme(value) {
  localStorage.setItem("theme", value);
}

export function getFromLocalStorage() {
  return localStorage.getItem("favoriteCountries");
}
