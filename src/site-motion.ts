import { setupSectionReveals } from './lib/section-reveal';
import { setupStudioCampaignHandoff } from './lib/studio-campaign';

// Static blog pages share the marketing pages' motion without a React mount.
function start() {
  const stop = setupSectionReveals();
  setupStudioCampaignHandoff(document.body);
  window.addEventListener('pagehide', stop, { once: true });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
