import * as uuid from 'uuid';
import { AnyBrand, Brand } from 'ts-brand';

export enum GuidBrand {
  FullHexGuid = 'FullHexGuid',
  ShortHexGuid = 'ShortHexGuid',
  Base64Guid = 'Base64Guid',
  BigIntGuid = 'BigIntGuid',
  FullHexGuidBuffer = 'FullHexGuidBuffer',
  ShortHexGuidBuffer = 'ShortHexGuidBuffer',
  Base64GuidBuffer = 'Base64GuidBuffer',
  RawBuffer = 'RawBuffer',
}

export type FullHexGuidBuffer = Brand<Buffer, 'GuidV4', GuidBrand.FullHexGuid>;
export type ShortHexGuidBuffer = Brand<
  Buffer,
  'GuidV4',
  GuidBrand.ShortHexGuid
>;
export type Base64GuidBuffer = Brand<Buffer, 'GuidV4', GuidBrand.Base64Guid>;
export type BigIntGuid = Brand<bigint, 'GuidV4', GuidBrand.BigIntGuid>;
export type FullHexGuid = Brand<string, 'GuidV4', GuidBrand.FullHexGuidBuffer>;
export type ShortHexGuid = Brand<
  string,
  'GuidV4',
  GuidBrand.ShortHexGuidBuffer
>;
export type Base64Guid = Brand<string, 'GuidV4', GuidBrand.Base64GuidBuffer>;
export type RawBuffer = Brand<Buffer, 'GuidV4', GuidBrand.RawBuffer>;

export const lengthMap: Map<GuidBrand, number> = new Map<GuidBrand, number>([
  [GuidBrand.FullHexGuid, 36],
  [GuidBrand.ShortHexGuid, 32],
  [GuidBrand.Base64Guid, 24],
  [GuidBrand.FullHexGuidBuffer, 36],
  [GuidBrand.ShortHexGuidBuffer, 32],
  [GuidBrand.Base64GuidBuffer, 22],
  [GuidBrand.RawBuffer, 16],
]);

export const verifyFunctions: Map<GuidBrand, (guid: AnyBrand) => boolean> =
  new Map<GuidBrand, (guid: AnyBrand) => boolean>([
    [GuidBrand.FullHexGuid, isFullHexGuid],
    [GuidBrand.ShortHexGuid, isShortHexGuid],
    [GuidBrand.Base64Guid, isBase64Guid],
    [GuidBrand.BigIntGuid, isBigIntGuid],
    [GuidBrand.FullHexGuidBuffer, isFullHexGuid],
    [GuidBrand.ShortHexGuidBuffer, isShortHexGuid],
    [GuidBrand.Base64GuidBuffer, isBase64Guid],
    [GuidBrand.RawBuffer, isRawGuid],
  ]);

export function verifyGuid(band: GuidBrand, guid: AnyBrand): boolean {
  const verifyFunc = verifyFunctions.get(band);
  if (verifyFunc === undefined) {
    return false;
  }
  return verifyFunc(guid);
}

export function guidBrandToLength(brand: GuidBrand): number {
  const guid = lengthMap.get(brand);
  if (guid === undefined) {
    throw new Error(`Unknown guid brand: ${brand}`);
  }
  return guid as number;
}

export function lengthToGuidBrand(length: number): GuidBrand {
  for (const [brand, len] of lengthMap) {
    if (len === length) {
      return brand;
    }
  }
  throw new Error(`Unknown guid length: ${length}`);
}

export function isFullHexGuid(
  value: string | Buffer,
  validate?: boolean
): boolean {
  let result = false;
  if (value instanceof Buffer) {
    result = value.length === guidBrandToLength(GuidBrand.FullHexGuidBuffer);
  }
  result = value.length === guidBrandToLength(GuidBrand.FullHexGuid);
  if (result && validate === true) {
    if (value instanceof Buffer) {
      if (!uuid.validate(value.toString())) {
        return false;
      }
    } else if (typeof value === 'string') {
      if (!uuid.validate(value)) {
        return false;
      }
    }
  }
  return result;
}

