import BrightChainMember from '../brightChainMember';
import { IReadOnlyDataObject } from '../interfaces';
import StaticHelpers from '../staticHelpers';
import StaticHelpersChecksum from '../staticHelpers.checksum';
import BlockSize, { lengthToBlockSize, validateBlockSize } from './blockSizes';

export default class Block implements IReadOnlyDataObject {
  constructor(
    creator: BrightChainMember,
    data: Uint8Array,
    dateCreated?: Date,
    checksum?: Uint8Array
  ) {
    this.createdBy = creator.id;
    this.data = data;
    if (!validateBlockSize(data.length)) {
      throw new Error(`Data length ${data.length} is not a valid block size`);
    }
    this.id = StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
    if (checksum && Buffer.from(this.id).equals(Buffer.from(checksum))) {
      throw new Error('Checksum mismatch');
    }
    this.dateCreated = dateCreated ?? new Date();
  }
  public readonly id: Uint8Array;
  public get blockSize(): BlockSize {
    return lengthToBlockSize(this.data.length);
  }
  public readonly data: Uint8Array;
  public get checksumString() {
    return Buffer.from(this.id).toString('hex');
  }
  public readonly createdBy: Uint8Array;
  public get createdById(): string {
    return StaticHelpers.Uint8ArrayToUuidV4(this.createdBy);
  }
  public readonly dateCreated: Date;
  public xor(other: Block, agent: BrightChainMember): Block {
    if (this.blockSize !== other.blockSize) {
      throw new Error('Block sizes do not match');
    }
    const data = new Uint8Array(this.data.length);
    for (let i = 0; i < this.data.length; i++) {
      data[i] = this.data[i] ^ other.data[i];
    }
    return new Block(agent, data);
  }
}
