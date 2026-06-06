export class PhoneUtil {
  private static readonly SRI_LANKA_COUNTRY_CODE = '+94';
  private static readonly SRI_LANKA_PHONE_PATTERN = /^0[1-9][0-9]{8}$/;
  private static readonly INTERNATIONAL_PHONE_PATTERN = /^\+94[1-9][0-9]{8}$/;

  static formatToLocal(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith(this.SRI_LANKA_COUNTRY_CODE)) {
      return '0' + cleaned.slice(3);
    }
    return cleaned;
  }

  static formatToInternational(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('0')) {
      return this.SRI_LANKA_COUNTRY_CODE + cleaned.slice(1);
    }
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    return this.SRI_LANKA_COUNTRY_CODE + cleaned;
  }

  static isValidSriLankanPhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return this.SRI_LANKA_PHONE_PATTERN.test(cleaned) || this.INTERNATIONAL_PHONE_PATTERN.test(cleaned);
  }

  static maskPhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.length < 6) return cleaned;
    return cleaned.slice(0, -4).replace(/\d/g, '*') + cleaned.slice(-4);
  }

  static getOperatorPrefix(phone: string): string | null {
    const cleaned = this.formatToLocal(phone);
    const prefix = cleaned.slice(1, 3);
    const operators: Record<string, string> = {
      '70': 'Mobitel',
      '71': 'Mobitel',
      '72': 'Hutch',
      '74': 'Dialog',
      '75': 'Airtel',
      '76': 'Dialog',
      '77': 'Dialog',
      '78': 'Hutch',
    };
    return operators[prefix] || null;
  }
}
