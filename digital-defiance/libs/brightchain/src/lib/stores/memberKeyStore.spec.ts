import { ISigningKeyPrivateKeyInfo } from "../interfaces";
import { KeyType } from "../keys/keyType";
import { MemberKeyType } from "../keys/memberKeyType";
import { StoredMemberKey } from "../keys/storedMemberKey";
import { StaticHelpersKeyPair } from "../staticHelpers.keypair";
import { MemberKeyStore } from "./memberKeyStore";

describe('memberKeyStore', () => {
    it('should be able to store and retrieve a value', () => {
        // create a memberKeyStore
        // create an authentication key
        // create a memberKey
        // store the memberKey
        // retrieve the memberKey
        // assert that the retrieved memberKey is the same as the stored memberKey
        
        // Arrange
        const memberKeyStore: MemberKeyStore = new MemberKeyStore();
        const authenticationKey: ISigningKeyPrivateKeyInfo = StaticHelpersKeyPair.generateSigningKeyPair();
        const memberKey: StoredMemberKey = StoredMemberKey.newAuthenticationKey(
            authenticationKey.publicKey,
            authenticationKey.privateKey,
        );
        // Act
        memberKeyStore.set(MemberKeyType.Authentication, memberKey);
        const retrievedMemberKey: StoredMemberKey = memberKeyStore.get(MemberKeyType.Authentication);
        // Assert
        expect(retrievedMemberKey).toEqual(memberKey);
    });
});