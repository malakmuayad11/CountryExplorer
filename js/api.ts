"use strict";

export class Country {
  constructor(
    public flag: string,
    public name: string,
    public region: string,
    public capital: string[],
    public population: number,
    public languages: string[],
    public borders: string[],
  ) {
    capital = [];
    languages = [];
    borders = [];
  }
}

export async function getAllCountries(): Promise<Country[] | undefined> {
  const urlAll: URL = new URL("https://restcountries.com/v3.1/all");
  urlAll.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res = await fetch(urlAll);
    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);
    const data = await res.json();

    return data.map((c: any): Country => {
      return new Country(
        c.flags.svg,
        c.name.common,
        c.region,
        c.capital,
        c.population,
        c.languages,
        c.borders,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getCountryByName(
  name: string | unknown,
): Promise<Country> {
  if (!name) throw new Error("Please provide a valid country name");

  const urlGet: URL = new URL("https://restcountries.com/v3.1/name");
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
    return new Country(
      data[0].flags.svg,
      data[0].name.common,
      data[0].region,
      data[0].capital,
      data[0].population,
      data[0].languages,
      data[0].borders,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getByRegion(
  region: string,
): Promise<Country[] | undefined> {
  if (!region) throw new Error("Please provide a valid region name");

  const urlGetByRegion: URL = new URL("https://restcountries.com/v3.1/region");
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
    return data.map((c: any): Country => {
      return new Country(
        c.flags.svg,
        c.name.common,
        c.region,
        c.capital,
        c.population,
        c.languages,
        c.borders,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  if (!code) throw new Error("Please provide a valid country code");

  const urlGet: URL = new URL("https://restcountries.com/v3.1/alpha");
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
    return new Country(
      data.flags.svg,
      data.name.common,
      data.region,
      data.capital,
      data.population,
      data.languages,
      data.borders,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
