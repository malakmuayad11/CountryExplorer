"use strict";

export async function getAllCountries() {
  const urlAll = new URL("https://restcountries.com/v3.1/all");
  urlAll.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res = await fetch(urlAll);
    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);
    const data = await res.json();
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
  } catch (error) {
    console.log(error);
  }
}

export async function getCountryByName(name) {
  if (!name) throw new Error("Please provide a valid country name");

  const urlGet = new URL("https://restcountries.com/v3.1/name");
  urlGet.pathname += `/${name}`;
  urlGet.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res = await fetch(urlGet);

    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);

    const data = await res.json();
    return {
      flag: data[0].flags.svg,
      name: data[0].name.common,
      region: data[0].region,
      capital: data[0].capital,
      population: data[0].population,
      languages: data[0].languages,
      borders: data[0].borders,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getByRegion(region) {
  if (!region) throw new Error("Please provide a valid region name");

  const urlGetByRegion = new URL("https://restcountries.com/v3.1/region");
  urlGetByRegion.pathname += `/${region}`;
  urlGetByRegion.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res = await fetch(urlGetByRegion);
    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);
    const data = await res.json();
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
  } catch (error) {
    console.log(error);
  }
}

export async function getCountryByCode(code) {
  if (!code) throw new Error("Please provide a valid country code");

  const urlGet = new URL("https://restcountries.com/v3.1/alpha");
  urlGet.pathname += `/${code}`;
  urlGet.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res = await fetch(urlGet);

    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);

    const data = await res.json();
    return {
      flag: data.flags.svg,
      name: data.name.common,
      region: data.region,
      capital: data.capital,
      population: data.population,
      languages: data.languages,
      borders: data.borders,
    };
  } catch (error) {
    console.log(error);
  }
}
