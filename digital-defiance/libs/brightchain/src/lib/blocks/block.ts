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
    this.createdBy = Buffer.from(creator.id);
    if (!validateBlockSize(data.length)) {
      throw new Error(`Data length ${data.length} is not a valid block size`);
    }
    this.data = Buffer.from(data);
    this.id = Buffer.from(
      StaticHelpersChecksum.calculateChecksum(Buffer.from(data))
    );
    if (
      checksum !== undefined &&
      checksum.length == this.id.length &&
      !Buffer.from(this.id).equals(Buffer.from(checksum))
    ) {
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
    return StaticHelpers.Uint8ArrayToUuidV4(this.createdBy, false);
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
  public toJSON(): string {
    return JSON.stringify({
      id: Buffer.from(this.id).toString('hex'),
      data: Buffer.from(this.data).toString('hex'),
      createdBy: Buffer.from(this.createdBy).toString('hex'),
      dateCreated: this.dateCreated,
    });
  }
  public static fromJSON(
    json: string,
    fetchMember: (memberId: Uint8Array) => BrightChainMember
  ): Block {
    const parsed = JSON.parse(json);
    const parsedMemberId = Buffer.from(parsed.createdBy, 'hex');
    const data = Buffer.from(parsed.data, 'hex');
    const dateCreated = new Date(parsed.dateCreated);
    const parsedBlockId = Buffer.from(parsed.id, 'hex');
    const member = fetchMember(parsedMemberId);
    if (
      member.id.length != parsedMemberId.length ||
      !Buffer.from(member.id).equals(parsedMemberId)
    ) {
      throw new Error('Member mismatch');
    }
    return new Block(member, data, dateCreated, parsedBlockId);
  }
}
