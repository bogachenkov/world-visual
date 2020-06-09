interface IdAndName {
  _id: string;
  name: string;
}

export interface ICountryPopulation extends IdAndName {
  population: number;
}

export interface ICountryDensity extends ICountryPopulation{
  density: number;
  alpha3Code: string;
  area: number;
}

export interface ICountryArea extends IdAndName {
  area: number;
}

export interface ITimezone extends IdAndName {
  countries: ICountryPopulation[]
}

export interface IFormatTimezone {
  name: string;
  totalCountries: number;
  totalPopulation: number;
}

export interface ICountry extends ICountryPopulation {
  area: number;
  capital: string;
  nativeName: string;
  populationDensity: number;
};

export interface IBorders extends IdAndName {
  alpha3Code: string;
  borders: {
    _id: string;
    name: string;
    alpha3Code: string;
  }[]
}

interface ISubregion extends IdAndName {
  countries: ICountryPopulation[]
}

export interface IContinent extends IdAndName {
  subregions: ISubregion[]
}