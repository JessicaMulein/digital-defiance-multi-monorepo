import BrightChainMember from '../brightChainMember';
import { IReadOnlyDataObject } from '../interfaces';
import StaticHelpersChecksum from '../staticHelpers.checksum';

export default class Block implements IReadOnlyDataObject {
    constructor(creator: BrightChainMember, data: Uint8Array, encrypted: boolean, checksum?: Uint8Array, id?: string, dateCreated?: Date, dateUpdated?: Date) {
        this.createdBy = creator.id;
        this.data = data;
        this.checksum = checksum ?? StaticHelpersChecksum.calculateChecksum(Buffer.from(data));
        this.id = id ?? Buffer.from(this.checksum).toString('hex');
        this.encrypted = encrypted;
        // don't create a new date object with nearly identical values to the existing one
        let _now: null | Date = null;
        const now = function () {
        if (!_now) {
            _now = new Date();
        }
        return _now;
        };
        this.dateCreated = dateCreated ?? now();
    }
    public readonly id: string;
    public readonly encrypted: boolean;
    public readonly data: Uint8Array;
    public readonly checksum: Uint8Array;
    public readonly createdBy: string;
    public readonly dateCreated: Date;
}