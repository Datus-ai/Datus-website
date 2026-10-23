import { setupSectionReveals } from './lib/section-reveal';

// Static blog pages share the marketing pages' motion without a React mount.
function start(){const stop=setupSectionReveals();window.addEventListener('pagehide',stop,{once:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
