import { gql } from 'apollo-boost';

const countryFragment = gql`
  fragment CountryData on Country {
    _id,
    name
  }
`;

export const GET_COUNTRY_BY_NAME = gql`
  query getCountryByName($name: String) {
    Country(name: $name) {
      area,
      demonym,
      name,
      nativeName,
      numericCode,
      capital,
      officialLanguages {
        name
      }
      population,
      populationDensity,
      subregion {
        name
      },
      borders {
        name
      }
      timezones {
        name
      }
    }
  }
`;

export const GET_COUNTRIES_POPULATION = gql`
  query getCountriesByPopulation($orderBy:[_CountryOrdering]) {
    Country(orderBy: $orderBy, first: 10, filter: { population_gte: 1 }) {
      ...CountryData
      population,
      populationDensity
    }
  }
  ${countryFragment}
`;

export const GET_COUNTRIES_DENSITY = gql`
  query getCountriesDensity {
      Country(filter: { area_gt: 1, population_gt: 1, capital_not: "" }) {
      ...CountryData
      alpha3Code,
      density: populationDensity,
      population,
      area
    }
  }
  ${countryFragment}
`;

export const GET_COUNTRIES_AREA = gql`
  query getCountriesArea {
    Country(filter: { area_lt: 1500000, population_gt: 1, capital_not: "" }) {
      ...CountryData,
      area
    }
  }
  ${countryFragment}
`;

export const GET_TIMEZONES = gql`
  query getTimezones {
    Timezone {
      _id,
      name,
      countries(filter: { area_gt: 1, population_gt: 1, capital_not: "" }) {
        _id,
        population
      }
    }
  }
`;

export const GET_COUNTRIES_BORDERS = gql`
  query getCountryBorders {
    Country(filter: { area_gt: 1, population_gt: 1, capital_not: "" }) {
      ...CountryData,
      alpha3Code,
      borders {
        alpha3Code
      }
    }
  }
  ${countryFragment}
`;

export const GET_CONTINENTS = gql`
  query getRegions {
    Region(filter: { name_not: "Polar" }) {
      _id,
      name,
      subregions {
        _id
        name
        countries(filter: { population_gt: 1 }) {
          _id,
          population
        }
      }
    }
  }
`;