import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isValidMoneyAmount', async: false })
export class IsValidMoneyAmountConstraint implements ValidatorConstraintInterface {
  validate(amount: number): boolean {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    if (amount <= 0) return false;
    if (!isFinite(amount)) return false;

    const decimalPlaces = (amount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) return false;

    return amount < 10000000; // Max 10 million LKR
  }

  defaultMessage(): string {
    return 'Amount must be a positive number with up to 2 decimal places, not exceeding 10,000,000 LKR';
  }
}

export function IsValidMoneyAmount(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidMoneyAmountConstraint,
    });
  };
}
