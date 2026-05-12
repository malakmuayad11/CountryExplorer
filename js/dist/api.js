"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getAllCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlAll = new URL("https://restcountries.com/v3.1/all");
        urlAll.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
        try {
            const res = yield fetch(urlAll);
            if (!res.ok)
                throw new Error("HTTP error: " + res.status + " " + res.statusText);
            const data = yield res.json();
            return data.map((c) => {
                return {
                    flag: c.flags.svg,
                    name: c.name.common,
                    region: c.region,
                    capital: c.capital,
                    population: c.population,
                    languages: c.languages,
                    borders: c.borders,
                };
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
export function getCountryByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name)
            throw new Error("Please provide a valid country name");
        const urlGet = new URL("https://restcountries.com/v3.1/name");
        urlGet.pathname += `/${name}`;
        urlGet.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
        try {
            const res = yield fetch(urlGet);
            if (!res.ok)
                throw new Error("HTTP error: " + res.status + " " + res.statusText);
            const data = yield res.json();
            return {
                flag: data[0].flags.svg,
                name: data[0].name.common,
                region: data[0].region,
                capital: data[0].capital,
                population: data[0].population,
                languages: data[0].languages,
                borders: data[0].borders,
            };
        }
        catch (error) {
            console.log(error);
        }
    });
}
export function getByRegion(region) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!region)
            throw new Error("Please provide a valid region name");
        const urlGetByRegion = new URL("https://restcountries.com/v3.1/region");
        urlGetByRegion.pathname += `/${region}`;
        urlGetByRegion.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
        try {
            const res = yield fetch(urlGetByRegion);
            if (!res.ok)
                throw new Error("HTTP error: " + res.status + " " + res.statusText);
            const data = yield res.json();
            return data.map((c) => {
                return {
                    flag: c.flags.svg,
                    name: c.name.common,
                    region: c.region,
                    capital: c.capital,
                    population: c.population,
                    languages: c.languages,
                    borders: c.borders,
                };
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
export function getCountryByCode(code) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!code)
            throw new Error("Please provide a valid country code");
        const urlGet = new URL("https://restcountries.com/v3.1/alpha");
        urlGet.pathname += `/${code}`;
        urlGet.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
        try {
            const res = yield fetch(urlGet);
            if (!res.ok)
                throw new Error("HTTP error: " + res.status + " " + res.statusText);
            const data = yield res.json();
            return {
                flag: data.flags.svg,
                name: data.name.common,
                region: data.region,
                capital: data.capital,
                population: data.population,
                languages: data.languages,
                borders: data.borders,
            };
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=api.js.map