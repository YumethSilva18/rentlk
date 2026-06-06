import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@ValidatorConstraint({ name: 'isValidFile', async: false })
export class IsValidFileConstraint implements ValidatorConstraintInterface {
  validate(file: Express.Multer.File): boolean {
    if (!file) return false;

    if (file.size > MAX_FILE_SIZE) return false;

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) return false;

    return true;
  }

  defaultMessage(): string {
    return `File must be one of: ${ALLOWED_MIME_TYPES.join(', ')} and not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }
}

export function IsValidFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidFileConstraint,
    });
  };
}
