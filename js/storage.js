"use strict";

export function addToFavoriteCountries(value) {
  localStorage.setItem("favoriteCountries", value);
}

export function addToTheme(value) {
  localStorage.setItem("theme", value);
}

export function getTheme() {
  return localStorage.getItem("theme");
}

export function getFavoriteCountries() {
  return localStorage.getItem("favoriteCountries");
}
