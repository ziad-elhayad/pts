declare module "react-select-country-list" {
  export type CountryData = {
    value: string;
    label: string;
  };

  export default function countryList(): {
    getData(): CountryData[];
  };
}
