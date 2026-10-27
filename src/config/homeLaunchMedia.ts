import type { Locale } from '../i18n/config';

/** Replace the overview architecture with the approved launch video when ready.
 * Use repo-hosted assets or an approved media URL; no fake play/coming-soon state.
 * Supply a poster and captions before enabling the video. No autoplay.
 */
export const HOME_LAUNCH_MEDIA:{src:string|null;poster:string|null;captions:Partial<Record<Locale,string>>}={
 src:null,
 poster:null,
 captions:{},
};
