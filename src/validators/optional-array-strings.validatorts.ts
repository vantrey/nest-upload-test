import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

//checking id from query params for sortTop
@ValidatorConstraint({ name: 'sortTop' })
@Injectable()
export class OptionalArrayStringsValidator implements ValidatorConstraintInterface {
  validate(value: any[]) {
    console.log('value', value);
    console.log('value---', Array.isArray(value));

    try {
      if (value === undefined) return true;
      if (typeof value === 'string') return true;
      if (!Array.isArray(value)) return false;
      value.forEach((record) => {
        if (typeof record.trim() !== 'string') return false;
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "This array strings can't be empty and type  field should be string";
  }
}
