export declare class Country {
    flag: string;
    name: string;
    region: string;
    capital: string[];
    population: number;
    languages: string[];
    borders: string[];
    constructor(flag: string, name: string, region: string, capital: string[], population: number, languages: string[], borders: string[]);
    static mapper(data: string[]): Country[];
}
export declare function getAllCountries(): Promise<Country[]>;
export declare function getCountryByName(name: string): Promise<Country>;
export declare function getByRegion(region: string): Promise<Country[]>;
export declare function getCountryByCode(code: string): Promise<Country>;
//# sourceMappingURL=api.d.ts.map