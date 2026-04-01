"use strict";

export function addToLocalStorage(value) {
  localStorage.setItem("favoriteCountries", value);
}

export function removeFromLocalStorage(removedIndex, favoriteCountries) {
  // const removedIndex = favoriteCountries.indexOf(countryName);
  const part1 = favoriteCountries.slice(0, removedIndex);
  const part2 = favoriteCountries.slice(removedIndex + 1, -1);
  favoriteCountries = [...part1, ...part2];

  addToLocalStorage(JSON.stringify(favoriteCountries));
  // localStorage.removeItem("favoriteCountries");
}

export function getFromLocalStorage() {
  return localStorage.getItem("favoriteCountries");
}
