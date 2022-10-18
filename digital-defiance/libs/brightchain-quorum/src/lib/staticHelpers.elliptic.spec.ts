import { ec } from "elliptic";
import { Signature } from "./signature";
import StaticHelpersElliptic from "./staticHelpers.elliptic";
import StaticHelpersKeyPair from "./staticHelpers.keypair";

describe("brightchain-quorum staticHelpers.elliptic", () => {
    it("should convert between EC classes", () => {
        const data = Buffer.from("hello world");
        const keyPair = StaticHelpersKeyPair.generateSigningKeyPair();
        const signature: ec.Signature = StaticHelpersKeyPair.signWithSigningKey(keyPair.keyPair, data);
        const ourSignature: Signature = StaticHelpersElliptic.ourECfromEC(signature);
        const theirSignature: ec.Signature = StaticHelpersElliptic.ECfromOurEC(ourSignature);
        expect(theirSignature.r.toString()).toBe(signature.r.toString());
        expect(theirSignature.s.toString()).toBe(signature.s.toString());
        expect(theirSignature.recoveryParam).toBe(signature.recoveryParam);
    });
});