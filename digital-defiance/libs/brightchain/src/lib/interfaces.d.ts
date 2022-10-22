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
   * ID of the data object. Must be unique, usually UUID v4.
   */
  id: Uint8Array;
  /**
   * The date this object was created
   */
  dateCreated: Date;
}

export interface IBasicDataObject extends IBasicObject {
  /**
   * ID of the data object. UUID v4.
   */
  id: Uint8Array;
  /**
   * Flag indicating whether the data is encrypted
   */
  encrypted: boolean;
  /**
   * The data to be stored
   */
  data: Uint8Array;
  /**
   * Checksum (SHA-3) of the data to verify integrity
   */
  checksum: Uint8Array;
  /**
   * The ID of the member who created this object
   */
  createdBy: Uint8Array;
  /**
   * The date this object was created
   */
  dateCreated: Date;
}

export interface IReadOnlyBasicObject extends IBasicObject {
  readonly id: Uint8Array;
  readonly dateCreated: Date;
}

export interface IReadOnlyDataObject extends IBasicDataObject, IReadOnlyBasicObject {
  readonly id: Uint8Array;
  readonly encrypted: boolean;
  readonly data: Uint8Array;
  readonly checksum: Uint8Array;
  readonly createdBy: string;
  readonly dateCreated: Date;
}