export function isShortHexGuid(
  value: string | Buffer,
  validate?: boolean
): boolean {
  let result = false;
  if (value instanceof Buffer) {
    result = value.length === guidBrandToLength(GuidBrand.ShortHexGuidBuffer);
  }
  result = value.length === guidBrandToLength(GuidBrand.ShortHexGuid);
  if (result && validate === true) {
    let fromShortHex: Buffer = Buffer.alloc(0);
    if (value instanceof Buffer) {
      fromShortHex = Buffer.from(value.toString('hex'), 'hex');
    } else if (typeof value === 'string') {
      fromShortHex = Buffer.from(value, 'hex');
    }
    if (fromShortHex.length !== guidBrandToLength(GuidBrand.RawBuffer)) {
      return false;
    }
    if (!uuid.validate(ensureDashFormat(fromShortHex.toString('hex')))) {
      return false;
    }
  }
  return result;
}

export function isBase64Guid(
  value: string | Buffer,
  validate?: boolean
): boolean {
  let result = false;
  if (value instanceof Buffer) {
    result = value.length === guidBrandToLength(GuidBrand.Base64GuidBuffer);
  }
  result = value.length === guidBrandToLength(GuidBrand.Base64Guid);
  if (result && validate === true) {
    let fromBase64: Buffer = Buffer.alloc(0);
    if (value instanceof Buffer) {
      fromBase64 = Buffer.from(value.toString(), 'base64');
    } else if (typeof value === 'string') {
      fromBase64 = Buffer.from(value, 'base64');
    }
    if (fromBase64.length !== guidBrandToLength(GuidBrand.RawBuffer)) {
      return false;
    }
    if (!uuid.validate(ensureDashFormat(fromBase64.toString('hex')))) {
      return false;
    }
  }
  return result;
}

export function isRawGuid(value: Buffer, validate?: boolean): boolean {
  let result = false;
  if (value instanceof Buffer) {
    result = value.length === guidBrandToLength(GuidBrand.RawBuffer);
  }
  if (result && validate === true) {
    if (!uuid.validate(ensureDashFormat(value.toString('hex')))) {
      return false;
    }
  }
  return result;
}

