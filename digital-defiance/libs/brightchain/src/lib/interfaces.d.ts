export interface ISimpleKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface ISimpleKeyPairBuffer {
  publicKey: Buffer;
  privateKey: Buffer;
}

export interface ISigningKeyInfo {
  keyPair: kp;
  publicKey: Buffer;
  privateKey: Buffer;
  seedHex: string;
  entropy: string;
  mnemonic: string;
}

export interface IDataAndSigningKeys {
  signing: ec.KeyPair;
  data: ISimpleKeyPairBuffer;
}

export interface IDataKeyComponents {
  salt: Buffer;
  iterations: number;
  data: Buffer;
}

export interface IPbkf2Config {
  hashBytes: number;
  saltBytes: number;
  iterations: number;
}

export interface IPbkdf2Result {
  salt: Buffer;
  hash: Buffer;
  iterations: number;
}

export interface ISealResults {
  encryptedData: Buffer;
  encryptedKey: Buffer;
}

export interface ISymmetricEncryptionResults {
  encryptedData: Buffer;
  key: Buffer;
}

export interface Position {
  place: number;
}

export interface IBasicObject {
  /**
   * ID of the data object. UUID v4.
   */
  id: string;
  /**
   * The date this object was created
   */
  dateCreated: Date;
  /**
   * The date this object was last updated
   */
  dateUpdated: Date;
}

export interface IBasicDataObject extends IBasicObject {
  /**
   * ID of the data object. UUID v4.
   */
  id: string;
  /**
   * Flag indicating whether the data is encrypted
   */
  encrypted: boolean;
  /**
   * The data to be stored
   */
  data: Buffer;
  /**
   * Checksum (SHA-3) of the data to verify integrity
   */
  checksum: Buffer;
  /**
   * The ID of the member who created this object
   */
  createdBy: string;
  /**
   * The ID of the member who last updated this object
   */
  updatedBy: string;
  /**
   * The date this object was created
   */
  dateCreated: Date;
  /**
   * The date this object was last updated
   */
  dateUpdated: Date;
}

export interface IReadOnlyBasicObject extends IBasicObject {
  readonly id: string;
  readonly dateCreated: Date;
  readonly dateUpdated: Date;
}

export interface IReadOnlyDataObject extends IBasicDataObject, IReadOnlyBasicObject {
  readonly id: string;
  readonly encrypted: boolean;
  readonly data: Buffer;
  readonly checksum: Buffer;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly dateCreated: Date;
  readonly dateUpdated: Date;
}
