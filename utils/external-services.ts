/**
 * Get country code from phone number
 * @param phone Phone number
 * @returns Country code
 */
export const getCountryCodeFromPhone = (phone: string | undefined): string | null => {
  if (!phone) return null;

  const countryPhoneMap: { [key: string]: string } = {
    "+55": "br",
    "+52": "mx",
    "+57": "co",
    "+1": "us",
    "+34": "es",
    "+54": "ar",
    "+51": "pe",
  };

  const entry = Object.entries(countryPhoneMap).find(([code]) => phone.startsWith(code));

  return entry ? entry[1] : null;
};
