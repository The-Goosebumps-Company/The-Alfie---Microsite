// Turns a local or international mobile number into E.164 (+27821234567).
export function toE164(countryCode: string, raw: string): string | null {
  const cc = countryCode.replace(/\D/g, "");
  let digits = raw.replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(digits)) return null;
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
    if (!digits.startsWith(cc)) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
    digits = digits.slice(cc.length);
  } else if (digits.startsWith("00" + cc)) {
    digits = digits.slice(2 + cc.length);
  } else if (digits.startsWith(cc) && digits.length > cc.length + 8) {
    digits = digits.slice(cc.length);
  }
  digits = digits.replace(/^0+/, "");
  if (cc === "27") {
    // South African mobiles: 9 digits after the 0, starting 6, 7 or 8.
    if (!/^[678]\d{8}$/.test(digits)) return null;
  } else if (digits.length < 6 || digits.length > 12) {
    return null;
  }
  return `+${cc}${digits}`;
}
