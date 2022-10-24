import { randomBytes } from 'crypto';
import BrightChainMember from '../brightChainMember';
import BrightChainMemberType from '../memberType';
import StaticHelpers from '../staticHelpers';
import StaticHelpersChecksum from '../staticHelpers.checksum';
import Block from './block';
import BlockSize, { blockSizeToLength, blockSizes } from './blockSizes';

function randomBlockSize(): BlockSize {
  // need to skip unknown block size
  const blockIndex = 1 + Math.floor(Math.random() * (blockSizes.length - 1));
  return blockSizes[blockIndex];
}

describe('block', () => {
  const alice = BrightChainMember.newMember(
    BrightChainMemberType.User,
    'alice',
    'alice@example.com'
  );
  const bob = BrightChainMember.newMember(
    BrightChainMemberType.User,
    'bob',
    'bob@example.com'
  );
  it('should create a block', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const checksum = StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
    const dateCreated = new Date();
    const block = new Block(alice, data, dateCreated);
    expect(block).toBeTruthy();
    expect(block.blockSize).toBe(blockSize);
    expect(block.data).toEqual(data);
    expect(block.id).toEqual(checksum);
    expect(block.checksumString).toEqual(checksum.toString('hex'));
    expect(block.createdBy).toEqual(alice.id);
    expect(block.createdById).toEqual(
      StaticHelpers.Uint8ArrayToUuidV4(alice.id)
    );
    expect(block.dateCreated).toEqual(dateCreated);
    expect(true).toBeTruthy();
  });
  it('should convert a block to json and back', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const checksum = StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
    const dateCreated = new Date();
    const block = new Block(alice, data, dateCreated, checksum);
    const json = block.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rebuiltBlock = Block.fromJSON(json, (memberId: Uint8Array) => alice);
    expect(rebuiltBlock).toBeTruthy();
    expect(rebuiltBlock.blockSize).toBe(block.blockSize);
    expect(rebuiltBlock.data).toEqual(block.data);
    expect(rebuiltBlock.id).toEqual(block.id);
    expect(rebuiltBlock.createdBy).toEqual(block.createdBy);
    expect(rebuiltBlock.createdById).toEqual(block.createdById);
    expect(rebuiltBlock.dateCreated).toEqual(block.dateCreated);
    expect(true).toBeTruthy();
  });
  it('should convert a block to json and fail to convert back with a bad member source', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const checksum = StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
    const dateCreated = new Date();
    const block = new Block(alice, data, dateCreated, checksum);
    const json = block.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(() => Block.fromJSON(json, (memberId: Uint8Array) => bob)).toThrow(
      'Member mismatch'
    );
    expect(true).toBeTruthy();
  });
  it('should throw when given a bad checksum', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const dateCreated = new Date();
    const badData = randomBytes(blockSizeToLength(blockSize));
    const badChecksum = StaticHelpersChecksum.calculateChecksum(
      Buffer.from(badData)
    );
    expect(() => new Block(alice, data, dateCreated, badChecksum)).toThrow(
      'Checksum mismatch'
    );
    expect(true).toBeTruthy();
  });
  it('should throw when making an empty block', (done) => {
    setTimeout(done, 5000);
    const data = Buffer.from(new Uint8Array());
    const dateCreated = new Date();
    expect(() => new Block(alice, data, dateCreated)).toThrow(
      `Data length ${data.length} is not a valid block size`
    );
    expect(true).toBeTruthy();
  });
  it('should throw when making a block of a bad size', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize) + 1);
    const dateCreated = new Date();
    expect(() => new Block(alice, data, dateCreated)).toThrow(
      `Data length ${data.length} is not a valid block size`
    );
    expect(true).toBeTruthy();
  });
  it('should make dateCreated valus when not provided', (done) => {
    setTimeout(done, 5000);
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const checksum = StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
    const dateCreated = new Date();
    const block = new Block(alice, data, undefined, checksum);
    expect(block.dateCreated).toBeTruthy();
    expect(block.dateCreated).toBeInstanceOf(Date);
    // the difference between the dateCreated call and the block dateCreated should be far less than 1 second
    const delta = Math.abs(block.dateCreated.getTime() - dateCreated.getTime());
    expect(delta).toBeLessThan(1000);
    expect(delta).toBeGreaterThanOrEqual(0);
    expect(true).toBeTruthy();
  });
  it('should not xor with different block sizes', (done) => {
    setTimeout(done, 5000);
    const blockA = new Block(alice, randomBytes(BlockSize.Tiny), new Date());
    const blockB = new Block(alice, randomBytes(BlockSize.Nano), new Date());
    expect(() => blockA.xor(blockB, alice)).toThrow('Block sizes do not match');
    expect(true).toBeTruthy();
  });
  it('should xor with same block sizes', (done) => {
    setTimeout(done, 5000);
    const blockLength: number = BlockSize.Nano;
    const blockA = new Block(alice, randomBytes(blockLength), new Date());
    const blockB = new Block(alice, randomBytes(blockLength), new Date());
    const blockC = blockA.xor(blockB, alice);
    const expectedData = Buffer.alloc(blockLength);
    for (let i = 0; i < blockLength; i++) {
      expectedData[i] = blockA.data[i] ^ blockB.data[i];
    }
    expect(blockC.data).toEqual(expectedData);
    expect(blockC.createdBy).toEqual(alice.id);
    expect(blockC.id).toEqual(
      Buffer.from(StaticHelpersChecksum.calculateChecksum(expectedData))
    );
    expect(true).toBeTruthy();
  });
});
