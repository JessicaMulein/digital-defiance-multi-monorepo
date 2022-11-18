import { ILocalSettings } from "./interfaces";

/**
 * Settings stored in browser local storage only (not global sync)
 */
export class LocalSettings implements ILocalSettings
{
    public readonly includedSites: string[];
    public readonly excludedSites: string[];
    public readonly onByDefault: boolean;
    public readonly extensionEnabled: boolean;

    constructor(includedSites: string[], excludedSites: string[], onByDefault: boolean, extensionEnabled: boolean) {
        this.includedSites = includedSites;
        this.excludedSites = excludedSites;
        this.onByDefault = onByDefault;
        this.extensionEnabled = extensionEnabled;
    }
}