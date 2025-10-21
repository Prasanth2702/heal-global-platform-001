import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function isValidPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  const parsed = parsePhoneNumberFromString(phoneNumber);
  return parsed ? parsed.isValid() : false;
}