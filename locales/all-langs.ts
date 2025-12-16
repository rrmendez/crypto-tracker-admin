"use client";

import { CONFIG } from "@/config/global";

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: "en",
    label: "English",
    countryCode: "US",
    adapterLocale: "en",
    numberFormat: CONFIG.defaultCurrency,
  },
  {
    value: "es",
    label: "Spanish",
    countryCode: "ES",
    adapterLocale: "es",
    numberFormat: CONFIG.defaultCurrency,
  },
  {
    value: "pt",
    label: "Portuguese",
    countryCode: "BR",
    adapterLocale: "pt",
    numberFormat: CONFIG.defaultCurrency,
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
