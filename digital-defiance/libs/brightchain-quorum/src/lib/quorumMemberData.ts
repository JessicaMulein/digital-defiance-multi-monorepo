import * as uuid from 'uuid';

export default class QuorumMemberData {
  public readonly id: string;
  public readonly name: string;
  public readonly contactEmail: string;
  public readonly dateCreated: Date;
  public readonly dateUpdated: Date;
  constructor(
    name: string,
    contactEmail: string,
    dateCreated?: Date,
    dateUpdated?: Date,
    id?: string
  ) {
    //super(memberIds, sharesRequired, encryptedData, checksum, id, dateCreated, dateUpdated);
    this.id = id ?? uuid.v4();
    this.name = name;
    this.contactEmail = contactEmail;
    // don't create a new date object with nearly identical values to the existing one
    let _now: null | Date = null;
    const now = function () {
      if (!_now) {
        _now = new Date();
      }
      return _now;
    };
    this.dateCreated = dateCreated ?? now();
    this.dateUpdated = dateUpdated ?? now();
  }
}
