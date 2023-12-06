import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const serializeValidationError = (err: ValidationError) => {
  const message = err.errors.map((message) => message).join(',');

  return message;
};

@Injectable()
export class YupValidationPipe<T extends Maybe<AnyObject>>
  implements PipeTransform
{
  constructor(private schema: ObjectSchema<T>) {}

  transform(value: any) {
    try {
      return this.schema.validateSync(value, { stripUnknown: true });
    } catch (error) {
      throw new BadRequestException(serializeValidationError(error));
    }
  }
}
