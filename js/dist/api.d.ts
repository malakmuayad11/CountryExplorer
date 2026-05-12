export declare class Country {
    flag: string;
    name: string;
    region: string;
    capital: string[];
    population: number;
    languages: string[];
    borders: string[];
    constructor(flag: string, name: string, region: string, capital: string[], population: number, languages: string[], borders: string[]);
}
export declare function getAllCountries(): Promise<Country[] | undefined>;
export declare function getCountryByName(name: string | unknown): Promise<Country>;
export declare function getByRegion(region: string): Promise<Country[] | undefined>;
export declare function getCountryByCode(code: string): Promise<Country>;
//# sourceMappingURL=api.d.ts.map