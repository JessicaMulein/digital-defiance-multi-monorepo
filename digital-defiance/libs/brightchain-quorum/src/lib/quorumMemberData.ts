import * as uuid from 'uuid';
import StaticHelpers from './staticHelpers';

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
    if (!uuid.validate(this.id)) {
      throw new Error('Invalid quorum member ID');
    }
    this.name = name;
    if (!this.name || this.name.length == 0) {
      throw new Error('Quorum member name missing');
    }
    if (this.name.trim() != this.name) {
      throw new Error('Quorum member name has leading or trailing spaces');
    }
    this.contactEmail = contactEmail;
    if (!this.contactEmail || this.contactEmail.length == 0) {
      throw new Error('Quorum member email missing');
    }
    if (this.contactEmail.trim() != this.contactEmail) {
      throw new Error('Quorum member email has leading or trailing spaces');
    }
    if (!StaticHelpers.validateEmail(this.contactEmail)) {
      throw new Error('Quorum member email is invalid');
    }
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
