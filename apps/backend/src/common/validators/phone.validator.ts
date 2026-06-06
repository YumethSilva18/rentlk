import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PhoneUtil } from '../utils/phone.util';

@ValidatorConstraint({ name: 'isSriLankanPhone', async: false })
export class IsSriLankanPhoneConstraint implements ValidatorConstraintInterface {
  validate(phone: string): boolean {
    if (!phone) return false;
    return PhoneUtil.isValidSriLankanPhone(phone);
  }

  defaultMessage(): string {
    return 'Phone number must be a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)';
  }
}

export function IsSriLankanPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSriLankanPhoneConstraint,
    });
  };
}
