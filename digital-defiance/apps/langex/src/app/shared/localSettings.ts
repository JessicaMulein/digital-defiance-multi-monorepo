/**
 * Settings stored in browser local storage only (not global sync)
 * (move to interfaces? make class?)
 */
export interface LocalSettings {
    readonly includedSites: string[];
    readonly excludedSites: string[];
    readonly onByDefault: boolean;
    readonly extensionEnabled: boolean;
}