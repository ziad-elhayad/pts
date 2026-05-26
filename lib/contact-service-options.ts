import { t, type DictionaryKey, type Locale } from "@/lib/dictionary";
import {
  conciergeCategoryImages,
  miceCategoryImages,
  sportsCategoryImages,
} from "@/lib/service-category-images";
import type { LuxurySelectOption } from "@/components/forms/LuxurySelect";

export type ContactServiceKey = "concierge" | "mice" | "medical" | "sports";

type ContactServiceConfig = {
  key: ContactServiceKey;
  labelKey: DictionaryKey;
  categoryKeys: DictionaryKey[];
};

const serviceTitleKeys = (prefix: "concierge" | "mice" | "sports", count: number) =>
  Array.from(
    { length: count },
    (_, index) => `${prefix}.service${index + 1}.title` as DictionaryKey
  );

const contactServiceConfig: ContactServiceConfig[] = [
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
