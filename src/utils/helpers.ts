import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as nanoid from 'nanoid';

@Injectable()
export class HelperClass {
  generateRandomString: (length: number, type: string) => string = (
    length = 32,
    type = 'alpha-num',
  ) => {
    // "num", "upper", "lower", "upper-num", "lower-num", "alpha-num"
    let characters =
      'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (type === 'num') characters = '0123456789';
    if (type === 'upper-num')
      characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
    if (type === 'lower-num')
      characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    if (type === 'upper') characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (type === 'lower') characters = 'abcdefghijklmnopqrstuvwxyz';
    if (type === 'alpha')
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    return nanoid.customAlphabet(characters, length)();
  };

  async hashString(string: string): Promise<string> {
    const hashedString = createHash('sha512').update(string).digest('hex');
    return hashedString;
  }
}
