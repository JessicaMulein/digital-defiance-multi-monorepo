import { randomUUID } from 'crypto';
import GuidV4, { Guid } from './guid';

describe('guid', () => {
  it('should create a new guid', () => {
    const guid = GuidV4.new();
    expect(guid.guid).toBeTruthy();
  });
  it('should convert uuid to and from bigint', () => {
    const uuid = GuidV4.new();
    const uuidBigint = uuid.bigInt;
    const uuid2 = GuidV4.fromBigint(uuidBigint);
    expect(uuid).toEqual(uuid2);
  });
});
it('should convert uuid to and from base64', () => {
  const uuid = GuidV4.new();
  const uuidBase64 = uuid.base64;
  const uuid2 = GuidV4.fromBase64(uuidBase64);
  expect(uuid.guid).toEqual(uuid2.guid);
});
it('should convert uuid to and from buffer', () => {
  const uuid = GuidV4.new();
  const uuidBuffer = uuid.shortBuffer;
  const uuid2 = GuidV4.fromBuffer(uuidBuffer);
  expect(uuid).toEqual(uuid2);
});
it('should convert uuid to and from string buffer', () => {
  const uuid = GuidV4.new();
  const uuidBuffer = uuid.guidSringBuffer;
  const uuid2 = GuidV4.fromStringBuffer(uuidBuffer);
  expect(uuid).toEqual(uuid2);
});
