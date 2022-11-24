import { makeExpectedISettings } from "./testUtils";

describe('testUtils', () => {
    it("should throw when an invalid change key is given to makeExpectedISettings", () => {
        expect(() => makeExpectedISettings('invalidKey', 'invalidValue')).toThrow();
    });
});