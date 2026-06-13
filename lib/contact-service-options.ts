import { t, type DictionaryKey, type Locale } from "@/lib/dictionary";
import {
  conciergeCategoryImages,
  miceCategoryImages,
  sportsCategoryImages,
  educationDestinationImages,
} from "@/lib/service-category-images";
import type { LuxurySelectOption } from "@/components/forms/LuxurySelect";

export type ContactServiceKey = "concierge" | "mice" | "medical" | "sports" | "visa" | "education";

export type VisaTypeKey = "short-stay" | "long-stay" | "specialized";

type ContactServiceConfig = {
  key: ContactServiceKey;
  labelKey: DictionaryKey;
  categoryKeys: DictionaryKey[];
};

const serviceTitleKeys = (prefix: "concierge" | "mice" | "sports" | "education", count: number) =>
  Array.from(
    { length: count },
    (_, index) => `${prefix}.service${index + 1}.title` as DictionaryKey
  );

const destinationTitleKeys = (prefix: "education", count: number) =>
  Array.from(
    { length: count },
    (_, index) => `${prefix}.destination${index + 1}.title` as DictionaryKey
  );

const contactServiceConfig: ContactServiceConfig[] = [
  {
    key: "visa",
    labelKey: "services.section.visa.title",
    // Flat list kept for backward-compat with non-visa type aware code paths.
    // The structured visa type → category mapping is handled by getVisaTypeCategoryOptions.
    categoryKeys: [
      "visa.shortStay.medical.title",
      "visa.shortStay.business.title",
      "visa.shortStay.tourist.title",
      "visa.shortStay.family.title",
      "visa.longStay.student.title",
      "visa.longStay.employment.title",
      "visa.longStay.jobSeeker.title",
      "visa.longStay.familyReunion.title",
      "visa.longStay.euBlueCard.title",
      "visa.specialized.retirement.title",
      "visa.specialized.investor.title",
      "visa.specialized.digitalNomad.title",
      "visa.specialized.permanent.title",
      "visa.specialized.transit.title",
    ],
  },
  {
    key: "concierge",
    labelKey: "services.concierge",
    categoryKeys: serviceTitleKeys("concierge", conciergeCategoryImages.length),
  },
  {
    key: "mice",
    labelKey: "services.mice",
    categoryKeys: serviceTitleKeys("mice", miceCategoryImages.length),
  },
  {
    key: "education",
    labelKey: "services.section.education.title",
    categoryKeys: destinationTitleKeys("education", educationDestinationImages.length),
  },
  {
    key: "medical",
    labelKey: "services.medical",
    categoryKeys: [
      "medical.page.tab.patients",
      "medical.page.tab.doctors",
      "medical.page.tab.wellness",
    ],
  },
  {
    key: "sports",
    labelKey: "services.sports",
    categoryKeys: serviceTitleKeys("sports", sportsCategoryImages.length),
  },
];

// Visa type → category key mapping (structured, mirrors the visa page categories)
const visaTypeCategoryKeys: Record<VisaTypeKey, DictionaryKey[]> = {
  "short-stay": [
    "visa.shortStay.medical.title",
    "visa.shortStay.business.title",
    "visa.shortStay.tourist.title",
    "visa.shortStay.family.title",
  ],
  "long-stay": [
    "visa.longStay.student.title",
    "visa.longStay.employment.title",
    "visa.longStay.jobSeeker.title",
    "visa.longStay.familyReunion.title",
    "visa.longStay.euBlueCard.title",
  ],
  specialized: [
    "visa.specialized.retirement.title",
    "visa.specialized.investor.title",
    "visa.specialized.digitalNomad.title",
    "visa.specialized.permanent.title",
    "visa.specialized.transit.title",
  ],
};

export function getContactServiceOptions(locale: Locale): LuxurySelectOption[] {
  return contactServiceConfig.map((service) => ({
    value: t(locale, service.labelKey),
    label: t(locale, service.labelKey),
  }));
}

export function getContactServiceCategoryOptions(
  locale: Locale,
  serviceLabel: string
): LuxurySelectOption[] {
  const selectedService = contactServiceConfig.find(
    (service) => t(locale, service.labelKey) === serviceLabel
  );

  if (!selectedService) return [];

  return selectedService.categoryKeys.map((key) => {
    const label = t(locale, key);
    return { value: label, label };
  });
}

/** Returns the three visa type options as radio-button choices */
export function getVisaTypeOptions(locale: Locale): LuxurySelectOption[] {
  const typeKeys: DictionaryKey[] = [
    "visa.categories.longStay.title",
    "visa.categories.shortStay.title",
    "visa.categories.specialized.title",
  ];
  return typeKeys.map((key) => ({
    value: key.includes("longStay")
      ? "long-stay"
      : key.includes("shortStay")
      ? "short-stay"
      : "specialized",
    label: t(locale, key),
  }));
}

/** Returns category options for a specific visa type key */
export function getVisaTypeCategoryOptions(
  locale: Locale,
  visaType: VisaTypeKey | ""
): LuxurySelectOption[] {
  if (!visaType) return [];
  const keys = visaTypeCategoryKeys[visaType] ?? [];
  return keys.map((key) => {
    const label = t(locale, key);
    return { value: label, label };
  });
}

/** Returns the label for the International Visa service (for comparison) */
export function getInternationalVisaLabel(locale: Locale): string {
  return t(locale, "services.section.visa.title");
}
