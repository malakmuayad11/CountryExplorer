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
  ) {}

  static mapper(apiPayload: any): Country[] {
    // 1. The API wraps the array of countries inside apiPayload.data.objects
    const elements = apiPayload?.data?.objects;
    if (!Array.isArray(elements)) return [];

    return elements.map((c: any): Country => {
      // 2. Map capitals array of objects safely to string[]
      const capitalArray: string[] = Array.isArray(c.capitals)
        ? c.capitals.map((cap: any) => cap.name || "")
        : [];

      // 3. Map languages array of objects safely to string[]
      const languageArray: string[] = Array.isArray(c.languages)
        ? c.languages.map((lang: any) => lang.name || lang.English || "")
        : [];

      return new Country(
        c.flag?.url_svg || "",
        c.names?.common || "",
        c.region || "",
        capitalArray,
        c.population || 0,
        languageArray,
        c.borders || [],
      );
    });
  }
}

export async function getAllCountries(): Promise<Country[]> {
  const urlAll: URL = new URL("https://api.restcountries.com/countries/v5");

  urlAll.searchParams.set(
    "response_fields",
    "flag,names,region,capitals,population,languages,borders",
  );

  urlAll.searchParams.set("limit", "100");

  try {
    const res: Response = await fetch(urlAll, {
      headers: {
        Authorization: "Bearer rc_live_f80292cbebea4442a93e3de9ee16a185",
      },
    });
    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);

    // The top-level response is an Object payload containing metadata + data object
    const payload: any = await res.json();
    return Country.mapper(payload);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCountryByName(name: string): Promise<Country> {
  if (!name) throw new Error("Please provide a valid country name");

  // Using encodeURIComponent protects against spaces in country names (e.g. "United States")
  const urlGet: URL = new URL(
    `https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(name)}`,
  );

  urlGet.searchParams.set("pretty", "1");
  urlGet.searchParams.set(
    "response_fields",
    "flag,names,region,capitals,population,languages,borders",
  );

  try {
    const res: Response = await fetch(urlGet, {
      headers: {
        Authorization: "Bearer rc_live_f80292cbebea4442a93e3de9ee16a185",
      },
    });

    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);

    const payload = await res.json();

    // 1. Map the payload using your existing array mapper
    const mappedCountries = Country.mapper(payload);

    // 2. Fallback check: if nothing matched, throw an error
    if (mappedCountries.length === 0) {
      throw new Error("No country found matching that name");
    }

    // 3. Return the single country object out of the array
    return mappedCountries[0]!;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getByRegion(region: string): Promise<Country[]> {
  if (!region) throw new Error("Please provide a valid region name");

  const urlGetByRegion: URL = new URL(
    "https://api.restcountries.com/countries/v5",
  );
  urlGetByRegion.searchParams.set("region", region);
  urlGetByRegion.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res: Response = await fetch(urlGetByRegion, {
      headers: {
        Authorization: "Bearer rc_live_f80292cbebea4442a93e3de9ee16a185",
      },
    });
    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);
    const data: string[] = await res.json();
    return Country.mapper(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  if (!code) throw new Error("Please provide a valid country code");

  const urlGet: URL = new URL(
    `https://api.restcountries.com/countries/v5/codes.alpha_3/${code}`,
  );
  urlGet.searchParams.set(
    "fields",
    "flags,name,region,capital,population,languages,borders",
  );

  try {
    const res: Response = await fetch(urlGet, {
      headers: {
        Authorization: "Bearer rc_live_f80292cbebea4442a93e3de9ee16a185",
      },
    });

    if (!res.ok)
      throw new Error("HTTP error: " + res.status + " " + res.statusText);

    const payload = await res.json();
    return Country.mapper(payload)[0]!;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
