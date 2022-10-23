import { randomBytes } from 'crypto';
import BrightChainMember from '../brightChainMember';
import BrightChainMemberType from '../memberType';
import StaticHelpers from '../staticHelpers';
import StaticHelpersChecksum from '../staticHelpers.checksum';
import Block from './block';
import BlockSize, {
  blockSizeToLength,
  blockSizes,
  blockSizeLengths,
} from './blockSizes';

function randomBlockSize(): BlockSize {
  return blockSizes[Math.floor(Math.random() * blockSizes.length)];
}

describe('block', () => {
  it('should create a block', () => {
    const alice = BrightChainMember.newMember(
      BrightChainMemberType.User,
      'alice',
      'alice@example.com'
    );
    const blockSize = randomBlockSize();
    const data = randomBytes(blockSizeToLength(blockSize));
    const dateCreated = new Date();
    const block = new Block(alice, data, dateCreated);
    expect(block).toBeTruthy();
    expect(block.blockSize).toBe(blockSize);
    expect(block.data).toEqual(data);
    expect(block.id).toEqual(
      StaticHelpersChecksum.calculateChecksum(Buffer.from(data))
    );
    expect(block.createdBy).toEqual(alice.id);
    expect(block.createdById).toEqual(
      StaticHelpers.Uint8ArrayToUuidV4(alice.id)
    );
    expect(block.dateCreated).toEqual(dateCreated);
  });
});
