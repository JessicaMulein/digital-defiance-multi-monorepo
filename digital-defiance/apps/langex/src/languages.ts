import { isValid } from "all-iso-language-codes";

export function languageSupported(language: string): boolean {
    const result = isValid(language);
    if (typeof result === "boolean") {
        return result;
    } else if (typeof result === "object") {
        return result.found;
    } else {
        return false;
    }
}