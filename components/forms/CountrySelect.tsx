"use client";

import { useMemo } from "react";
import countryList from "react-select-country-list";
import { LuxurySelect, type LuxurySelectOption } from "@/components/forms/LuxurySelect";

type CountrySelectProps = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};

type CountryListOption = {
  value: string;
  label: string;
};

export function CountrySelect({
  name,
  value,
  onChange,
  className,
  placeholder = "Select your nationality",
  required = false,
}: CountrySelectProps) {
  const options = useMemo<LuxurySelectOption[]>(
    () =>
      (countryList().getData() as CountryListOption[]).map((country) => ({
        value: country.label,
        label: country.label,
      })),
    []
  );

  return (
    <LuxurySelect
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      className={className}
      placeholder={placeholder}
      required={required}
      searchable
    />
  );
}
