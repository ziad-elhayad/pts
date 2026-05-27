"use client";

import { useMemo } from "react";
import countryList from "react-select-country-list";
import clsx from "clsx";

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
  const options = useMemo<CountryListOption[]>(
    () =>
      (countryList().getData() as CountryListOption[]).map((country) => ({
        value: country.label,
        label: country.label,
      })),
    []
  );
  const selectValueProps = value === undefined ? { defaultValue: "" } : { value };

  return (
    <select
      name={name}
      {...selectValueProps}
      onChange={(event) => onChange?.(event.target.value)}
      className={clsx(
        "w-full rounded-lg border border-pts-gold/20 bg-pts-black/50 px-4 py-3 text-[0.7rem] uppercase tracking-[0.14em] text-pts-gold-2 outline-none transition-colors duration-200 focus:border-pts-gold sm:px-5 sm:py-3.5 md:px-6 md:py-4 md:text-[0.75rem]",
        className
      )}
      required={required}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </select>
  );
}
