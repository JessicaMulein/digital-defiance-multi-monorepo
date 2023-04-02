import {
    IconDefinition,
    IconName,
    IconPack,
    IconPrefix,
    Library,
} from '@fortawesome/fontawesome-svg-core';

export interface IFontAwesomeLibrary {
    definitions: { [prefix: string]: { [name: string]: IconDefinition } };
    search(term: string): IconDefinition[];
}

/**
 * Implements the FontAwesome library interface to allow for searching
 */
export class FontAwesomeLibrary implements Library, IFontAwesomeLibrary {
    public readonly definitions: { [prefix: string]: { [name: string]: IconDefinition } } = {};

    addIcons(...icons: IconDefinition[]) {
      for (const icon of icons) {
        if (!(icon.prefix in this.definitions)) {
          this.definitions[icon.prefix] = {};
        }
        this.definitions[icon.prefix][icon.iconName] = icon;
        for (const alias of icon.icon[2]) {
          if (typeof alias === 'string') {
            this.definitions[icon.prefix][alias] = icon;
          }
        }
      }
    }
  
    addIconPacks(...packs: IconPack[]) {
      for (const pack of packs) {
        const icons = Object.keys(pack).map((key) => pack[key]);
        this.addIcons(...icons);
      }
    }
  
    getIconDefinition(prefix: IconPrefix, name: IconName): IconDefinition | null {
      if (prefix in this.definitions && name in this.definitions[prefix]) {
        return this.definitions[prefix][name];
      }
      return null;
    }
    public has(prefix: IconPrefix, icon: IconName): boolean {
        return this.getIconDefinition(prefix, icon) !== null;
    }
    public add(...definitions: (IconDefinition | IconPack)[]): void {
        for (const definition of definitions) {
            if (definition.prefix) {
                this.addIcons(definition as IconDefinition);
            } else {
                this.addIconPacks(definition as IconPack);
            }
        }
    }
    public reset(): void {
        for (const prefix of Object.keys(this.definitions)) {
            for (const name of Object.keys(this.definitions[prefix])) {
                delete this.definitions[prefix][name];
            }
        }
    }
    public search(term: string): IconDefinition[] {
        const icons: IconDefinition[] = [];
        const searchLower = term.toLowerCase();
        for (const prefix of Object.keys(this.definitions)) {
            for (const name of Object.keys(this.definitions[prefix])) {
                const icon = this.definitions[prefix][name];
                if (icon.iconName.indexOf(searchLower) !== -1) {
                    icons.push(icon);
                }
            }
        }
        return icons;
    }
}
