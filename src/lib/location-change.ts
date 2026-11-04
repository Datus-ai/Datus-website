// replaceState does not emit popstate. Notify links that preserve the current URL.
export const LOCATION_CHANGE_EVENT = 'datus:locationchange';

export function replaceLocation(url: string): void {
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === url) return;
  window.history.replaceState(window.history.state, '', url);
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
}
