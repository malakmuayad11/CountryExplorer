"use strict";
export class Storage {
  public static addToFavoriteCountries(value: string): void {
    localStorage.setItem("favoriteCountries", value);
  }

  public static addToTheme(value: string): void {
    localStorage.setItem("theme", value);
  }

  public static getTheme(): string | null {
    return localStorage.getItem("theme");
  }

  public static getFavoriteCountries(): string | null {
    return localStorage.getItem("favoriteCountries");
  }
}
