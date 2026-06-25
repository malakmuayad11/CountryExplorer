"use strict";
export class Storage {
    static addToFavoriteCountries(value) {
        localStorage.setItem("favoriteCountries", value);
    }
    static addToTheme(value) {
        localStorage.setItem("theme", value);
    }
    static getTheme() {
        return localStorage.getItem("theme");
    }
    static getFavoriteCountries() {
        return localStorage.getItem("favoriteCountries");
    }
}
//# sourceMappingURL=storage.js.map