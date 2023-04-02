import {
  IconDefinition,
  IconPack,
} from '@fortawesome/fontawesome-common-types';
import { FontAwesomeLibrary } from './fontAwesomeLibrary';
import { generateIconPack } from './faTestUtil';

describe('FontAwesomeLirary', () => {
  let library: FontAwesomeLibrary;

  beforeEach(() => {
    library = new FontAwesomeLibrary();
  });
  it('should add icon packs to the library', () => {
    const iconPack: IconPack = generateIconPack(2);
    expect(Object.keys(iconPack).length).toEqual(2);
    library.add(iconPack);
    expect(library.has('fas', iconPack.fas.iconName));
    expect(library.definitions).toContain(iconPack[Object.keys(iconPack)[0]]);
    expect(library.definitions).toContain(iconPack[Object.keys(iconPack)[1]]);
  });
  it('should add icon definitions to the library', () => {
    const iconPack: IconPack = generateIconPack(2);
    for (const icon of Object.values(iconPack)) {
      library.add(icon);
    }
    expect(library.definitions).toContain(iconPack[Object.keys(iconPack)[0]]);
    expect(library.definitions).toContain(iconPack[Object.keys(iconPack)[1]]);
  });

  it('should reset the library', () => {
    const iconPack: IconPack = generateIconPack(1);
    const icons: IconDefinition[] = [];
    for (const icon of Object.values(iconPack)) {
      library.add(icon);
      icons.push(icon);
    }
    expect(library.definitions).toContain(icons[0]);

    library.reset();
    expect(library.definitions).toEqual([]);
  });

  it('should search for icon definitions', () => {
    const iconPack: IconPack = generateIconPack(3);
    const icons = Object.values(library.definitions);
    expect(icons.length).toEqual(3);
    for (const icon of Object.values(iconPack)) {
      library.add(icon);
    }
    expect(library.search(icons[0].icon.iconName.substring(0, 3))).toContain(
      icons[0]
    );
    expect(library.search(icons[1].icon.iconName.substring(0, 3))).toContain(
      icons[1]
    );
    expect(library.search(icons[2].icon.iconName.substring(0, 3))).toContain(
      icons[2]
    );
  });
});
