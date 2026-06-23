"use strict";
export class Country {
    constructor(flag, name, region, capital, population, languages, borders) {
        this.flag = flag;
        this.name = name;
        this.region = region;
        this.capital = capital;
        this.population = population;
        this.languages = languages;
        this.borders = borders;
    }
    static mapper(apiPayload) {
        // 1. The API wraps the array of countries inside apiPayload.data.objects
        const elements = apiPayload?.data?.objects;
        if (!Array.isArray(elements))
            return [];
        return elements.map((c) => {
            // 2. Map capitals array of objects safely to string[]
            const capitalArray = Array.isArray(c.capitals)
                ? c.capitals.map((cap) => cap.name || "")
                : [];
            // 3. Map languages array of objects safely to string[]
            const languageArray = Array.isArray(c.languages)
                ? c.languages.map((lang) => lang.name || lang.English || "")
                : [];
            return new Country(c.flag?.url_svg || "", c.names?.common || "", c.region || "", capitalArray, c.population || 0, languageArray, c.borders || []);
        });
    }
}
export async function getAllCountries() {
    const urlAll = new URL("https://api.restcountries.com/countries/v5");
    urlAll.searchParams.set("response_fields", "flag,names,region,capitals,population,languages,borders");
    urlAll.searchParams.set("limit", "100");
    try {
        const res = await fetch(urlAll, {
            headers: {
                Authorization: "Bearer rc_live_f80292cbebea4442a93e3de9ee16a185",
            },
        });
        if (!res.ok)
            throw new Error("HTTP error: " + res.status + " " + res.statusText);
        // The top-level response is an Object payload containing metadata + data object
        const payload = await res.json();
        return Country.mapper(payload);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function getCountryByName(name) {
    if (!name)
        throw new Error("Please provide a valid country name");
    const urlGet = new URL("https://restcountries.com/v3.1/name");
    urlGet.pathname += `/${name}`;
    urlGet.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
    try {
        const res = await fetch(urlGet);
        if (!res.ok)
            throw new Error("HTTP error: " + res.status + " " + res.statusText);
        const data = await res.json();
        return new Country(data[0].flags.svg, data[0].name.common, data[0].region, data[0].capital, data[0].population, data[0].languages, data[0].borders);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
export async function getByRegion(region) {
    if (!region)
        throw new Error("Please provide a valid region name");
    const urlGetByRegion = new URL("https://restcountries.com/v3.1/region");
    urlGetByRegion.pathname += `/${region}`;
    urlGetByRegion.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
    try {
        const res = await fetch(urlGetByRegion);
        if (!res.ok)
            throw new Error("HTTP error: " + res.status + " " + res.statusText);
        const data = await res.json();
        return Country.mapper(data);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
export async function getCountryByCode(code) {
    if (!code)
        throw new Error("Please provide a valid country code");
    const urlGet = new URL("https://restcountries.com/v3.1/alpha");
    urlGet.pathname += `/${code}`;
    urlGet.searchParams.set("fields", "flags,name,region,capital,population,languages,borders");
    try {
        const res = await fetch(urlGet);
        if (!res.ok)
            throw new Error("HTTP error: " + res.status + " " + res.statusText);
        const data = await res.json();
        return new Country(data.flags.svg, data.name.common, data.region, data.capital, data.population, data.languages, data.borders);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
//# sourceMappingURL=api.js.map