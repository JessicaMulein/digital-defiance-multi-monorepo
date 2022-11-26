import { IShamirShareDetail } from './interfaces';
import { extractShareComponents, getConfig } from 'secrets.js-34r7h';

export default class ShamirShareDetail implements IShamirShareDetail {
  constructor(
    public readonly share: string,
    public readonly bits: number,
    public readonly id: number,
    public readonly data: string
  ) {}

  public dataAsBuffer(): Buffer {
    return Buffer.from(this.data, 'hex');
  }

  public dataAsBigInt(): bigint {
    return BigInt('0x' + this.data);
  }

  public dataAsNumber(): number {
    return Number('0x' + this.data);
  }

  public static generatePublicShareString(
    bits: number,
    id: number,
    data: string
  ) {
    const config = getConfig();
    const bitsBase36 = bits.toString(36).toUpperCase();
    const idMax = Math.pow(2, bits) - 1;
    const idPaddingLen = idMax.toString(config.radix).length;
    const idHex = id.toString(config.radix).padStart(idPaddingLen, '0');

    if (id % 1 !== 0 || id < 1 || id > idMax) {
      throw new Error(
        'Share id must be an integer between 1 and ' + idMax + ', inclusive.'
      );
    }

    const newShareString = bitsBase36 + idHex + data;

    return newShareString;
  }

  public static fromShare(share: string): ShamirShareDetail {
    const components = extractShareComponents(share);
    return new ShamirShareDetail(
      share,
      components.bits,
      components.id,
      components.data
    );
  }

  public toShare(): string {
    return ShamirShareDetail.generatePublicShareString(
      this.bits,
      this.id,
      this.data
    );
  }

  public dictionaryIndex(dictionaryWords: Array<string>): number {
    // data point we end up with 64 bytes per share in a 2048 word dictionary with 24 shares
    // as a bigint, this is 2^512 (512 bits) compared to the 2^11=2048 (11 bits)
    // in order to get a unique index, we need to reduce the 512 bits to 11 bits
    const bitsPerDictionaryWord = Math.log2(dictionaryWords.length); // 11
    const dataAsBigInt = this.dataAsBigInt();
    const dictionaryIndex = Number(
      dataAsBigInt % BigInt(2) ** BigInt(bitsPerDictionaryWord)
    );
    return dictionaryIndex;
  }
}
