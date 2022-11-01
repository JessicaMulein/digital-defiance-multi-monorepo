import * as uuid from 'uuid';
export type Guid = string & { _guidBrand: undefined };

export class GuidV4 {
  private _value: Buffer;
  constructor(value: string | Guid) {
    if (!uuid.validate(GuidV4.ensureDashFormat(value))) {
      throw new Error('Invalid Guid');
    }
    this._value = Buffer.from(GuidV4.ensureShortFormat(value), 'hex');
  }
  public static new(): GuidV4 {
    return new GuidV4(uuid.v4() as Guid);
  }
  public get guid(): Guid {
    return GuidV4.ensureDashFormat(this._value.toString('hex')) as Guid;
  }
  public get uint8Array(): Uint8Array {
    return this._value as Uint8Array;
  }
  public get shortBuffer(): Buffer {
    return Buffer.from(this._value);
  }
  public get guidSringBuffer(): Buffer {
    return Buffer.from(this.guid);
  }
  public get asDashedString(): string {
    return GuidV4.ensureDashFormat(this._value.toString('hex'));
  }
  public get asShortString(): string {
    return GuidV4.ensureShortFormat(this.guid);
  }
  public toString(): string {
    return this.base64;
  }
  public toJSON(): string {
    return this.base64;
  }
  public get bigInt(): bigint {
    return BigInt('0x' + this._value.toString('hex'));
  }
  public get base64(): string {
    return this._value.toString('base64');
  }
  public static fromBuffer(buffer: Buffer): GuidV4 {
    return new GuidV4(GuidV4.ensureDashFormat(buffer.toString('hex')) as Guid);
  }
  public static fromStringBuffer(buffer: Buffer): GuidV4 {
    return new GuidV4(GuidV4.ensureDashFormat(buffer.toString()) as Guid);
  }

  public static ensureDashFormat(guid: string): Guid {
    if (guid.length == 32) {
      // insert dashes
      const str = guid.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        '$1-$2-$3-$4-$5'
      );
      return str as Guid;
    } else if (guid.length == 36) {
      return guid as Guid;
    } else {
      throw new Error('Invalid Guid');
    }
  }
  public static ensureShortFormat(guid: string): string {
    if (guid.length == 32) {
      return guid;
    } else if (guid.length == 36) {
      return guid.replace(/-/g, '');
    } else {
      throw new Error('Invalid Guid');
    }
  }

  public static fromBigint(bigInt: bigint): GuidV4 {
    const uuidBigInt = bigInt.toString(16).padStart(32, '0');
    const rebuiltUuid =
      uuidBigInt.slice(0, 8) +
      '-' +
      uuidBigInt.slice(8, 12) +
      '-' +
      uuidBigInt.slice(12, 16) +
      '-' +
      uuidBigInt.slice(16, 20) +
      '-' +
      uuidBigInt.slice(20);
    return new GuidV4(rebuiltUuid as Guid);
  }

  public static fromBase64(base64: string): GuidV4 {
    return new GuidV4(
      GuidV4.ensureDashFormat(
        Buffer.from(base64, 'base64').toString('hex')
      ) as Guid
    );
  }
}

export default GuidV4;
