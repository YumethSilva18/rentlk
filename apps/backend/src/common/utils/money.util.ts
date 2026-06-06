export class MoneyUtil {
  static readonly LKR_SYMBOL = 'Rs. ';
  static readonly DECIMAL_PLACES = 2;

  static toCents(amount: number): number {
    return Math.round(amount * 100);
  }

  static fromCents(cents: number): number {
    return cents / 100;
  }

  static formatLKR(amount: number): string {
    return `${this.LKR_SYMBOL}${amount.toLocaleString('en-LK', {
      minimumFractionDigits: this.DECIMAL_PLACES,
      maximumFractionDigits: this.DECIMAL_PLACES,
    })}`;
  }

  static calculateCommission(amount: number, rate: number = 0.1): number {
    return Math.round(amount * rate * 100) / 100;
  }

  static calculateOwnerPayout(amount: number, platformFeeRate: number = 0.1): {
    platformFee: number;
    ownerAmount: number;
  } {
    const platformFee = this.calculateCommission(amount, platformFeeRate);
    const ownerAmount = Math.round((amount - platformFee) * 100) / 100;
    return { platformFee, ownerAmount };
  }

  static round(amount: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(amount * factor) / factor;
  }

  static validateAmount(amount: number): boolean {
    return typeof amount === 'number' && !isNaN(amount) && amount > 0 && isFinite(amount);
  }

  static isValidPricing(dailyRate: number, hourlyRate?: number): boolean {
    if (!this.validateAmount(dailyRate)) return false;
    if (hourlyRate !== undefined && hourlyRate !== null) {
      if (!this.validateAmount(hourlyRate)) return false;
      if (hourlyRate > dailyRate) return false;
    }
    return true;
  }
}
