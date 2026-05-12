"use strict";

export function addToFavoriteCountries(value: string): void {
  localStorage.setItem("favoriteCountries", value);
}

export function addToTheme(value: string): void {
  localStorage.setItem("theme", value);
}

export function getTheme(): string {
  return localStorage.getItem("theme");
}

export function getFavoriteCountries(): string {
  return localStorage.getItem("favoriteCountries");
}
