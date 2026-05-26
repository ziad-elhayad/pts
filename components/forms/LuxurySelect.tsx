"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Select, {
  components as selectComponents,
  type GroupBase,
  type MenuListProps,
  type StylesConfig,
} from "react-select";
import clsx from "clsx";

export type LuxurySelectOption = {
  value: string;
  label: string;
};

type LuxurySelectProps = {
  name: string;
  options: LuxurySelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
};

function MenuList(
  props: MenuListProps<LuxurySelectOption, false, GroupBase<LuxurySelectOption>>
) {
  const innerProps = {
    ...props.innerProps,
    "data-lenis-prevent": true,
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => {
      props.innerProps.onTouchMove?.(event);
      event.stopPropagation();
    },
    onWheel: (event: React.WheelEvent<HTMLDivElement>) => {
      props.innerProps.onWheel?.(event);
      event.stopPropagation();
    },
  };

  return <selectComponents.MenuList {...props} innerProps={innerProps} />;
}

const selectStyles: StylesConfig<LuxurySelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "46px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: state.isFocused ? "rgba(168, 143, 100, 0.85)" : "rgba(168, 143, 100, 0.22)",
    borderRadius: "8px",
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 1px rgba(168, 143, 100, 0.35)" : "none",
    cursor: "pointer",
    transition: "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
    "&:hover": {
      backgroundColor: "rgba(13, 13, 15, 0.72)",
      borderColor: "rgba(168, 143, 100, 0.55)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0.62rem 0.85rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "#cfba90",
    fontSize: "0.72rem",
    letterSpacing: "0.14em",
    margin: 0,
    padding: 0,
    textTransform: "uppercase",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(207, 186, 144, 0.45)",
    fontSize: "0.7rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#cfba90",
    fontSize: "0.72rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "rgba(13, 13, 15, 0.98)",
    border: "1px solid rgba(168, 143, 100, 0.32)",
    borderRadius: "8px",
    boxShadow: "0 22px 55px rgba(0, 0, 0, 0.55)",
    marginBottom: "6px",
    marginTop: "6px",
    overflow: "hidden",
    zIndex: 300,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 10000,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "min(42vh, 260px)",
    overscrollBehavior: "contain",
    padding: "0.25rem",
    WebkitOverflowScrolling: "touch",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "rgba(168, 143, 100, 0.22)"
      : state.isFocused
      ? "rgba(168, 143, 100, 0.12)"
      : "transparent",
    borderRadius: "6px",
    color: state.isSelected || state.isFocused ? "#cfba90" : "rgba(207, 186, 144, 0.78)",
    cursor: "pointer",
    fontSize: "0.68rem",
    letterSpacing: "0.14em",
    margin: "1px 0",
    padding: "0.7rem 0.8rem",
    textTransform: "uppercase",
    transition: "background-color 140ms ease, color 140ms ease",
    "&:active": {
      backgroundColor: "rgba(168, 143, 100, 0.24)",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#cfba90" : "rgba(168, 143, 100, 0.7)",
    padding: "0 0.7rem",
    transition: "color 180ms ease, transform 180ms ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
    "&:hover": {
      color: "#cfba90",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "rgba(168, 143, 100, 0.65)",
    padding: "0 0.45rem",
    "&:hover": {
      color: "#cfba90",
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "rgba(207, 186, 144, 0.5)",
    fontSize: "0.68rem",
    letterSpacing: "0.14em",
    padding: "0.8rem",
    textTransform: "uppercase",
  }),
};

export function LuxurySelect({
  name,
  options,
  value,
  onChange,
  className,
  placeholder = "Select an option",
  required = false,
  searchable = true,
}: LuxurySelectProps) {
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [internalValue, setInternalValue] = useState(value ?? "");

  const currentValue = value ?? internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === currentValue) ?? null,
    [currentValue, options]
  );

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;

    const handleReset = () => {
      window.setTimeout(() => {
        if (value === undefined) {
          setInternalValue("");
        }
        onChange?.("");
      }, 0);
    };

    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [onChange, value]);

  const handleChange = (selected: LuxurySelectOption | null) => {
    const nextValue = selected?.value ?? "";
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div ref={rootRef} className={clsx("relative", className)} data-lenis-prevent>
      <Select<LuxurySelectOption, false>
        instanceId={generatedId}
        inputId={`${generatedId}-${name}`}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        styles={selectStyles}
        isSearchable={searchable}
        isClearable={false}
        menuPortalTarget={portalTarget ?? undefined}
        menuPosition="fixed"
        menuShouldBlockScroll={false}
        menuShouldScrollIntoView={false}
        captureMenuScroll
        blurInputOnSelect
        className="w-full"
        classNamePrefix="lux-select"
        components={{
          IndicatorSeparator: null,
          MenuList,
        }}
      />
      <input type="hidden" name={name} value={currentValue} required={required} />
    </div>
  );
}