export function isBigIntGuid(value: bigint, validate?: boolean): boolean {
  let result = false;
  if (typeof value === 'bigint') {
    result = true;
  }
  if (result && validate === true) {
    try {
      const fromBigInt = fullHexFromBigInt(value);
      if (!uuid.validate(ensureDashFormat(fromBigInt))) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return result;
}

export function whichBrand(value: AnyBrand): GuidBrand {
  if (typeof value === 'bigint') {
    if (verifyGuid(GuidBrand.BigIntGuid, value)) {
      return GuidBrand.BigIntGuid;
    }
    throw new Error(`Unknown guid brand: ${value}`);
  }
  const expectedLength = value instanceof Buffer ? value.length : value.length;
  const expectedBrand = lengthToGuidBrand(expectedLength);
  const verifiedBrand = verifyGuid(expectedBrand, value);
  if (verifiedBrand) {
    return expectedBrand;
  }
  throw new Error(`Unknown guid brand: ${value}`);
}

export function ensureDashFormat(guid: string): FullHexGuid {
  if (guid.length == 32) {
    // insert dashes
    const str = guid.replace(
      /(.{8})(.{4})(.{4})(.{4})(.{12})/,
      '$1-$2-$3-$4-$5'
    );
    return str as FullHexGuid;
  } else if (guid.length == 36) {
    return guid as FullHexGuid;
  } else {
    throw new Error('Invalid Guid');
  }
}

export function ensureShortFormat(
  guid: string | FullHexGuid | ShortHexGuid | Base64Guid
): ShortHexGuid {
  if (guid.length == 32) {
    return guid as ShortHexGuid;
  } else if (guid.length == 36) {
    const stringGuid = guid as string;
    const str = stringGuid.toString().replace(/-/g, '');
    return str as ShortHexGuid;
  } else if (guid.length == 22) {
    return Buffer.from(guid, 'base64').toString('hex') as ShortHexGuid;
  } else {
    throw new Error('Invalid Guid');
  }
}

export function fullHexFromBigInt(bigInt: bigint): FullHexGuid {
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
  return rebuiltUuid as FullHexGuid;
}

export function fullHexFromBase64(base64: string | Base64Guid): FullHexGuid {
  return ensureDashFormat(
    Buffer.from(base64, 'base64').toString('hex')
  ) as FullHexGuid;
}

export function toRawBuffer(value: AnyBrand): RawBuffer {
  const expectedBrand = whichBrand(value);
  const verifiedBrand = verifyGuid(expectedBrand, value);
  if (!verifiedBrand) {
    throw new Error(`Invalid guid brand: ${value}`);
  }
  let result: RawBuffer = Buffer.alloc(0) as RawBuffer;
  switch (expectedBrand) {
    case GuidBrand.FullHexGuid:
      result = Buffer.from(
        ensureShortFormat(value as FullHexGuid),
        'hex'
      ) as RawBuffer;
      break;
    case GuidBrand.ShortHexGuid:
      result = Buffer.from(
        ensureShortFormat(value as ShortHexGuid),
        'hex'
      ) as RawBuffer;
      break;
    case GuidBrand.Base64Guid:
      result = Buffer.from(value, 'base64') as RawBuffer;
      break;
    case GuidBrand.FullHexGuidBuffer:
      result = Buffer.from(ensureShortFormat(value.toString())) as RawBuffer;
      break;
    case GuidBrand.ShortHexGuidBuffer:
      result = Buffer.from(ensureShortFormat(value.toString())) as RawBuffer;
      break;
    case GuidBrand.Base64GuidBuffer:
      result = Buffer.from(value.toString(), 'base64') as RawBuffer;
      break;
    case GuidBrand.RawBuffer:
      result = value as RawBuffer;
      break;
    case GuidBrand.BigIntGuid:
      result = Buffer.from(
        ensureShortFormat(fullHexFromBigInt(value as bigint)),
        'hex'
      ) as RawBuffer;
      break;
    default:
      throw new Error(`Unknown guid brand: ${value}`);
  }
  return result;
}

export class GuidV4 {
  private _value: RawBuffer;
  constructor(value: string | AnyBrand) {
    const expectedBrand = whichBrand(value);
    const verifiedBrand = verifyGuid(expectedBrand, value);
    if (!verifiedBrand) {
      throw new Error(`Invalid guid: ${value}`);
    }
    this._value = toRawBuffer(value);

    if (!uuid.validate(ensureDashFormat(this._value.toString('hex')))) {
      throw new Error('Invalid Guid');
    }
  }
  public static new(): GuidV4 {
    return new GuidV4(uuid.v4() as FullHexGuid);
  }
  public get guid(): FullHexGuid {
    return ensureDashFormat(this._value.toString('hex')) as FullHexGuid;
  }
  public get uint8Array(): Uint8Array {
    return this._value as Uint8Array;
  }
  public get shortBuffer(): ShortHexGuidBuffer {
    return Buffer.from(this._value) as ShortHexGuidBuffer;
  }
  public get guidSringBuffer(): FullHexGuidBuffer {
    return Buffer.from(this.guid) as FullHexGuidBuffer;
  }
  public get asDashedString(): FullHexGuid {
    return ensureDashFormat(this._value.toString('hex')) as FullHexGuid;
  }
  public get asShortString(): ShortHexGuid {
    return ensureShortFormat(this.guid) as ShortHexGuid;
  }
  public toString(): Base64Guid {
    return this.base64 as Base64Guid;
  }
  public toJSON(): string {
    return this.base64;
  }
  public get bigInt(): BigIntGuid {
    return BigInt('0x' + this._value.toString('hex')) as BigIntGuid;
  }
  public get base64(): Base64Guid {
    return this._value.toString('base64') as Base64Guid;
  }
}

export default GuidV4;
