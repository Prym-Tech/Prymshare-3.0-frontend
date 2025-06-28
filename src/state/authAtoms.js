import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';



export const authTokenAtom = atomWithStorage('prymshare_access_token', null);
export const refreshTokenAtom = atomWithStorage('prymshare_refresh_token', null);
export const userAtom = atomWithStorage('prymshare_user', null);
export const isAuthenticatedAtom = atom(get => get(authTokenAtom) !== null);

// NEW: This atom tracks if the initial "am I logged in?" check is running.
export const authLoadingAtom = atom(true);

