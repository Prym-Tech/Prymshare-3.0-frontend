import { atom } from 'jotai';

// Holds the entire page object currently being edited
export const activePageAtom = atom(null);

// Holds the array of section objects for the active page
export const pageSectionsAtom = atom([]);

// Holds customization settings for the active page
export const pageThemeAtom = atom({
    template: 'default',
    backgroundColor: '#FFFFFF',
    headerColor: '#121B00',
    // ... other theme properties
});

// NEW & FIXED: Holds the ID of the section currently being edited.
// null means no section is being edited (the main block list is shown).
export const editingSectionIdAtom = atom(null);

